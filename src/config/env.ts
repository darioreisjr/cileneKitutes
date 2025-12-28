/**
 * Configurações de ambiente
 * Centraliza todas as variáveis de ambiente da aplicação
 */

export const env = {
  // API
  API_URL: import.meta.env.VITE_API_URL || '',

  // WhatsApp
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999',

  // ViaCEP
  VIACEP_URL: import.meta.env.VITE_VIACEP_URL || 'https://viacep.com.br/ws',

  // Mode
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
} as const;

/**
 * Valida se todas as variáveis de ambiente necessárias estão definidas
 */
export function validateEnv(): void {
  const requiredEnvVars: (keyof typeof env)[] = [];

  for (const envVar of requiredEnvVars) {
    if (!env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
