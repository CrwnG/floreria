import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface OrderForPreference {
  id: string;
  clienteNombre: string;
  clienteEmail?: string | null;
  items: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  envio: number;
  total: number;
}

export async function createPaymentPreference(order: OrderForPreference): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL no esta configurado. Requerido para Mercado Pago.');
  }

  const items = order.items.map((item, i) => ({
    id: `item-${i}`,
    title: item.nombre,
    quantity: item.cantidad,
    unit_price: item.precio,
    currency_id: 'MXN' as const,
  }));

  if (order.envio > 0) {
    items.push({
      id: 'shipping',
      title: 'Envio a domicilio',
      quantity: 1,
      unit_price: order.envio,
      currency_id: 'MXN' as const,
    });
  }

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items,
      back_urls: {
        success: `${appUrl}/checkout/confirmacion?orderId=${order.id}`,
        failure: `${appUrl}/checkout`,
        pending: `${appUrl}/checkout/pendiente?orderId=${order.id}`,
      },
      auto_return: 'approved',
      external_reference: order.id,
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      payer: {
        name: order.clienteNombre,
        email: order.clienteEmail || undefined,
      },
    },
  });

  return result.init_point!;
}

export async function getPaymentInfo(paymentId: string) {
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}
