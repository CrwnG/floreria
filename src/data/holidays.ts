import { Holiday } from '@/types';

export const holidays: Holiday[] = [
  {
    id: 'san-valentin',
    nombre: 'Día de San Valentín',
    fecha: '2026-02-14',
    mensaje: 'Sorprende a quien amas este 14 de febrero',
  },
  {
    id: 'dia-madres',
    nombre: 'Día de las Madres',
    fecha: '2026-05-10',
    mensaje: 'Celebra a mamá con el arreglo perfecto',
  },
  {
    id: 'dia-muertos',
    nombre: 'Día de Muertos',
    fecha: '2026-11-02',
    mensaje: 'Honra a quienes ya no están con flores tradicionales',
  },
  {
    id: 'navidad',
    nombre: 'Navidad',
    fecha: '2026-12-25',
    mensaje: 'Regala alegría y flores en esta Navidad',
  },
];

export function getNextHoliday(): Holiday | null {
  const now = new Date();
  const upcoming = holidays
    .filter((h) => new Date(h.fecha) > now)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  return upcoming[0] || null;
}
