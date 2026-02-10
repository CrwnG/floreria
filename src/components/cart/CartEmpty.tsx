import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CartEmpty({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-20 h-20 rounded-full bg-fiorella-cream flex items-center justify-center mb-6">
        <ShoppingBag size={32} className="text-fiorella-gold" />
      </div>
      <h3 className="font-serif text-xl text-fiorella-charcoal mb-2">
        Tu carrito está vacío
      </h3>
      <p className="text-sm text-fiorella-warm-gray text-center mb-8 max-w-xs">
        Descubre nuestros arreglos florales, globos y regalos perfectos para
        cada ocasión.
      </p>
      <Button onClick={onClose}>Explorar Productos</Button>
    </div>
  );
}
