import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { ClearCartOnMount } from './ClearCartOnMount';

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ConfirmacionPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  let order = null;

  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-2xl text-center">
        <ClearCartOnMount />

        <div className="flex justify-center mb-6">
          <CheckCircle className="text-fiorella-sage-dark" size={72} strokeWidth={1.5} />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-fiorella-charcoal mb-4">
          Gracias por tu pedido
        </h1>

        {order ? (
          <>
            <p className="text-fiorella-warm-gray mb-2">
              Tu pedido ha sido registrado exitosamente.
            </p>
            <p className="text-lg font-serif text-fiorella-gold-dark mb-8">
              Numero de pedido:{' '}
              <span className="font-semibold">
                #{order.id.slice(-6).toUpperCase()}
              </span>
            </p>

            {/* Resumen de la orden */}
            <div className="bg-white rounded-xl border border-fiorella-light-gray p-6 text-left mb-8">
              <h2 className="font-serif text-lg text-fiorella-charcoal mb-4">
                Resumen
              </h2>
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-fiorella-charcoal">
                      {item.nombre} <span className="text-fiorella-warm-gray">x{item.cantidad}</span>
                    </span>
                    <span className="text-fiorella-charcoal font-medium">
                      {formatPrice(item.precio * item.cantidad)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-fiorella-light-gray pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-fiorella-warm-gray">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fiorella-warm-gray">Envio</span>
                  <span>
                    {order.envio > 0 ? formatPrice(order.envio) : 'Gratis'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-semibold pt-2 border-t border-fiorella-light-gray">
                  <span>Total</span>
                  <span className="text-fiorella-gold-dark">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-fiorella-blush/30 rounded-xl p-6 mb-8">
              <p className="text-fiorella-charcoal">
                Te contactaremos por WhatsApp al numero{' '}
                <span className="font-medium">{order.clienteTelefono}</span> para
                coordinar la entrega de tu pedido.
              </p>
            </div>
          </>
        ) : (
          <p className="text-fiorella-warm-gray mb-8">
            Hemos recibido tu pedido. Te contactaremos pronto para confirmar los detalles.
          </p>
        )}

        <Link href="/">
          <Button variant="primary" size="lg">
            Volver a la Tienda
          </Button>
        </Link>
      </Container>
    </section>
  );
}
