'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { getNextHoliday } from '@/data/holidays';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CountdownTimer() {
  const holiday = getNextHoliday();

  if (!holiday) return null;

  return <CountdownContent holiday={holiday} />;
}

function CountdownContent({
  holiday,
}: {
  holiday: { nombre: string; fecha: string; mensaje: string };
}) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(holiday.fecha);

  if (isExpired) return null;

  return (
    <section className="bg-gradient-to-r from-fiorella-blush via-fiorella-cream to-fiorella-blush py-6">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <p className="text-sm text-fiorella-charcoal">
            <span className="font-serif text-lg md:text-xl">{holiday.nombre}</span>
            <span className="mx-3 text-fiorella-gold">·</span>
            <span className="text-fiorella-warm-gray">{holiday.mensaje}</span>
          </p>

          {/* Countdown boxes */}
          <div className="flex items-center gap-3">
            {[
              { value: days, label: 'Días' },
              { value: hours, label: 'Hrs' },
              { value: minutes, label: 'Min' },
              { value: seconds, label: 'Seg' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="w-14 h-14 bg-white shadow-sm flex items-center justify-center">
                  <span className="font-serif text-2xl text-fiorella-charcoal">
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-fiorella-warm-gray mt-1 block">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <Button size="sm" variant="primary">
            Comprar Ahora
          </Button>
        </div>
      </Container>
    </section>
  );
}
