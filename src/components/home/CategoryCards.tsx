'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categories } from '@/data/categories';

export function CategoryCards() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          title="Nuestras Colecciones"
          subtitle="Encuentra el detalle perfecto para cada momento"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Link href={`#${category.slug}`} className="group block relative aspect-[3/4] overflow-hidden">
                <Image
                  src={category.imagen}
                  alt={category.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
                  <h3 className="font-serif text-3xl text-white mb-2">
                    {category.nombre}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    {category.descripcion}
                  </p>
                  <span className="text-fiorella-gold text-xs uppercase tracking-widest font-medium border-b border-fiorella-gold pb-0.5 group-hover:border-white group-hover:text-white transition-colors duration-300">
                    Ver Colección
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
