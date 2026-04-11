import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { loginRatelimit, checkoutRatelimit, apiRatelimit } from '@/lib/ratelimit';

// Obtiene la IP real del cliente (considera proxies / Vercel)
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // ─── Rate Limiting para rutas /api ─────────────────────────────────────────
  if (pathname.startsWith('/api')) {
    let result;

    if (pathname.startsWith('/api/auth/signin')) {
      // Más estricto: 5 intentos/minuto para el login
      result = await loginRatelimit.limit(ip);
    } else if (pathname.startsWith('/api/checkout')) {
      // Moderado: 10 órdenes/minuto por IP
      result = await checkoutRatelimit.limit(ip);
    } else {
      // General: 60 peticiones/minuto
      result = await apiRatelimit.limit(ip);
    }

    if (!result.success) {
      const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Por favor espera un momento.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
          },
        }
      );
    }
  }

  // ─── Control de Acceso para rutas /admin ───────────────────────────────────
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
