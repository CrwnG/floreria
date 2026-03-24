import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// El cliente Redis lee UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN del .env
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Login admin: máximo 5 intentos por minuto por IP.
 * Protege contra ataques de fuerza bruta al panel de administración.
 */
export const loginRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
  prefix: 'rl:login',
});

/**
 * Checkout / creación de órdenes: máximo 10 por minuto por IP.
 * Previene spam de órdenes falsas.
 */
export const checkoutRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 'rl:checkout',
});

/**
 * API general: máximo 60 peticiones por minuto por IP.
 * Capa de defensa base para el resto de endpoints.
 */
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '60 s'),
  analytics: true,
  prefix: 'rl:api',
});
