'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autorizado');

  const nombre = formData.get('nombre') as string;
  const slug = (formData.get('slug') as string) || slugify(nombre);
  const descripcion = formData.get('descripcion') as string;
  const descripcionCorta = formData.get('descripcionCorta') as string;
  const precio = parseFloat(formData.get('precio') as string);
  const precioOriginalStr = formData.get('precioOriginal') as string;
  const precioOriginal = precioOriginalStr ? parseFloat(precioOriginalStr) : null;
  const categoryId = formData.get('categoryId') as string;
  const ocasiones = formData.getAll('ocasiones') as string[];
  const badge = (formData.get('badge') as string) || null;
  const enStock = formData.get('enStock') === 'on';
  const destacado = formData.get('destacado') === 'on';
  const imagenesRaw = formData.get('imagenes') as string;
  const imagenes = imagenesRaw
    ? imagenesRaw.split(',').map((url) => url.trim()).filter(Boolean)
    : [];

  if (!nombre || !descripcion || !descripcionCorta || isNaN(precio) || !categoryId) {
    throw new Error('Faltan campos requeridos');
  }

  await prisma.product.create({
    data: {
      nombre,
      slug,
      descripcion,
      descripcionCorta,
      precio,
      precioOriginal,
      categoryId,
      ocasiones: JSON.stringify(ocasiones),
      imagenes: JSON.stringify(imagenes),
      badge: badge === '' ? null : badge,
      enStock,
      destacado,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/');
  redirect('/admin/productos');
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autorizado');

  const nombre = formData.get('nombre') as string;
  const slug = (formData.get('slug') as string) || slugify(nombre);
  const descripcion = formData.get('descripcion') as string;
  const descripcionCorta = formData.get('descripcionCorta') as string;
  const precio = parseFloat(formData.get('precio') as string);
  const precioOriginalStr = formData.get('precioOriginal') as string;
  const precioOriginal = precioOriginalStr ? parseFloat(precioOriginalStr) : null;
  const categoryId = formData.get('categoryId') as string;
  const ocasiones = formData.getAll('ocasiones') as string[];
  const badge = (formData.get('badge') as string) || null;
  const enStock = formData.get('enStock') === 'on';
  const destacado = formData.get('destacado') === 'on';
  const imagenesRaw = formData.get('imagenes') as string;
  const imagenes = imagenesRaw
    ? imagenesRaw.split(',').map((url) => url.trim()).filter(Boolean)
    : [];

  if (!nombre || !descripcion || !descripcionCorta || isNaN(precio) || !categoryId) {
    throw new Error('Faltan campos requeridos');
  }

  await prisma.product.update({
    where: { id },
    data: {
      nombre,
      slug,
      descripcion,
      descripcionCorta,
      precio,
      precioOriginal,
      categoryId,
      ocasiones: JSON.stringify(ocasiones),
      imagenes: JSON.stringify(imagenes),
      badge: badge === '' ? null : badge,
      enStock,
      destacado,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/');
  redirect('/admin/productos');
}

export async function deleteProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autorizado');

  const id = formData.get('id') as string;
  if (!id) throw new Error('ID de producto requerido');

  await prisma.product.delete({ where: { id } });

  revalidatePath('/admin/productos');
  revalidatePath('/');
}

export async function toggleProductStock(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autorizado');

  const id = formData.get('id') as string;
  if (!id) throw new Error('ID de producto requerido');

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error('Producto no encontrado');

  const newStockStatus = !product.enStock;

  await prisma.product.update({
    where: { id },
    data: { enStock: newStockStatus },
  });

  // Notify n8n webhook when product goes back in stock
  if (newStockStatus && process.env.N8N_WEBHOOK_STOCK_URL) {
    fetch(process.env.N8N_WEBHOOK_STOCK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        productName: product.nombre,
        productSlug: product.slug,
        productPrice: product.precio,
        productImage: JSON.parse(product.imagenes)[0],
        enStock: true,
      }),
    }).catch(() => {
      // Non-blocking: don't fail the stock toggle if n8n is unreachable
    });
  }

  revalidatePath('/admin/productos');
  revalidatePath('/');
}
