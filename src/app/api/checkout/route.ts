import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPaymentPreference } from '@/lib/mercadopago';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';

interface CheckoutItem {
  productoId: string;
  slug: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

interface CheckoutBody {
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  direccion?: string;
  notas?: string;
  items: CheckoutItem[];
  metodoPago: 'mercadopago' | 'whatsapp';
}

export async function POST(request: NextRequest) {
  try {
    // ─── MED-1: Protección CSRF — verificar que el origen sea nuestro sitio ────
    const origin = request.headers.get('origin');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl && origin) {
      const allowedOrigin = new URL(appUrl).origin;
      if (origin !== allowedOrigin) {
        return NextResponse.json(
          { error: 'Origen no permitido.' },
          { status: 403 }
        );
      }
    }

    const body: CheckoutBody = await request.json();

    const { clienteNombre, clienteTelefono, clienteEmail, direccion, notas, items, metodoPago } =
      body;

    // Validar campos requeridos
    if (!clienteNombre?.trim() || !clienteTelefono?.trim()) {
      return NextResponse.json(
        { error: 'Nombre y telefono son obligatorios.' },
        { status: 400 }
      );
    }

    // ─── MED-2: Validar longitud de campos ───────────────────────────────────
    if (clienteNombre.trim().length > 100) {
      return NextResponse.json(
        { error: 'El nombre es demasiado largo (maximo 100 caracteres).' },
        { status: 400 }
      );
    }
    if (clienteTelefono.trim().length > 20) {
      return NextResponse.json(
        { error: 'El telefono es demasiado largo (maximo 20 caracteres).' },
        { status: 400 }
      );
    }
    if (direccion && direccion.trim().length > 500) {
      return NextResponse.json(
        { error: 'La direccion es demasiado larga (maximo 500 caracteres).' },
        { status: 400 }
      );
    }
    if (notas && notas.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Las notas son demasiado largas (maximo 1000 caracteres).' },
        { status: 400 }
      );
    }

    // ─── MED-3: Validar formato de email si fue proporcionado ────────────────
    if (clienteEmail && clienteEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clienteEmail.trim()) || clienteEmail.trim().length > 254) {
        return NextResponse.json(
          { error: 'El correo electronico no es valido.' },
          { status: 400 }
        );
      }
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito esta vacio.' },
        { status: 400 }
      );
    }

    // ─── HIGH-2: Validar cantidad de cada item ───────────────────────────────
    for (const item of items) {
      if (!Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 50) {
        return NextResponse.json(
          { error: 'Cantidad no valida. Debe ser entre 1 y 50 por producto.' },
          { status: 400 }
        );
      }
    }

    if (items.length > 20) {
      return NextResponse.json(
        { error: 'Demasiados productos en el carrito (maximo 20).' },
        { status: 400 }
      );
    }

    if (!['mercadopago', 'whatsapp'].includes(metodoPago)) {
      return NextResponse.json(
        { error: 'Metodo de pago no valido.' },
        { status: 400 }
      );
    }

    // Re-obtener precios de la base de datos (NUNCA confiar en precios del cliente)
    const productIds = items.map((item) => item.productoId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Uno o mas productos no fueron encontrados.' },
        { status: 400 }
      );
    }

    // Validar que todos los productos esten en stock
    const outOfStock = products.filter((p) => !p.enStock);
    if (outOfStock.length > 0) {
      return NextResponse.json(
        { error: `Producto agotado: ${outOfStock.map((p) => p.nombre).join(', ')}` },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calcular con precios reales de la DB
    const verifiedItems = items.map((item) => {
      const dbProduct = productMap.get(item.productoId)!;
      return {
        productoId: item.productoId,
        nombre: dbProduct.nombre,
        precio: dbProduct.precio,
        cantidad: item.cantidad,
      };
    });

    const subtotal = verifiedItems.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    const envio = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + envio;

    // Crear orden y items en una transaccion
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          clienteNombre: clienteNombre.trim(),
          clienteTelefono: clienteTelefono.trim(),
          clienteEmail: clienteEmail?.trim() || null,
          direccion: direccion?.trim() || null,
          notas: notas?.trim() || null,
          subtotal,
          envio,
          total,
          estado: 'pendiente',
          metodoPago,
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.productoId,
              nombre: item.nombre,
              precio: item.precio,
              cantidad: item.cantidad,
            })),
          },
        },
        include: { items: true },
      });

      return newOrder;
    });

    // Generar URL de redireccion segun el metodo de pago
    if (metodoPago === 'mercadopago') {
      const redirectUrl = await createPaymentPreference({
        id: order.id,
        clienteNombre: order.clienteNombre,
        clienteEmail: order.clienteEmail,
        items: order.items.map((item) => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        envio,
        total,
      });

      return NextResponse.json({ redirectUrl, orderId: order.id });
    }

    // WhatsApp
    const whatsappUrl = buildWhatsAppOrderUrl({
      id: order.id,
      clienteNombre: order.clienteNombre,
      items: order.items.map((item) => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      subtotal,
      envio,
      total,
      direccion: order.direccion,
      notas: order.notas,
    });

    return NextResponse.json({ redirectUrl: whatsappUrl, orderId: order.id });
  } catch (error) {
    console.error('Error en checkout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
