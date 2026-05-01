import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
  HOST: z.string(),
});

export type Env = z.infer<typeof envSchema>;
