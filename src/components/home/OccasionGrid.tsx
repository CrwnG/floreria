'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { occasions } from '@/data/occasions';

export function OccasionGrid() {
  return (
    <section className="py-16 md:py-24 bg-white" id="ocasiones">
      <Container>
        <SectionHeading
          title="Encuentra el Detalle Perfecto"
          subtitle="Para cada ocasión, tenemos el arreglo ideal"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {occasions.map((occasion, i) => (
            <motion.div
              key={occasion.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link href="#" className="group block text-center">
                <div className="relative w-full aspect-square rounded-full overflow-hidden mx-auto mb-4 max-w-[180px]">
                  <Image
                    src={occasion.imagen}
                    alt={occasion.nombre}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-fiorella-gold/20 transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-base md:text-lg text-fiorella-charcoal group-hover:text-fiorella-gold transition-colors duration-300">
                  {occasion.nombre}
                </h3>
                <p className="text-xs text-fiorella-warm-gray mt-1">
                  {occasion.descripcion}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
