import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { updateProduct } from '../../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditarProductoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: EditarProductoPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      select: { id: true, slug: true, nombre: true },
      orderBy: { orden: 'asc' },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-1.5 text-sm text-fiorella-charcoal/60 hover:text-fiorella-charcoal transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>
        <h1 className="text-2xl font-serif font-bold text-fiorella-charcoal">
          Editar Producto
        </h1>
      </div>

      <ProductForm
        product={product}
        categories={categories}
        action={updateProductWithId}
      />
    </div>
  );
}
