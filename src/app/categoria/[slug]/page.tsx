import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductsByCategory, getCategoryBySlug, getCategories } from '@/lib/data';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Categoría no encontrada | Fiorella Balloons' };
  }

  return {
    title: `${category.nombre} | Fiorella Balloons`,
    description: category.descripcion,
    openGraph: {
      title: `${category.nombre} | Fiorella Balloons`,
      description: category.descripcion,
      images: [category.imagen],
    },
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  return (
    <section className="py-16 md:py-24">
      <Container>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1 text-sm">
            <li>
              <Link
                href="/"
                className="text-fiorella-warm-gray hover:text-fiorella-gold transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-fiorella-warm-gray" />
            </li>
            <li>
              <span className="text-fiorella-charcoal font-medium">
                {category.nombre}
              </span>
            </li>
          </ol>
        </nav>

        {/* Heading */}
        <SectionHeading
          title={category.nombre}
          subtitle={category.descripcion}
        />

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-fiorella-warm-gray text-lg">
              No hay productos en esta categoría
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
