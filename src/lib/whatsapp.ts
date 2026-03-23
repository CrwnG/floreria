import { WHATSAPP_NUMBER } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface WhatsAppOrder {
  id: string;
  clienteNombre: string;
  items: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  subtotal: number;
  envio: number;
  total: number;
  direccion?: string | null;
  notas?: string | null;
}

interface WhatsAppProduct {
  nombre: string;
  precio: number;
  slug: string;
}

export function buildWhatsAppOrderUrl(order: WhatsAppOrder): string {
  const orderId = order.id.slice(-6).toUpperCase();

  const itemLines = order.items
    .map(
      (item) =>
        `  - ${item.nombre} x${item.cantidad} — ${formatPrice(item.precio * item.cantidad)}`
    )
    .join('\n');

  let message = `Hola! Quiero confirmar mi pedido en Fiorella Balloons.\n\n`;
  message += `Pedido #${orderId}\n`;
  message += `Cliente: ${order.clienteNombre}\n\n`;
  message += `Productos:\n${itemLines}\n\n`;
  message += `Subtotal: ${formatPrice(order.subtotal)}\n`;
  message += `Envio: ${order.envio > 0 ? formatPrice(order.envio) : 'Gratis'}\n`;
  message += `Total: ${formatPrice(order.total)}\n`;

  if (order.direccion) {
    message += `\nDireccion de entrega: ${order.direccion}`;
  }

  if (order.notas) {
    message += `\nNotas: ${order.notas}`;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function buildWhatsAppProductUrl(product: WhatsAppProduct): string {
  const message = `Hola! Me interesa este producto:\n\n${product.nombre} — ${formatPrice(product.precio)}\n\nMe gustaria hacer un pedido.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
