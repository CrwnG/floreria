'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/data/products';

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <SectionHeading
          title="Los Más Pedidos"
          subtitle="Nuestros arreglos más populares, elegidos por cientos de clientes"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
