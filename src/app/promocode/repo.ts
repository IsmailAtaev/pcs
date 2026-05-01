import { db, DB } from '@infra/db/db';
import { PaginationUtil } from '@src/utils';
import { Insertable, Selectable, Updateable } from 'kysely';

type Table = DB['promocodes'];
const table = 'promocodes';
type Filter = Partial<Selectable<Table>>;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;

const getAll = async (p: Filter & PaginationUtil['LimitOffset']) => {
  let q = db.selectFrom(table);

  if (p.id) q = q.where('id', '=', p.id);
  if (p.code) q = q.where('code', 'ilike', `%${p.code}%`);

  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();
  const data = await q
    .selectAll()
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('createdAt', 'desc')
    .execute();

  return { count: Number(c?.c), data };
};

const getOne = (id: string) => {
  return db
    .selectFrom(table)
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
};

const findByCode = async (code: string) => {
  return db.selectFrom(table).where('code', '=', code).selectAll().executeTakeFirst();
};

const create = (p: Insert) => {
  return db.insertInto(table).values(p).returningAll().executeTakeFirst();
};

const edit = (id: string, p: Edit) => {
  return db.updateTable(table).where('id', '=', id).set(p).returningAll().executeTakeFirst();
};

const remove = (id: string) => {
  return db.deleteFrom(table).where('id', '=', id).returningAll().executeTakeFirst();
};

const incrementUsedCount = async (id: string) => {
  return db
    .updateTable(table)
    .set((eb) => ({
      usedCount: eb('usedCount', '+', 1)
    }))
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
}

export const promocodeRepo = {
  getAll,
  getOne,
  findByCode,
  create,
  edit,
  remove,
  incrementUsedCount,
};
