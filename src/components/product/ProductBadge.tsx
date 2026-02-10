import { cn } from '@/lib/utils';
import { BadgeType } from '@/types';

const badgeStyles: Record<BadgeType, string> = {
  bestseller: 'bg-fiorella-gold text-white',
  nuevo: 'bg-fiorella-sage text-white',
  oferta: 'bg-fiorella-rose-deep text-white',
};

const badgeLabels: Record<BadgeType, string> = {
  bestseller: 'Bestseller',
  nuevo: 'Nuevo',
  oferta: 'Oferta',
};

export function ProductBadge({ type }: { type: BadgeType }) {
  return (
    <span
      className={cn(
        'text-[10px] uppercase tracking-wider font-medium px-3 py-1',
        badgeStyles[type]
      )}
    >
      {badgeLabels[type]}
    </span>
  );
}
