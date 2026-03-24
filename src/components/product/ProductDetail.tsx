'use client';

import { useState } from 'react';
import { Minus, Plus, Check, MessageCircle, Heart } from 'lucide-react';
import { Product } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { ProductBadge } from './ProductBadge';
import { ImageGallery } from './ImageGallery';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const handleAddToCart = () => {
    addItem({
      productoId: product.id,
      slug: product.slug,
      nombre: product.nombre,
      imagen: product.imagenes[0],
      precio: product.precio,
      cantidad: quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, me interesa el producto: *${product.nombre}* (${formatPrice(product.precio)}). ¿Está disponible?`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank'
    );
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const isOnSale = product.precioOriginal && product.precioOriginal > product.precio;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Left: Image Gallery */}
      <ImageGallery images={product.imagenes} productName={product.nombre} />

      {/* Right: Product Info */}
      <div className="flex flex-col">
        {/* Badge */}
        {product.badge && (
          <div className="mb-4">
            <ProductBadge type={product.badge} />
          </div>
        )}

        {/* Name */}
        <h1 className="font-serif text-3xl md:text-4xl text-fiorella-charcoal leading-tight">
          {product.nombre}
        </h1>

        {/* Short Description */}
        <p className="mt-3 text-fiorella-warm-gray text-base leading-relaxed">
          {product.descripcionCorta}
        </p>

        {/* Price */}
        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-fiorella-gold text-2xl font-semibold">
            {formatPrice(product.precio)}
          </span>
          {isOnSale && (
            <span className="text-fiorella-warm-gray text-lg line-through">
              {formatPrice(product.precioOriginal!)}
            </span>
          )}
        </div>

        {/* Divider */}
        <hr className="my-6 border-fiorella-light-gray" />

        {/* Full Description */}
        <div className="text-fiorella-charcoal/80 text-sm leading-relaxed whitespace-pre-line">
          {product.descripcion}
        </div>

        {/* Divider */}
        <hr className="my-6 border-fiorella-light-gray" />

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              product.enStock ? 'bg-green-500' : 'bg-red-400'
            )}
          />
          <span
            className={cn(
              'text-sm font-medium',
              product.enStock ? 'text-green-700' : 'text-red-500'
            )}
          >
            {product.enStock ? 'En stock - Disponible para entrega' : 'Agotado'}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-fiorella-charcoal font-medium uppercase tracking-wider">
            Cantidad
          </span>
          <div className="flex items-center border border-fiorella-light-gray">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-fiorella-charcoal hover:bg-fiorella-cream transition-colors duration-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 h-10 flex items-center justify-center text-sm font-medium text-fiorella-charcoal border-x border-fiorella-light-gray">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="w-10 h-10 flex items-center justify-center text-fiorella-charcoal hover:bg-fiorella-cream transition-colors duration-200 cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.enStock}
          className="mb-3"
        >
          {justAdded ? (
            <span className="flex items-center gap-2">
              <Check size={18} />
              Agregado al Carrito
            </span>
          ) : (
            'Agregar al Carrito'
          )}
        </Button>

        {/* Wishlist + WhatsApp row */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              toggleWishlist({
                productoId: product.id,
                slug: product.slug,
                nombre: product.nombre,
                imagen: product.imagenes[0],
                precio: product.precio,
                precioOriginal: product.precioOriginal,
              })
            }
            className={cn(
              'flex items-center justify-center gap-2 px-5 py-3 border text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer',
              isWishlisted
                ? 'border-fiorella-rose-deep bg-fiorella-rose-deep/5 text-fiorella-rose-deep'
                : 'border-fiorella-light-gray text-fiorella-charcoal hover:border-fiorella-rose hover:text-fiorella-rose'
            )}
            aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart
              size={18}
              className={cn(
                'transition-all duration-300',
                isWishlisted && 'fill-fiorella-rose-deep'
              )}
            />
            {isWishlisted ? 'Guardado' : 'Favorito'}
          </button>

          <Button
            variant="outline-gold"
            size="lg"
            className="flex-1"
            onClick={handleWhatsApp}
          >
            <span className="flex items-center gap-2">
              <MessageCircle size={18} />
              Pedir por WhatsApp
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
