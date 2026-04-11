'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error('No autorizado');

  const id = formData.get('id') as string;
  const estado = formData.get('estado') as string;

  if (!id || !estado) throw new Error('Faltan campos requeridos');

  const VALID_STATUSES = ['pendiente', 'pagado', 'confirmado', 'enviado', 'entregado', 'cancelado'];
  if (!VALID_STATUSES.includes(estado)) {
    throw new Error('Estado no valido');
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { estado },
    });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw new Error('Error al actualizar el estado del pedido. Intenta de nuevo.');
  }

  revalidatePath('/admin/pedidos');
}
