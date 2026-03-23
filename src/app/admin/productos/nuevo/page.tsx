import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { createProduct } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true, nombre: true },
    orderBy: { orden: 'asc' },
  });

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
          Agregar Producto
        </h1>
      </div>

      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
