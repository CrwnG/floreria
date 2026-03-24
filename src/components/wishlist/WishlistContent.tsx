'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function WishlistContent() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addToCart = useCartStore((s) => s.addItem);

  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      productoId: item.productoId,
      slug: item.slug,
      nombre: item.nombre,
      imagen: item.imagen,
      precio: item.precio,
      cantidad: 1,
    });
    setAddedIds((prev) => new Set(prev).add(item.productoId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.productoId);
        return next;
      });
    }, 1500);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        productoId: item.productoId,
        slug: item.slug,
        nombre: item.nombre,
        imagen: item.imagen,
        precio: item.precio,
        cantidad: 1,
      });
    });
    setAddedIds(new Set(items.map((i) => i.productoId)));
    setTimeout(() => setAddedIds(new Set()), 1500);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-fiorella-blush/50 flex items-center justify-center mb-6">
          <Heart size={32} className="text-fiorella-rose" />
        </div>
        <h3 className="font-serif text-2xl text-fiorella-charcoal mb-3">
          Tu lista de favoritos está vacía
        </h3>
        <p className="text-fiorella-warm-gray text-sm max-w-md mb-8">
          Explora nuestra colección y guarda los productos que más te gusten
          tocando el corazón en cada producto.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            <span className="flex items-center gap-2">
              Explorar Productos
              <ArrowRight size={16} />
            </span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-fiorella-warm-gray">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} guardados
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="text-sm text-fiorella-gold hover:text-fiorella-gold-dark transition-colors font-medium cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingBag size={14} />
            Agregar todos al carrito
          </button>
          <span className="text-fiorella-light-gray">|</span>
          <button
            onClick={clearWishlist}
            className="text-sm text-fiorella-warm-gray hover:text-fiorella-rose-deep transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            Vaciar lista
          </button>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.productoId}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white border border-fiorella-light-gray/50 overflow-hidden"
            >
              {/* Image */}
              <Link href={`/producto/${item.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.productoId)}
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-fiorella-rose-deep hover:text-white transition-all duration-300 cursor-pointer"
                aria-label="Quitar de favoritos"
              >
                <Heart size={16} className="fill-fiorella-rose-deep text-fiorella-rose-deep group-[:hover]:text-white" />
              </button>

              {/* Info */}
              <div className="p-4">
                <Link href={`/producto/${item.slug}`}>
                  <h3 className="font-serif text-sm text-fiorella-charcoal hover:text-fiorella-gold transition-colors line-clamp-1">
                    {item.nombre}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-fiorella-gold font-medium text-sm">
                    {formatPrice(item.precio)}
                  </span>
                  {item.precioOriginal && (
                    <span className="text-fiorella-warm-gray text-xs line-through">
                      {formatPrice(item.precioOriginal)}
                    </span>
                  )}
                </div>

                {/* Add to cart button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-3 w-full bg-fiorella-charcoal text-white text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 hover:bg-fiorella-gold transition-colors duration-300 cursor-pointer"
                >
                  {addedIds.has(item.productoId) ? (
                    '✓ Agregado'
                  ) : (
                    <>
                      <ShoppingBag size={13} />
                      Agregar al Carrito
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
