import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { deleteProduct, toggleProductStock } from './actions';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold text-fiorella-charcoal">
          Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-fiorella-gold text-white px-6 py-3 rounded-lg text-sm font-medium uppercase tracking-wider hover:bg-fiorella-gold-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </Link>
      </div>

      {/* Products table */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-fiorella-charcoal/50">
          <p className="text-lg mb-4">No hay productos a&uacute;n</p>
          <Link
            href="/admin/productos/nuevo"
            className="text-fiorella-gold hover:underline"
          >
            Agrega tu primer producto
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-fiorella-light-gray rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Imagen
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Nombre
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Categor&iacute;a
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Precio
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Stock
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fiorella-light-gray">
                {products.map((product) => {
                  const imagenes: string[] = JSON.parse(product.imagenes || '[]');
                  const thumbnail = imagenes[0] ?? '';

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {thumbnail ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={thumbnail}
                              alt={product.nombre}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            Sin img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-fiorella-charcoal">
                          {product.nombre}
                        </p>
                        <p className="text-xs text-fiorella-charcoal/50 mt-0.5">
                          {product.slug}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-fiorella-charcoal/70">
                        {product.category.nombre}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatPrice(product.precio)}
                      </td>
                      <td className="px-6 py-4">
                        <form action={toggleProductStock}>
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${
                              product.enStock
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {product.enStock ? 'En Stock' : 'Agotado'}
                          </button>
                        </form>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/productos/${product.id}/editar`}
                            className="inline-flex items-center gap-1.5 text-fiorella-gold hover:text-fiorella-gold-dark text-xs font-medium transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Editar
                          </Link>
                          <DeleteProductButton
                            action={deleteProduct}
                            productId={product.id}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
