import { z } from 'zod';
import { commonQuery, paramsId } from './common';

const activationBase = z.object({
  id: z.string().uuid(),
  promocodeId: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.coerce.date(),
});

const activate = z.object({
  email: z.string().email(),
});

const activateRes = activationBase;

const getActivationsRes = z.object({
  count: z.number(),
  data: activationBase.array(),
});

const getAllRes = getActivationsRes;

type Activate = z.infer<typeof activate>;

export const activationSchema = {
  paramsId,
  activate,
  activateRes,
  getActivationsRes,
  getAllRes,
};

export type ActivationSchema = {
  Activate: Activate;
};
