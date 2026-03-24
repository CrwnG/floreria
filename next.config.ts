import type { NextConfig } from "next";

// Fuentes de confianza por directiva CSP
const CSP_DIRECTIVES = {
  "default-src":    ["'self'"],
  "script-src":     ["'self'", "'unsafe-inline'", "https://sdk.mercadopago.com", "https://*.mercadopago.com"],
  "style-src":      ["'self'", "'unsafe-inline'"],
  "img-src":        ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://images.unsplash.com"],
  "font-src":       ["'self'"],
  "connect-src":    ["'self'", "https://api.mercadopago.com", "https://*.mercadopago.com"],
  "frame-src":      ["https://*.mercadopago.com", "https://www.mercadopago.com.mx"],
  "frame-ancestors":["'none'"],
  "object-src":     ["'none'"],
  "base-uri":       ["'self'"],
  "form-action":    ["'self'", "https://*.mercadopago.com"],
  "upgrade-insecure-requests": [],
};

function buildCsp(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) =>
      sources.length > 0
        ? `${directive} ${sources.join(" ")}`
        : directive
    )
    .join("; ");
}

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: buildCsp(),
          },
          {
            // Evita que el sitio sea incrustado en iframes de terceros (clickjacking)
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Bloquea MIME-type sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Solo envía el origen (sin path/query) en el Referer al navegar fuera del sitio
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Limita el acceso a APIs sensibles del navegador
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
