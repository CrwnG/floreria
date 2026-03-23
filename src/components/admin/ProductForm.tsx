'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, ImageIcon } from 'lucide-react';

interface ProductData {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  descripcionCorta: string;
  precio: number;
  precioOriginal: number | null;
  categoryId: string;
  ocasiones: string;
  imagenes: string;
  badge: string | null;
  enStock: boolean;
  destacado: boolean;
}

interface CategoryOption {
  id: string;
  slug: string;
  nombre: string;
}

interface ProductFormProps {
  product?: ProductData;
  categories: CategoryOption[];
  action: (formData: FormData) => Promise<void>;
}

const OCASIONES = [
  { value: 'cumpleanos', label: 'Cumplea\u00f1os' },
  { value: 'san-valentin', label: 'San Valent\u00edn' },
  { value: 'dia-madres', label: 'D\u00eda de las Madres' },
  { value: 'aniversario', label: 'Aniversario' },
  { value: 'condolencias', label: 'Condolencias' },
  { value: 'graduacion', label: 'Graduaci\u00f3n' },
  { value: 'dia-muertos', label: 'D\u00eda de Muertos' },
  { value: 'navidad', label: 'Navidad' },
];

const BADGES = [
  { value: '', label: 'Ninguno' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'oferta', label: 'Oferta' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const inputClasses =
  'w-full rounded-lg border border-fiorella-light-gray px-4 py-3 focus:outline-none focus:border-fiorella-gold focus:ring-2 focus:ring-fiorella-gold/20 text-sm';
const labelClasses = 'block text-sm font-medium text-fiorella-charcoal mb-1.5';

export function ProductForm({ product, categories, action }: ProductFormProps) {
  const isEdit = !!product;
  let parsedOcasiones: string[] = [];
  let parsedImagenes: string[] = [];
  try {
    parsedOcasiones = product ? JSON.parse(product.ocasiones || '[]') : [];
  } catch { parsedOcasiones = []; }
  try {
    parsedImagenes = product ? JSON.parse(product.imagenes || '[]') : [];
  } catch { parsedImagenes = []; }

  const [slug, setSlug] = useState(product?.slug ?? '');
  const [nombre, setNombre] = useState(product?.nombre ?? '');
  const [imagenes, setImagenes] = useState<string[]>(parsedImagenes);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedOcasiones, setSelectedOcasiones] =
    useState<string[]>(parsedOcasiones);

  useEffect(() => {
    if (!isEdit) {
      setSlug(slugify(nombre));
    }
  }, [nombre, isEdit]);

  const addImage = () => {
    const url = newImageUrl.trim();
    if (url && !imagenes.includes(url)) {
      setImagenes([...imagenes, url]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };

  const toggleOcasion = (value: string) => {
    setSelectedOcasiones((prev) =>
      prev.includes(value)
        ? prev.filter((o) => o !== value)
        : [...prev, value]
    );
  };

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {/* Hidden field for imagenes */}
      <input type="hidden" name="imagenes" value={imagenes.join(',')} />

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className={labelClasses}>
          Nombre del Producto
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className={labelClasses}>
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={inputClasses}
          required
        />
        <p className="text-xs text-fiorella-charcoal/50 mt-1">
          Se genera autom&aacute;ticamente desde el nombre. Puedes editarlo manualmente.
        </p>
      </div>

      {/* Descripcion */}
      <div>
        <label htmlFor="descripcion" className={labelClasses}>
          Descripci&oacute;n
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          defaultValue={product?.descripcion ?? ''}
          className={inputClasses}
          required
        />
      </div>

      {/* Descripcion Corta */}
      <div>
        <label htmlFor="descripcionCorta" className={labelClasses}>
          Descripci&oacute;n Corta
        </label>
        <input
          type="text"
          id="descripcionCorta"
          name="descripcionCorta"
          defaultValue={product?.descripcionCorta ?? ''}
          className={inputClasses}
          required
        />
      </div>

      {/* Precio and Precio Original */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precio" className={labelClasses}>
            Precio (MXN)
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            step="0.01"
            min="0"
            defaultValue={product?.precio ?? ''}
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="precioOriginal" className={labelClasses}>
            Precio Original (MXN, opcional)
          </label>
          <input
            type="number"
            id="precioOriginal"
            name="precioOriginal"
            step="0.01"
            min="0"
            defaultValue={product?.precioOriginal ?? ''}
            className={inputClasses}
          />
          <p className="text-xs text-fiorella-charcoal/50 mt-1">
            Dejar vac&iacute;o si no tiene descuento
          </p>
        </div>
      </div>

      {/* Categoria */}
      <div>
        <label htmlFor="categoryId" className={labelClasses}>
          Categor&iacute;a
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId ?? ''}
          className={inputClasses}
          required
        >
          <option value="">Seleccionar categor&iacute;a...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Ocasiones */}
      <div>
        <label className={labelClasses}>Ocasiones</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
          {OCASIONES.map((ocasion) => (
            <label
              key={ocasion.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                name="ocasiones"
                value={ocasion.value}
                checked={selectedOcasiones.includes(ocasion.value)}
                onChange={() => toggleOcasion(ocasion.value)}
                className="w-4 h-4 rounded border-fiorella-light-gray text-fiorella-gold focus:ring-fiorella-gold/20"
              />
              <span className="text-sm text-fiorella-charcoal">
                {ocasion.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Badge */}
      <div>
        <label htmlFor="badge" className={labelClasses}>
          Badge
        </label>
        <select
          id="badge"
          name="badge"
          defaultValue={product?.badge ?? ''}
          className={inputClasses}
        >
          {BADGES.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Toggles */}
      <div className="flex gap-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="enStock"
            defaultChecked={product?.enStock ?? true}
            className="w-4 h-4 rounded border-fiorella-light-gray text-fiorella-gold focus:ring-fiorella-gold/20"
          />
          <span className="text-sm font-medium text-fiorella-charcoal">
            En Stock
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="destacado"
            defaultChecked={product?.destacado ?? false}
            className="w-4 h-4 rounded border-fiorella-light-gray text-fiorella-gold focus:ring-fiorella-gold/20"
          />
          <span className="text-sm font-medium text-fiorella-charcoal">
            Destacado
          </span>
        </label>
      </div>

      {/* Imagenes */}
      <div>
        <label className={labelClasses}>Im&aacute;genes</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Pegar URL de imagen..."
            className={inputClasses}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-1.5 bg-fiorella-charcoal text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-fiorella-charcoal/90 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {imagenes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {imagenes.map((url, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-fiorella-light-gray aspect-square"
              >
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-fiorella-light-gray rounded-lg p-8 text-center text-fiorella-charcoal/40">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No hay im&aacute;genes agregadas</p>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="bg-fiorella-gold text-white px-8 py-3 rounded-lg text-sm font-medium uppercase tracking-wider hover:bg-fiorella-gold-dark transition-colors cursor-pointer"
        >
          {isEdit ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
}
