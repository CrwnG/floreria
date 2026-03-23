'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

interface DeleteProductButtonProps {
  action: (formData: FormData) => Promise<void>;
  productId: string;
}

export function DeleteProductButton({ action, productId }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }

    const formData = new FormData();
    formData.append('id', productId);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
