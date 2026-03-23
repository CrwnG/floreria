import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { updateOrderStatus } from './actions';

const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
];

const statusColors: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  pagado: 'bg-green-100 text-green-800',
  confirmado: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const paymentLabels: Record<string, string> = {
  mercadopago: 'MercadoPago',
  whatsapp: 'WhatsApp',
};

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-fiorella-charcoal">
          Pedidos
        </h1>
        <p className="text-fiorella-charcoal/60 mt-1">
          {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-fiorella-charcoal/50">
          <p className="text-lg">No hay pedidos a&uacute;n</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <details
              key={order.id}
              className="bg-white border border-fiorella-light-gray rounded-xl overflow-hidden group"
            >
              <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    {/* ID */}
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>

                    {/* Cliente */}
                    <div>
                      <p className="font-medium text-fiorella-charcoal text-sm">
                        {order.clienteNombre}
                      </p>
                      <p className="text-xs text-fiorella-charcoal/50">
                        {order.clienteTelefono}
                        {order.clienteEmail && ` \u00b7 ${order.clienteEmail}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Fecha */}
                    <span className="text-sm text-fiorella-charcoal/60">
                      {new Date(order.createdAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* Total */}
                    <span className="font-medium text-fiorella-charcoal text-sm">
                      {formatPrice(order.total)}
                    </span>

                    {/* Metodo de pago */}
                    <span className="text-xs text-fiorella-charcoal/60 bg-gray-100 px-2 py-1 rounded">
                      {paymentLabels[order.metodoPago] ?? order.metodoPago}
                    </span>

                    {/* Estado badge */}
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.estado] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabels[order.estado] ?? order.estado}
                    </span>
                  </div>
                </div>
              </summary>

              {/* Expanded content */}
              <div className="px-6 py-4 border-t border-fiorella-light-gray bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order items */}
                  <div>
                    <h3 className="text-sm font-medium text-fiorella-charcoal mb-3">
                      Productos
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-fiorella-light-gray"
                        >
                          <div>
                            <p className="font-medium text-fiorella-charcoal">
                              {item.nombre}
                            </p>
                            <p className="text-xs text-fiorella-charcoal/50">
                              Cantidad: {item.cantidad}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.precio * item.cantidad)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-3 pt-3 border-t border-fiorella-light-gray space-y-1 text-sm">
                      <div className="flex justify-between text-fiorella-charcoal/70">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-fiorella-charcoal/70">
                        <span>Env&iacute;o</span>
                        <span>{formatPrice(order.envio)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-fiorella-charcoal">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order details & status change */}
                  <div>
                    {/* Delivery info */}
                    {order.direccion && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-fiorella-charcoal mb-1">
                          Direcci&oacute;n de entrega
                        </h3>
                        <p className="text-sm text-fiorella-charcoal/70">
                          {order.direccion}
                        </p>
                      </div>
                    )}

                    {order.notas && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-fiorella-charcoal mb-1">
                          Notas
                        </h3>
                        <p className="text-sm text-fiorella-charcoal/70">
                          {order.notas}
                        </p>
                      </div>
                    )}

                    {order.mercadoPagoId && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-fiorella-charcoal mb-1">
                          MercadoPago
                        </h3>
                        <p className="text-xs text-fiorella-charcoal/50 font-mono">
                          ID: {order.mercadoPagoId}
                        </p>
                        {order.mercadoPagoStatus && (
                          <p className="text-xs text-fiorella-charcoal/50">
                            Estado: {order.mercadoPagoStatus}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status change */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-fiorella-charcoal mb-2">
                        Cambiar estado
                      </h3>
                      <form action={updateOrderStatus} className="flex gap-2">
                        <input type="hidden" name="id" value={order.id} />
                        <select
                          name="estado"
                          defaultValue={order.estado}
                          className="flex-1 rounded-lg border border-fiorella-light-gray px-3 py-2 text-sm focus:outline-none focus:border-fiorella-gold focus:ring-2 focus:ring-fiorella-gold/20"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="bg-fiorella-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-fiorella-gold-dark transition-colors cursor-pointer"
                        >
                          Actualizar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
