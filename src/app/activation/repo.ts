import { db, DB } from '@infra/db/db';

const getActivations = async (promocodeId: string) => {
  const c = await db.selectFrom('activations').where('promocodeId', '=', promocodeId).select(o => o.fn.countAll().as('c')).executeTakeFirst();
  const data = await db.selectFrom('activations').where('promocodeId', '=', promocodeId).selectAll().execute();
  return { count: Number(c?.c), data };
}

const findActivation = async (promocodeId: string, email: string) => {
  return db.selectFrom('activations').where('promocodeId', '=', promocodeId).where('email', '=', email).selectAll().executeTakeFirst();
}

const createActivation = async (promocodeId: string, email: string) => {
  return db.insertInto('activations').values({ promocodeId, email }).returningAll().executeTakeFirst();
}

export const activationRepo = {
  getActivations,
  findActivation,
  createActivation,
};
