import { z } from 'zod';
import { commonQuery, paramsId } from './common';

// ─── Promocode schemas ───

const promocodeBase = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).max(50),
  discount: z.number().min(0.01).max(100),
  maxUses: z.number().int().min(1),
  usedCount: z.number().int(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

const getAll = promocodeBase
  .pick({ code: true })
  .partial()
  .merge(commonQuery);

const getAllRes = z.object({
  count: z.number(),
  data: promocodeBase.array(),
});

const getOneRes = promocodeBase;

const create = promocodeBase.pick({
  code: true,
  discount: true,
  maxUses: true,
  expiresAt: true,
});

// ─── Type inference ───

type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;

export const promocodeSchema = {
  paramsId,
  getAll,
  getAllRes,
  getOneRes,
  create,
};

export type PromocodeSchema = {
  GetAll: GetAll;
  Create: Create;
};
