import { PromocodeSchema as Schema } from '@src/api/schema/promocode';
import { err, paginationUtil } from '@src/utils';
import { promocodeRepo as repo } from './repo';

const getAll = async (p: Schema['GetAll']) => {
  const { limit, offset } = paginationUtil.limitOffset(p);
  return repo.getAll({ ...p, limit, offset });
};

const getOne = async (id: string) => {
  const one = await repo.getOne(id);
  if (!one) throw new err.NotFound();
  return one;
};

const create = async (p: Schema['Create']) => {
  const existing = await repo.findByCode(p.code);
  if (existing) throw err.BadRequest('Promocode with this code already exists');

  const one = await repo.create({
    code: p.code,
    discount: p.discount,
    maxUses: p.maxUses,
    expiresAt: p.expiresAt,
  });
  if (!one) throw err.BadRequest('not created');

  return one;
};

export const promocodeService = {
  getAll,
  getOne,
  create,
};
