import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('promocodes')
    .ifNotExists()
    .addColumn('id', 'uuid', c => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('code', 'varchar', c => c.notNull().unique())
    .addColumn('discount', 'float4', c => c.notNull())
    .addColumn('max_uses', 'integer', c => c.notNull())
    .addColumn('used_count', 'integer', c => c.notNull().defaultTo(0))
    .addColumn('expires_at', 'timestamptz', c => c.notNull())
    .addColumn('created_at', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('promocodes').ifExists().execute();
}
