import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    slug: 'flores',
    nombre: 'Flores',
    descripcion: 'Arreglos florales artesanales con las flores más frescas',
    imagen: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=800&fit=crop&q=80',
    orden: 0,
  },
  {
    slug: 'globos',
    nombre: 'Globos',
    descripcion: 'Arreglos y bouquets de globos para toda ocasión',
    imagen: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop&q=80',
    orden: 1,
  },
  {
    slug: 'regalos',
    nombre: 'Regalos',
    descripcion: 'Chocolates, peluches y detalles especiales',
    imagen: 'https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=600&h=800&fit=crop&q=80',
    orden: 2,
  },
];

const products = [
  {
    slug: 'ramo-rosas-rojas-clasicas',
    nombre: 'Ramo de Rosas Rojas Clásicas',
    descripcion: 'Un clásico atemporal. 24 rosas rojas de tallo largo, cuidadosamente seleccionadas y envueltas en papel de lujo con listón de seda.',
    descripcionCorta: '24 rosas rojas de tallo largo',
    precio: 599,
    categorySlug: 'flores',
    ocasiones: ['san-valentin', 'aniversario'],
    imagenes: ['https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=800&fit=crop&q=80'],
    badge: 'bestseller',
    enStock: true,
    destacado: true,
  },
  {
    slug: 'arreglo-tulipanes-holandeses',
    nombre: 'Arreglo de Tulipanes Holandeses',
    descripcion: 'Tulipanes importados de Holanda en tonos pastel. Presentados en un elegante jarrón de cristal.',
    descripcionCorta: 'Tulipanes importados en jarrón de cristal',
    precio: 849,
    categorySlug: 'flores',
    ocasiones: ['cumpleanos', 'dia-madres'],
    imagenes: ['https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&h=800&fit=crop&q=80'],
    badge: 'nuevo',
    enStock: true,
    destacado: true,
  },
  {
    slug: 'bouquet-silvestre-primavera',
    nombre: 'Bouquet Silvestre "Primavera"',
    descripcion: 'Mezcla fresca de flores silvestres en tonos vibrantes. Ideal para alegrar cualquier espacio.',
    descripcionCorta: 'Flores silvestres en tonos vibrantes',
    precio: 499,
    categorySlug: 'flores',
    ocasiones: ['cumpleanos', 'graduacion'],
    imagenes: ['https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: false,
  },
  {
    slug: 'caja-rosas-premium',
    nombre: 'Caja de Rosas Premium',
    descripcion: 'Lujosa caja redonda con 36 rosas ecuatorianas. El regalo más elegante para alguien especial.',
    descripcionCorta: '36 rosas ecuatorianas en caja de lujo',
    precio: 1299,
    categorySlug: 'flores',
    ocasiones: ['san-valentin', 'aniversario'],
    imagenes: ['https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&h=800&fit=crop&q=80'],
    badge: 'bestseller',
    enStock: true,
    destacado: true,
  },
  {
    slug: 'ramo-girasoles-alegria',
    nombre: 'Ramo de Girasoles "Alegría"',
    descripcion: 'Girasoles brillantes que iluminan cualquier día. Envueltos en papel kraft con un toque rústico.',
    descripcionCorta: '12 girasoles envueltos en papel kraft',
    precio: 449,
    categorySlug: 'flores',
    ocasiones: ['cumpleanos', 'graduacion'],
    imagenes: ['https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: true,
  },
  {
    slug: 'arreglo-orquideas',
    nombre: 'Arreglo de Orquídeas Phalaenopsis',
    descripcion: 'Elegante orquídea Phalaenopsis en maceta de cerámica artesanal. Dura semanas con el cuidado adecuado.',
    descripcionCorta: 'Orquídea en maceta de cerámica artesanal',
    precio: 1499,
    categorySlug: 'flores',
    ocasiones: ['aniversario', 'dia-madres'],
    imagenes: ['https://images.unsplash.com/photo-1566873535350-a3f5d4a804b7?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: false,
  },
  {
    slug: 'bouquet-globos-helio',
    nombre: 'Bouquet de Globos con Helio',
    descripcion: '6 globos de helio con diseños exclusivos. Incluye peso decorativo y listones rizados.',
    descripcionCorta: '6 globos de helio con diseños exclusivos',
    precio: 399,
    categorySlug: 'globos',
    ocasiones: ['cumpleanos', 'graduacion'],
    imagenes: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop&q=80'],
    badge: 'bestseller',
    enStock: true,
    destacado: true,
  },
  {
    slug: 'box-globos-sorpresa',
    nombre: 'Box de Globos Sorpresa',
    descripcion: 'Caja sorpresa que al abrirse libera globos de helio con confeti. Incluye mensaje personalizado.',
    descripcionCorta: 'Caja sorpresa con globos y confeti',
    precio: 599,
    categorySlug: 'globos',
    ocasiones: ['cumpleanos', 'san-valentin'],
    imagenes: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=800&fit=crop&q=80'],
    badge: 'nuevo',
    enStock: true,
    destacado: true,
  },
  {
    slug: 'arco-globos-celebracion',
    nombre: 'Arco de Globos "Celebración"',
    descripcion: 'Espectacular arco orgánico de globos en los colores de tu elección. Perfecto para eventos y fiestas.',
    descripcionCorta: 'Arco orgánico para eventos',
    precio: 899,
    categorySlug: 'globos',
    ocasiones: ['cumpleanos', 'graduacion'],
    imagenes: ['https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: false,
  },
  {
    slug: 'bouquet-globos-te-amo',
    nombre: 'Bouquet de Globos "Te Amo"',
    descripcion: 'Arreglo romántico de globos en forma de corazón con globos metálicos dorados y rojos.',
    descripcionCorta: 'Globos en forma de corazón',
    precio: 449,
    categorySlug: 'globos',
    ocasiones: ['san-valentin', 'aniversario'],
    imagenes: ['https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: true,
  },
  {
    slug: 'numero-gigante-globos',
    nombre: 'Número Gigante de Globos',
    descripcion: 'Número gigante (90cm) formado con mini globos. Elige el número y los colores de tu preferencia.',
    descripcionCorta: 'Número de 90cm con mini globos',
    precio: 499,
    categorySlug: 'globos',
    ocasiones: ['cumpleanos'],
    imagenes: ['https://images.unsplash.com/photo-1504389557390-bff3b4866e9e?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: false,
  },
  {
    slug: 'caja-chocolates-artesanales',
    nombre: 'Caja de Chocolates Artesanales',
    descripcion: 'Selección de 24 chocolates artesanales poblanos. Presentación en caja de madera grabada.',
    descripcionCorta: '24 chocolates artesanales poblanos',
    precio: 399,
    categorySlug: 'regalos',
    ocasiones: ['san-valentin', 'dia-madres', 'cumpleanos'],
    imagenes: ['https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=600&h=800&fit=crop&q=80'],
    badge: 'bestseller',
    enStock: true,
    destacado: true,
  },
  {
    slug: 'peluche-premium-rosas',
    nombre: 'Peluche Premium con Rosas',
    descripcion: 'Adorable oso de peluche de 40cm acompañado de un mini ramo de 6 rosas rojas.',
    descripcionCorta: 'Oso de peluche 40cm + 6 rosas',
    precio: 699,
    categorySlug: 'regalos',
    ocasiones: ['san-valentin', 'cumpleanos'],
    imagenes: ['https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: true,
  },
  {
    slug: 'canasta-gourmet-poblana',
    nombre: 'Canasta Gourmet Poblana',
    descripcion: 'Canasta con productos gourmet de Puebla: mole, dulces típicos, café de Cuetzalan y mezcal artesanal.',
    descripcionCorta: 'Productos gourmet de Puebla',
    precio: 899,
    categorySlug: 'regalos',
    ocasiones: ['navidad', 'dia-madres'],
    imagenes: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=800&fit=crop&q=80'],
    badge: 'nuevo',
    enStock: true,
    destacado: false,
  },
  {
    slug: 'kit-spa-relajacion',
    nombre: 'Kit Spa "Relajación"',
    descripcion: 'Set de spa con sales de baño, vela aromática, jabón artesanal y crema hidratante. Todo orgánico.',
    descripcionCorta: 'Set completo de spa orgánico',
    precio: 549,
    categorySlug: 'regalos',
    ocasiones: ['dia-madres', 'cumpleanos'],
    imagenes: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=800&fit=crop&q=80'],
    enStock: true,
    destacado: false,
  },
];

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`Created ${categories.length} categories`);

  // Create products
  for (const prod of products) {
    const { categorySlug, ocasiones, imagenes, ...rest } = prod;
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...rest,
        categoryId: categoryMap[categorySlug],
        ocasiones: JSON.stringify(ocasiones),
        imagenes: JSON.stringify(imagenes),
      },
      create: {
        ...rest,
        categoryId: categoryMap[categorySlug],
        ocasiones: JSON.stringify(ocasiones),
        imagenes: JSON.stringify(imagenes),
      },
    });
  }
  console.log(`Created ${products.length} products`);

  // Create default admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'Fiorella2024!';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fiorella.mx';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      nombre: 'Administrador',
    },
  });
  console.log(`Created admin user: ${adminEmail}`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
