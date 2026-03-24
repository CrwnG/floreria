'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { STORE_PHONE, WHATSAPP_NUMBER } from '@/lib/constants';

const menuLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Flores', href: '/categoria/flores' },
  { label: 'Globos', href: '/categoria/globos' },
  { label: 'Regalos', href: '/categoria/regalos' },
  { label: 'Favoritos', href: '/favoritos' },
  { label: 'Ocasiones', href: '/#ocasiones' },
  { label: 'Nuestra Historia', href: '/#historia' },
  { label: 'Contacto', href: '/#contacto' },
];

export function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Menu panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-fiorella-light-gray">
                <span className="font-serif text-2xl text-fiorella-charcoal">
                  Fiorella
                </span>
                <button onClick={onClose} className="text-fiorella-charcoal cursor-pointer" aria-label="Cerrar">
                  <X size={24} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 py-6">
                {menuLinks.map((link, i) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className="block px-6 py-3.5 text-base uppercase tracking-wider text-fiorella-charcoal hover:text-fiorella-gold hover:bg-fiorella-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Bottom info */}
              <div className="p-6 border-t border-fiorella-light-gray space-y-3">
                <a
                  href={`tel:${STORE_PHONE}`}
                  className="flex items-center gap-3 text-sm text-fiorella-warm-gray hover:text-fiorella-gold transition-colors"
                >
                  <Phone size={16} />
                  {STORE_PHONE}
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  className="flex items-center gap-3 text-sm text-fiorella-warm-gray hover:text-fiorella-gold transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
