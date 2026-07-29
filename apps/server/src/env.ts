import { z } from 'zod';

const schema = z.object({
  IS_PRODUCTION: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  PORT: z.coerce.number().default(8080),
  DB_HOST: z.string().default(''),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default(''),
  DB_PASSWORD: z.string().default(''),
  S3_ACCESS_KEY: z.string().default(''),
  S3_SECRET_KEY: z.string().default(''),
  TELEGRAM_BOT_TOKEN: z.string().default(''),
  TELEGRAM_TRAINTO_CHAT_ID: z.string().default(''),
  GMAIL_SMTP_ID: z.string().default(''),
  GMAIL_SMTP_PASSWORD: z.string().default(''),
  SECRET: z.string().default(''),
  API_KEY_GITHUB: z.string().default(''),
});

export const env = schema.parse(process.env);
