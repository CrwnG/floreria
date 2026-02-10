'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { testimonials } from '@/data/testimonials';

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () =>
    setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-16 md:py-24 bg-fiorella-cream">
      <Container>
        <SectionHeading
          title="Lo Que Dicen Nuestros Clientes"
          subtitle="Miles de sonrisas entregadas en Puebla"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-fiorella-charcoal hover:text-fiorella-gold transition-colors z-10 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-fiorella-charcoal hover:text-fiorella-gold transition-colors z-10 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>

          {/* Testimonial card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 md:p-12 text-center shadow-sm"
            >
              <Quote
                size={32}
                className="text-fiorella-gold/30 mx-auto mb-6"
              />

              <p className="font-serif text-lg md:text-xl text-fiorella-charcoal italic leading-relaxed mb-6">
                &ldquo;{testimonials[current].texto}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < testimonials[current].calificacion
                        ? 'fill-fiorella-gold text-fiorella-gold'
                        : 'fill-fiorella-light-gray text-fiorella-light-gray'
                    }
                  />
                ))}
              </div>

              <p className="text-sm font-medium text-fiorella-charcoal">
                {testimonials[current].nombre}
              </p>
              <p className="text-xs text-fiorella-warm-gray">
                Puebla, Pue.
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current
                    ? 'w-6 bg-fiorella-gold'
                    : 'w-1.5 bg-fiorella-light-gray hover:bg-fiorella-warm-gray'
                }`}
                aria-label={`Testimonio ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
