import Link from 'next/link';
import { Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ClearCartOnMount } from './ClearCartOnMount';

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PendientePage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  let order = null;

  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-2xl text-center">
        <ClearCartOnMount />

        <div className="flex justify-center mb-6">
          <Clock className="text-fiorella-gold" size={72} strokeWidth={1.5} />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-fiorella-charcoal mb-4">
          Tu pago esta siendo procesado
        </h1>

        {order && (
          <p className="text-lg font-serif text-fiorella-gold-dark mb-4">
            Numero de pedido:{' '}
            <span className="font-semibold">
              #{order.id.slice(-6).toUpperCase()}
            </span>
          </p>
        )}

        <div className="bg-fiorella-blush/30 rounded-xl p-6 mb-8">
          <p className="text-fiorella-charcoal mb-2">
            Tu pago esta pendiente de confirmacion. Esto puede suceder con pagos en
            OXXO, transferencia bancaria u otros metodos.
          </p>
          <p className="text-fiorella-warm-gray text-sm">
            Recibiras una confirmacion por WhatsApp cuando se complete el pago.
            No es necesario que realices ninguna accion adicional.
          </p>
        </div>

        <Link href="/">
          <Button variant="primary" size="lg">
            Volver a la Tienda
          </Button>
        </Link>
      </Container>
    </section>
  );
}
