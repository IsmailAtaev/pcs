import { defineConfig } from 'kysely-ctl';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }),
  }),
  migrations: {
    migrationFolder: 'migrations',
  },
  seeds: {
    seedFolder: 'seeds',
  },
});
