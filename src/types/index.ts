export type ProductCategory = 'flores' | 'globos' | 'regalos';

export type Occasion =
  | 'cumpleanos'
  | 'san-valentin'
  | 'dia-madres'
  | 'aniversario'
  | 'condolencias'
  | 'graduacion'
  | 'dia-muertos'
  | 'navidad';

export type BadgeType = 'bestseller' | 'nuevo' | 'oferta';

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  descripcionCorta: string;
  precio: number;
  precioOriginal?: number;
  categoria: ProductCategory;
  ocasiones: Occasion[];
  imagenes: string[];
  badge?: BadgeType;
  enStock: boolean;
  destacado: boolean;
}

export interface Category {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}

export interface OccasionData {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}

export interface Holiday {
  id: string;
  nombre: string;
  fecha: string;
  mensaje: string;
}

export interface Testimonial {
  id: string;
  nombre: string;
  texto: string;
  calificacion: number;
  fecha: string;
}

export interface CartItem {
  productoId: string;
  slug: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
}
