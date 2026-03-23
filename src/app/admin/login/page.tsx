'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Correo electrónico o contraseña incorrectos.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fiorella-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo / Marca */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-fiorella-charcoal tracking-wide">
              Fiorella Balloons
            </h1>
            <p className="mt-2 text-sm text-fiorella-charcoal/60 uppercase tracking-widest">
              Panel de Administración
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 rounded-md bg-rose-50 border border-rose-200 p-3 text-sm text-rose-600 text-center">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-fiorella-charcoal mb-1.5"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-fiorella-light-gray px-4 py-3 text-sm text-fiorella-charcoal placeholder:text-fiorella-charcoal/40 focus:border-fiorella-gold focus:ring-2 focus:ring-fiorella-gold/20 focus:outline-none transition-colors"
                placeholder="admin@fiorellaballoons.mx"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-fiorella-charcoal mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-fiorella-light-gray px-4 py-3 text-sm text-fiorella-charcoal placeholder:text-fiorella-charcoal/40 focus:border-fiorella-gold focus:ring-2 focus:ring-fiorella-gold/20 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-fiorella-charcoal/40">
          &copy; {new Date().getFullYear()} Fiorella Balloons. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
