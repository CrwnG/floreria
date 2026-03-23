'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { CartItem } from './CartItem';
import { CartEmpty } from './CartEmpty';
import { Button } from '@/components/ui/Button';
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '@/lib/constants';

export function CartSidebar() {
  const { items, isOpen, closeCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);
  const freeDelivery = total >= FREE_DELIVERY_THRESHOLD;
  const remaining = FREE_DELIVERY_THRESHOLD - total;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-fiorella-light-gray">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-fiorella-charcoal" />
                <h2 className="font-serif text-xl text-fiorella-charcoal">
                  Tu Carrito
                </h2>
                <span className="text-xs text-fiorella-warm-gray">
                  ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-fiorella-charcoal hover:text-fiorella-gold transition-colors cursor-pointer"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <CartEmpty onClose={closeCart} />
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.productoId} item={item} />
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t border-fiorella-light-gray px-6 py-5 space-y-4">
                  {/* Free delivery progress */}
                  {!freeDelivery && (
                    <div>
                      <p className="text-xs text-fiorella-warm-gray mb-2">
                        Te faltan {formatPrice(remaining)} para envío gratis
                      </p>
                      <div className="h-1.5 bg-fiorella-light-gray rounded-full overflow-hidden">
                        <div
                          className="h-full bg-fiorella-gold rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (total / FREE_DELIVERY_THRESHOLD) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-fiorella-warm-gray">
                      <span>Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-fiorella-warm-gray">
                      <span>Envío</span>
                      <span className={freeDelivery ? 'text-fiorella-sage-dark font-medium' : ''}>
                        {freeDelivery ? 'GRATIS' : formatPrice(DELIVERY_FEE)}
                      </span>
                    </div>
                    <div className="border-t border-fiorella-light-gray pt-2 flex justify-between text-base font-medium text-fiorella-charcoal">
                      <span>Total</span>
                      <span className="text-fiorella-gold">
                        {formatPrice(total + (freeDelivery ? 0 : DELIVERY_FEE))}
                      </span>
                    </div>
                  </div>

                  <Link href="/checkout" onClick={closeCart}>
                    <Button fullWidth size="lg">
                      Ir a Pagar
                    </Button>
                  </Link>

                  <button
                    onClick={closeCart}
                    className="w-full text-center text-sm text-fiorella-warm-gray hover:text-fiorella-gold transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Seguir Comprando
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
