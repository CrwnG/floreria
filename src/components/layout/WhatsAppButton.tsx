'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola, me gustaría hacer un pedido 🌸'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="w-14 h-14 flex items-center justify-center rounded-full animate-pulse-soft">
        <MessageCircle size={28} fill="white" strokeWidth={0} />
      </div>
      <span
        className={`text-sm font-medium pr-5 transition-all duration-300 overflow-hidden whitespace-nowrap ${
          hovered ? 'max-w-48 opacity-100' : 'max-w-0 opacity-0 pr-0'
        }`}
      >
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}
