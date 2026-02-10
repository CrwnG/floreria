'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const messages = [
  'Envío GRATIS en pedidos mayores a $799 MXN · Solo en Puebla',
  'Entrega el mismo día si ordenas antes de las 2:00 PM',
  '💐 Nuevos arreglos de San Valentín disponibles',
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-fiorella-charcoal text-white text-xs sm:text-sm py-2.5 relative">
      <div className="text-center px-8">
        <p className="transition-opacity duration-500">{messages[currentIndex]}</p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
        aria-label="Cerrar"
      >
        <X size={14} />
      </button>
    </div>
  );
}
