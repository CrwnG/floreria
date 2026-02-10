'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-3 border-b border-fiorella-light-gray last:border-0">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-fiorella-light-gray overflow-hidden">
        <Image
          src={item.imagen}
          alt={item.nombre}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-fiorella-charcoal truncate">
          {item.nombre}
        </h4>
        <p className="text-sm text-fiorella-gold mt-0.5">
          {formatPrice(item.precio)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-fiorella-light-gray">
            <button
              onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
              className="w-7 h-7 flex items-center justify-center text-fiorella-warm-gray hover:text-fiorella-charcoal transition-colors cursor-pointer"
              aria-label="Reducir cantidad"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 h-7 flex items-center justify-center text-xs font-medium text-fiorella-charcoal">
              {item.cantidad}
            </span>
            <button
              onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
              className="w-7 h-7 flex items-center justify-center text-fiorella-warm-gray hover:text-fiorella-charcoal transition-colors cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.productoId)}
            className="text-fiorella-warm-gray hover:text-fiorella-rose-deep transition-colors cursor-pointer"
            aria-label="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-sm font-medium text-fiorella-charcoal">
        {formatPrice(item.precio * item.cantidad)}
      </div>
    </div>
  );
}
