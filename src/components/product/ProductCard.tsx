'use client';

import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ProductBadge } from './ProductBadge';
import { useCartStore } from '@/store/cart-store';

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productoId: product.id,
      slug: product.slug,
      nombre: product.nombre,
      imagen: product.imagenes[0],
      precio: product.precio,
      cantidad: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-fiorella-light-gray mb-3">
        <Image
          src={product.imagenes[0]}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <ProductBadge type={product.badge} />
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 cursor-pointer"
          aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isWishlisted
                ? 'fill-fiorella-rose-deep text-fiorella-rose-deep scale-110'
                : 'fill-transparent text-fiorella-charcoal'
            }`}
          />
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-fiorella-charcoal/90 backdrop-blur-sm text-white text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 hover:bg-fiorella-gold transition-colors duration-300 cursor-pointer"
          >
            {justAdded ? (
              '✓ Agregado'
            ) : (
              <>
                <ShoppingBag size={14} />
                Agregar al Carrito
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-serif text-sm md:text-base text-fiorella-charcoal group-hover:text-fiorella-gold transition-colors duration-300 line-clamp-1">
          {product.nombre}
        </h3>
        <p className="text-xs text-fiorella-warm-gray line-clamp-1">
          {product.descripcionCorta}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-fiorella-gold font-medium text-sm">
            {formatPrice(product.precio)}
          </span>
          {product.precioOriginal && (
            <span className="text-fiorella-warm-gray text-xs line-through">
              {formatPrice(product.precioOriginal)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
