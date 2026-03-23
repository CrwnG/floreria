import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPaymentInfo } from '@/lib/mercadopago';

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
    }

    // Siempre responder 200 (requisito de Mercado Pago)
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error);
    // Siempre devolver 200 para que MP no reintente indefinidamente
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
