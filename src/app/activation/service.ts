import { ActivationSchema as Schema } from '@src/api/schema/activation';
import { err } from '@src/utils';
import { activationRepo as repo } from './repo';
import { promocodeRepo } from '../promocode/repo';
import { db } from '@infra/db/db';

const getActivations = async (id: string) => {
  const one = await promocodeRepo.getOne(id);
  if (!one) throw new err.NotFound();
  return repo.getActivations(id);
};

const activate = async (id: string, p: Schema['Activate']) => {
  return await db.transaction().execute(async (trx) => {
    const promocode = await trx.selectFrom('promocodes')
      .where('id', '=', id)
      .forUpdate()
      .selectAll()
      .executeTakeFirst();

    if (!promocode) throw new err.NotFound();

    if (new Date() > new Date(promocode.expiresAt)) {
      throw err.BadRequest('Promocode is expired');
    }

    if (promocode.usedCount >= promocode.maxUses) {
      throw err.BadRequest('Promocode usage limit reached');
    }

    const existingActivation = await trx.selectFrom('activations')
      .where('promocodeId', '=', id)
      .where('email', '=', p.email)
      .selectAll()
      .executeTakeFirst();

    if (existingActivation) {
      throw err.BadRequest('This email has already activated this promocode');
    }

    const activation = await trx.insertInto('activations')
      .values({ promocodeId: id, email: p.email })
      .returningAll()
      .executeTakeFirst();

    if (!activation) throw err.BadRequest('Activation failed');

    await trx.updateTable('promocodes')
      .set((eb) => ({
        usedCount: eb('usedCount', '+', 1)
      }))
      .where('id', '=', id)
      .execute();

    return activation;
  });
};

export const activationService = {
  getActivations,
  activate,
};
