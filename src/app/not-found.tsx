import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center py-20">
      <Container className="text-center">
        <p className="text-fiorella-gold text-7xl md:text-9xl font-serif font-bold mb-4">
          404
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-fiorella-charcoal mb-3">
          Pagina No Encontrada
        </h1>
        <p className="text-fiorella-warm-gray mb-8 max-w-md mx-auto">
          Lo sentimos, la pagina que buscas no existe o fue movida.
        </p>
        <Link href="/">
          <Button size="lg">Volver a la Tienda</Button>
        </Link>
      </Container>
    </main>
  );
}
