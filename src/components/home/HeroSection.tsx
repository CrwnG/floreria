'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&h=1080&fit=crop&q=80',
    alt: 'Arreglo floral elegante',
  },
  {
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1920&h=1080&fit=crop&q=80',
    alt: 'Rosas de lujo',
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&h=1080&fit=crop&q=80',
    alt: 'Globos de celebración',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-fiorella-gold text-xs sm:text-sm uppercase tracking-[0.3em] font-medium mb-4"
        >
          Florería de Lujo en Puebla
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-4xl leading-tight"
        >
          Flores, Globos y Momentos{' '}
          <span className="italic text-fiorella-gold-light">Inolvidables</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-white/80 text-base sm:text-lg mt-6 max-w-xl"
        >
          Entregas el mismo día en toda la ciudad de Puebla
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" variant="primary">
            Explorar Colección
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white border border-white/30 hover:bg-white/10 hover:text-white"
          >
            Nuestra Historia
          </Button>
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-0.5 transition-all duration-500 cursor-pointer ${
                i === currentSlide
                  ? 'w-8 bg-fiorella-gold'
                  : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
