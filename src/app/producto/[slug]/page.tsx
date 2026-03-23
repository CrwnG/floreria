import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getProductsByCategory } from '@/lib/data';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductCard } from '@/components/product/ProductCard';
import { SITE_NAME } from '@/lib/constants';

const categoryNames: Record<string, string> = {
  flores: 'Flores',
  globos: 'Globos',
  regalos: 'Regalos',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.nombre} | ${SITE_NAME}`,
    description: product.descripcionCorta,
    openGraph: {
      title: `${product.nombre} | ${SITE_NAME}`,
      description: product.descripcionCorta,
      images: product.imagenes[0] ? [{ url: product.imagenes[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(product.categoria);
  const relatedProducts = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const categoryName = categoryNames[product.categoria] || product.categoria;

  return (
    <main className="pb-20">
      {/* Breadcrumbs */}
      <Container className="pt-6 pb-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-fiorella-warm-gray">
            <li>
              <Link
                href="/"
                className="hover:text-fiorella-gold transition-colors duration-200"
              >
                Inicio
              </Link>
            </li>
            <li>
              <ChevronRight size={14} className="text-fiorella-warm-gray/50" />
            </li>
            <li>
              <Link
                href={`/categoria/${product.categoria}`}
                className="hover:text-fiorella-gold transition-colors duration-200"
              >
                {categoryName}
              </Link>
            </li>
            <li>
              <ChevronRight size={14} className="text-fiorella-warm-gray/50" />
            </li>
            <li className="text-fiorella-charcoal font-medium truncate max-w-[200px]">
              {product.nombre}
            </li>
          </ol>
        </nav>
      </Container>

      {/* Product Detail */}
      <Container>
        <ProductDetail product={product} />
      </Container>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <Container>
            <SectionHeading
              title="Productos Relacionados"
              subtitle="Descubre más opciones que podrían encantarte"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
