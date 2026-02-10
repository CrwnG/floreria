import { cn } from '@/lib/utils';

export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn('text-center mb-12', className)}>
      <h2 className="font-serif text-3xl md:text-4xl text-fiorella-charcoal">
        {title}
      </h2>
      <div className="w-16 h-0.5 bg-fiorella-gold mx-auto mt-4 mb-4" />
      {subtitle && (
        <p className="text-fiorella-warm-gray text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
