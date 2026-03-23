const requiredServerEnvVars = [
  'DATABASE_URL',
  'AUTH_SECRET',
] as const;

const requiredPublicEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredServerEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  for (const envVar of requiredPublicEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `⚠️ Variables de entorno faltantes: ${missing.join(', ')}. Revisa tu archivo .env`
    );
  }
}
