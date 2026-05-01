import { ActivationSchema as Schema } from '@src/api/schema/activation';
import { err } from '@src/utils';
import { activationRepo as repo } from './repo';
import { promocodeRepo } from '../promocode/repo';

const getActivations = async (id: string) => {
  const one = await promocodeRepo.getOne(id);
  if (!one) throw new err.NotFound();
  return repo.getActivations(id);
};

const activate = async (id: string, p: Schema['Activate']) => {
  const promocode = await promocodeRepo.getOne(id);
  if (!promocode) throw new err.NotFound();

  if (new Date() > new Date(promocode.expiresAt)) {
    throw err.BadRequest('Promocode is expired');
  }

  if (promocode.usedCount >= promocode.maxUses) {
    throw err.BadRequest('Promocode usage limit reached');
  }

  const existingActivation = await repo.findActivation(id, p.email);
  if (existingActivation) {
    throw err.BadRequest('This email has already activated this promocode');
  }

  const activation = await repo.createActivation(id, p.email);
  if (!activation) throw err.BadRequest('Activation failed');

  await promocodeRepo.incrementUsedCount(id);

  return activation;
};

export const activationService = {
  getActivations,
  activate,
};
