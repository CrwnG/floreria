'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flower2, Truck, Gift } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const features = [
  { icon: Flower2, label: 'Flores Frescas del Día' },
  { icon: Truck, label: 'Entrega con Cuidado' },
  { icon: Gift, label: 'Empaque de Lujo' },
];

export function BrandStory() {
  return (
    <section className="py-16 md:py-24" id="historia">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1000&fit=crop&q=80"
              alt="Fiorella Balloons - Nuestra historia"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Decorative gold border */}
            <div className="absolute inset-4 border border-fiorella-gold/30 pointer-events-none" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-fiorella-gold text-xs uppercase tracking-[0.3em] font-medium mb-3">
              Nuestra Promesa
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-fiorella-charcoal mb-6 leading-snug">
              Cada Arreglo Cuenta una Historia
            </h2>
            <p className="text-fiorella-warm-gray leading-relaxed mb-4">
              En Fiorella Balloons creemos que cada flor, cada globo y cada
              detalle tiene el poder de transformar un momento ordinario en algo
              extraordinario. Desde el corazón de Puebla, creamos arreglos
              artesanales que expresan lo que las palabras no alcanzan.
            </p>
            <p className="text-fiorella-warm-gray leading-relaxed mb-8">
              Seleccionamos las flores más frescas cada mañana, diseñamos con
              pasión y entregamos con el cuidado que tu regalo merece. Porque
              en cada entrega va un pedacito de nuestro corazón.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-8 mb-10">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-fiorella-cream flex items-center justify-center">
                    <Icon size={20} className="text-fiorella-gold" />
                  </div>
                  <span className="text-sm font-medium text-fiorella-charcoal">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="outline-gold">Conocer Más</Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
