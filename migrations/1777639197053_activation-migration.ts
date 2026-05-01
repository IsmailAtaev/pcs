import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('activations')
    .ifNotExists()
    .addColumn('id', 'uuid', c => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('promocode_id', 'uuid', c => c.notNull().references('promocodes.id').onDelete('cascade'))
    .addColumn('email', 'varchar', c => c.notNull())
    .addColumn('created_at', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('activations_promocode_email_unique', ['promocode_id', 'email'])
    .execute();

  await db.schema
    .createIndex('activations_promocode_id_index')
    .on('activations')
    .column('promocode_id')
    .execute();

  await db.schema
    .createIndex('activations_email_index')
    .on('activations')
    .column('email')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('activations').ifExists().execute();
}
