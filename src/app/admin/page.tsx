import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const session = await auth();

  const [totalProducts, totalOrders, revenueResult, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { estado: { in: ['pagado', 'confirmado', 'enviado', 'entregado'] } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
    ]);

  const revenue = revenueResult._sum.total ?? 0;

  const stats = [
    {
      label: 'Total Productos',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Pedidos',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Ingresos',
      value: formatPrice(revenue),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Pedidos Recientes',
      value: recentOrders.length.toString(),
      icon: TrendingUp,
      color: 'text-fiorella-gold',
      bg: 'bg-fiorella-gold/10',
    },
  ];

  const statusLabels: Record<string, string> = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    confirmado: 'Confirmado',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };

  const statusColors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    pagado: 'bg-green-100 text-green-800',
    confirmado: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-fiorella-charcoal">
          Bienvenido, {session?.user?.name ?? 'Administrador'}
        </h1>
        <p className="text-fiorella-charcoal/60 mt-1">
          Panel de administraci&oacute;n de Fiorella Balloons
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-fiorella-light-gray rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fiorella-charcoal/60">{stat.label}</p>
                  <p className="text-2xl font-bold text-fiorella-charcoal mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 mb-8">
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-fiorella-gold text-white px-6 py-3 rounded-lg text-sm font-medium uppercase tracking-wider hover:bg-fiorella-gold-dark transition-colors"
        >
          <Package className="w-4 h-4" />
          Agregar Producto
        </Link>
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 border border-fiorella-charcoal text-fiorella-charcoal px-6 py-3 rounded-lg text-sm font-medium uppercase tracking-wider hover:bg-fiorella-charcoal hover:text-white transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Ver Pedidos
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-fiorella-light-gray rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-fiorella-light-gray">
          <h2 className="text-lg font-serif font-bold text-fiorella-charcoal">
            Pedidos Recientes
          </h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-fiorella-charcoal/50">
            No hay pedidos a&uacute;n
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    ID
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Cliente
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Total
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Estado
                  </th>
                  <th className="px-6 py-3 font-medium text-fiorella-charcoal/60">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fiorella-light-gray">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs">
                      {order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">{order.clienteNombre}</td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.estado] ?? 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusLabels[order.estado] ?? order.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-fiorella-charcoal/60">
                      {new Date(order.createdAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
