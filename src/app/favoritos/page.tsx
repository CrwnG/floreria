import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WishlistContent } from '@/components/wishlist/WishlistContent';

export const metadata: Metadata = {
  title: `Mis Favoritos | ${SITE_NAME}`,
  description: 'Tus productos favoritos guardados en Fiorella Balloons.',
};

export default function FavoritosPage() {
  return (
    <main className="pb-20 min-h-[60vh]">
      <Container className="pt-10">
        <SectionHeading
          title="Mis Favoritos"
          subtitle="Los productos que has guardado con amor"
        />
        <div className="mt-10">
          <WishlistContent />
        </div>
      </Container>
    </main>
  );
}
