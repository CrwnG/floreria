'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] flex items-center justify-center py-20">
      <Container className="text-center">
        <p className="text-fiorella-rose-deep text-6xl md:text-8xl font-serif font-bold mb-4">
          Oops
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-fiorella-charcoal mb-3">
          Algo salio mal
        </h1>
        <p className="text-fiorella-warm-gray mb-8 max-w-md mx-auto">
          Hubo un error inesperado. Por favor intenta de nuevo.
        </p>
        <Button size="lg" onClick={reset}>
          Intentar de Nuevo
        </Button>
      </Container>
    </main>
  );
}
