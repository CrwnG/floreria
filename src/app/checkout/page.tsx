'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const subtotal = getTotal();
  const envioGratis = subtotal >= FREE_DELIVERY_THRESHOLD;
  const envio = envioGratis ? 0 : DELIVERY_FEE;
  const total = subtotal + envio;

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState<'mercadopago' | 'whatsapp' | null>(null);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <section className="py-20">
        <Container className="text-center">
          <ShoppingBag className="mx-auto mb-6 text-fiorella-light-gray" size={64} />
          <h1 className="font-serif text-3xl text-fiorella-charcoal mb-4">
            Tu carrito esta vacio
          </h1>
          <p className="text-fiorella-warm-gray mb-8">
            Agrega productos para continuar con tu pedido.
          </p>
          <Link href="/">
            <Button variant="primary" size="lg">
              Ver Productos
            </Button>
          </Link>
        </Container>
      </section>
    );
  }

  async function handleSubmit(metodoPago: 'mercadopago' | 'whatsapp') {
    if (!nombre.trim() || !telefono.trim()) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }

    setError('');
    setLoading(metodoPago);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNombre: nombre.trim(),
          clienteTelefono: telefono.trim(),
          clienteEmail: email.trim() || undefined,
          direccion: direccion.trim() || undefined,
          notas: notas.trim() || undefined,
          items: items.map((item) => ({
            productoId: item.productoId,
            slug: item.slug,
            nombre: item.nombre,
            imagen: item.imagen,
            precio: item.precio,
            cantidad: item.cantidad,
          })),
          metodoPago,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocurrio un error. Intenta de nuevo.');
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      setError('Error de conexion. Verifica tu internet e intenta de nuevo.');
    } finally {
      setLoading(null);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-fiorella-light-gray bg-white px-4 py-3 text-fiorella-charcoal placeholder:text-fiorella-warm-gray/60 focus:outline-none focus:border-fiorella-gold transition-colors';

  return (
    <section className="py-12 md:py-20">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-fiorella-warm-gray hover:text-fiorella-gold transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm uppercase tracking-wider">Seguir Comprando</span>
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl text-fiorella-charcoal mb-10">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Formulario del cliente */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <h2 className="font-serif text-xl text-fiorella-charcoal mb-6">
              Datos de Contacto
            </h2>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-fiorella-charcoal mb-2">
                  Nombre Completo <span className="text-fiorella-rose">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fiorella-charcoal mb-2">
                  Telefono (WhatsApp) <span className="text-fiorella-rose">*</span>
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="222 123 4567"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fiorella-charcoal mb-2">
                  Correo Electronico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com (opcional)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fiorella-charcoal mb-2">
                  Direccion de Entrega
                </label>
                <textarea
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle, numero, colonia, codigo postal (opcional)"
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fiorella-charcoal mb-2">
                  Notas Especiales
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Dedicatoria, hora de entrega preferida, instrucciones especiales..."
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Botones de pago */}
            <div className="mt-8 space-y-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleSubmit('mercadopago')}
                disabled={loading !== null}
              >
                {loading === 'mercadopago' ? 'Procesando...' : 'Pagar con Mercado Pago'}
              </Button>

              <Button
                variant="outline-gold"
                size="lg"
                fullWidth
                onClick={() => handleSubmit('whatsapp')}
                disabled={loading !== null}
              >
                {loading === 'whatsapp' ? 'Procesando...' : 'Pedir por WhatsApp'}
              </Button>

              <p className="text-xs text-fiorella-warm-gray text-center mt-2">
                Al pedir por WhatsApp coordinaras el pago directamente con nosotros.
              </p>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl border border-fiorella-light-gray p-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-xl text-fiorella-charcoal mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productoId} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-fiorella-light-gray">
                      <Image
                        src={item.imagen}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-fiorella-charcoal truncate">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-fiorella-warm-gray">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-fiorella-charcoal whitespace-nowrap">
                      {formatPrice(item.precio * item.cantidad)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-fiorella-light-gray pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-fiorella-warm-gray">Subtotal</span>
                  <span className="text-fiorella-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fiorella-warm-gray">Envio</span>
                  <span className="text-fiorella-charcoal">
                    {envioGratis ? (
                      <span className="text-fiorella-sage-dark font-medium">Gratis</span>
                    ) : (
                      formatPrice(envio)
                    )}
                  </span>
                </div>
                {!envioGratis && (
                  <p className="text-xs text-fiorella-sage-dark">
                    Envio gratis en pedidos mayores a {formatPrice(FREE_DELIVERY_THRESHOLD)}
                  </p>
                )}
                <div className="flex justify-between text-lg font-serif font-semibold border-t border-fiorella-light-gray pt-3">
                  <span className="text-fiorella-charcoal">Total</span>
                  <span className="text-fiorella-gold-dark">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
