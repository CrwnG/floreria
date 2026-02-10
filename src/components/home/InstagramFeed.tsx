'use client';

import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const instagramImages = [
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=400&h=400&fit=crop&q=80',
];

export function InstagramFeed() {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-10">
        <p className="text-fiorella-gold text-xs uppercase tracking-[0.3em] font-medium mb-2">
          Síguenos en Instagram
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-fiorella-charcoal">
          @fiorellaballoons
        </h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {instagramImages.map((src, i) => (
          <motion.a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative aspect-square group overflow-hidden"
          >
            <Image
              src={src}
              alt={`Instagram post ${i + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-fiorella-gold/0 group-hover:bg-fiorella-gold/40 transition-colors duration-300 flex items-center justify-center">
              <Instagram
                size={24}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
