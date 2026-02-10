'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-fiorella-gold py-16 md:py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
            10% de Descuento en Tu Primer Pedido
          </h2>
          <p className="text-white/80 mb-8">
            Suscríbete y recibe ofertas exclusivas, novedades y tips de
            decoración
          </p>

          {submitted ? (
            <p className="text-white font-medium text-lg">
              ¡Gracias por suscribirte! Revisa tu correo para tu código de descuento 🌸
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                required
                className="flex-1 px-5 py-3.5 text-sm bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-white text-fiorella-gold text-sm uppercase tracking-wider font-medium hover:bg-fiorella-cream transition-colors cursor-pointer"
              >
                Suscribirme
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
