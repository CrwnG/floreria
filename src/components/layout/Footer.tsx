import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Instagram, Facebook } from 'lucide-react';
import {
  SITE_NAME,
  STORE_ADDRESS,
  STORE_HOURS,
  STORE_EMAIL,
  STORE_PHONE,
} from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-fiorella-charcoal text-white">
      {/* Main footer */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <h3 className="font-serif text-2xl mb-4">Fiorella</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Florería de lujo en Puebla. Arreglos florales, globos y regalos
              con entrega a domicilio el mismo día.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-fiorella-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-fiorella-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-fiorella-gold transition-colors"
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.23 8.23 0 004.8 1.53V6.78a4.85 4.85 0 01-1.04-.09z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium text-fiorella-gold mb-4">
              Tienda
            </h4>
            <ul className="space-y-2.5">
              {['Flores', 'Globos', 'Regalos', 'Ofertas', 'Novedades'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-white/60 text-sm hover:text-fiorella-gold transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Ocasiones */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium text-fiorella-gold mb-4">
              Ocasiones
            </h4>
            <ul className="space-y-2.5">
              {[
                'Cumpleaños',
                'San Valentín',
                'Día de las Madres',
                'Aniversario',
                'Graduación',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-white/60 text-sm hover:text-fiorella-gold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium text-fiorella-gold mb-4">
              Información
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>{STORE_ADDRESS}</li>
              <li>{STORE_HOURS}</li>
              <li>
                <a href={`tel:${STORE_PHONE}`} className="hover:text-fiorella-gold transition-colors">
                  {STORE_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-fiorella-gold transition-colors">
                  {STORE_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2026 {SITE_NAME}. Todos los derechos reservados.</p>
            <p>Hecho con amor en Puebla, México 🇲🇽</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
