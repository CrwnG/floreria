import { prisma } from './prisma';
import type { Product, Category, ProductCategory, Occasion, BadgeType } from '@/types';

// MED-5: Safe JSON parse — evita que datos corruptos rompan la pagina completa
function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    console.error(`Error al parsear JSON: ${json.substring(0, 100)}`);
    return fallback;
  }
}

function transformProduct(dbProduct: {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  descripcionCorta: string;
  precio: number;
  precioOriginal: number | null;
  category: { slug: string };
  ocasiones: string;
  imagenes: string;
  badge: string | null;
  enStock: boolean;
  destacado: boolean;
}): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    nombre: dbProduct.nombre,
    descripcion: dbProduct.descripcion,
    descripcionCorta: dbProduct.descripcionCorta,
    precio: dbProduct.precio,
    precioOriginal: dbProduct.precioOriginal ?? undefined,
    categoria: dbProduct.category.slug as ProductCategory,
    ocasiones: safeJsonParse<Occasion[]>(dbProduct.ocasiones, []),
    imagenes: safeJsonParse<string[]>(dbProduct.imagenes, []),
    badge: (dbProduct.badge as BadgeType) ?? undefined,
    enStock: dbProduct.enStock,
    destacado: dbProduct.destacado,
  };
}

function transformCategory(dbCategory: {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}): Category {
  return {
    id: dbCategory.id,
    slug: dbCategory.slug,
    nombre: dbCategory.nombre,
    descripcion: dbCategory.descripcion,
    imagen: dbCategory.imagen,
  };
}

const productInclude = { category: true } as const;

export async function getProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
  return dbProducts.map(transformProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  if (!dbProduct) return null;
  return transformProduct(dbProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return [];

  const dbProducts = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
  return dbProducts.map(transformProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { destacado: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });
  return dbProducts.map(transformProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!dbProduct) return null;
  return transformProduct(dbProduct);
}

export async function getCategories(): Promise<Category[]> {
  const dbCategories = await prisma.category.findMany({
    orderBy: { orden: 'asc' },
  });
  return dbCategories.map(transformCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const dbCategory = await prisma.category.findUnique({
    where: { slug },
  });
  if (!dbCategory) return null;
  return transformCategory(dbCategory);
}
