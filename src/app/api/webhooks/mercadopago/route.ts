import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPaymentInfo } from '@/lib/mercadopago';
import crypto from 'crypto';

// ─── HIGH-1: Verificar firma HMAC de MercadoPago ────────────────────────────
// MercadoPago envia un header x-signature con cada webhook.
// Debemos verificar que el request realmente proviene de MercadoPago.
// Configura MP_WEBHOOK_SECRET en tu .env con el secret del panel de MP.
function verifyWebhookSignature(
  request: NextRequest,
  dataId: string
): boolean {
  const webhookSecret = process.env.MP_WEBHOOK_SECRET;

  // Si no hay secret configurado, advertir pero NO bloquear (para desarrollo)
  if (!webhookSecret) {
    console.warn(
      'Webhook MP: MP_WEBHOOK_SECRET no configurado. La verificacion de firma esta desactivada. ' +
      'Configura esta variable antes de ir a produccion.'
    );
    return true;
  }

  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');

  if (!xSignature || !xRequestId) {
    console.error('Webhook MP: Faltan headers x-signature o x-request-id');
    return false;
  }

  // Parsear ts y v1 del header x-signature (formato: "ts=xxx,v1=yyy")
  const parts: Record<string, string> = {};
  for (const part of xSignature.split(',')) {
    const [key, value] = part.trim().split('=');
    if (key && value) parts[key] = value;
  }

  if (!parts.ts || !parts.v1) {
    console.error('Webhook MP: Formato de x-signature invalido');
    return false;
  }

  // Construir el manifest y calcular HMAC
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${parts.ts};`;
  const hmac = crypto
    .createHmac('sha256', webhookSecret)
    .update(manifest)
    .digest('hex');

  return hmac === parts.v1;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mercado Pago envia notificaciones con type y data.id
    if (body.type === 'payment') {
      const paymentId = body.data?.id;

      if (!paymentId) {
        console.error('Webhook MP: No se recibio ID de pago');
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Verificar firma HMAC antes de procesar
      if (!verifyWebhookSignature(request, String(paymentId))) {
        console.error('Webhook MP: Firma HMAC invalida — request rechazado');
        return NextResponse.json({ error: 'Firma invalida' }, { status: 401 });
      }

      const payment = await getPaymentInfo(String(paymentId));
      const externalReference = payment.external_reference;
      const status = payment.status;

      if (!externalReference) {
        console.error('Webhook MP: No se encontro external_reference');
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Mapear estado de Mercado Pago a estado de la orden
      let estado: string;
      switch (status) {
        case 'approved':
          estado = 'pagado';
          break;
        case 'rejected':
        case 'cancelled':
          estado = 'cancelado';
          break;
        case 'pending':
        case 'in_process':
        case 'in_mediation':
          estado = 'pendiente';
          break;
        case 'refunded':
        case 'charged_back':
          estado = 'cancelado';
          break;
        default:
          estado = 'pendiente';
      }

      try {
        await prisma.order.update({
          where: { id: externalReference },
          data: {
            mercadoPagoId: String(paymentId),
            mercadoPagoStatus: status || null,
            estado,
          },
        });

        console.log(
          `Webhook MP: Orden ${externalReference} actualizada — estado: ${estado}, MP status: ${status}`
        );
      } catch (dbError) {
        console.error('Webhook MP: Error al actualizar orden en DB:', dbError);
        // Aun asi responder 200 para que MP no reintente
      }
    }

    // Siempre responder 200 (requisito de Mercado Pago)
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error);
    // Siempre devolver 200 para que MP no reintente indefinidamente
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
