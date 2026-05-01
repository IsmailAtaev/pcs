import { contract } from '@api/contracts';
import { s } from '@app/router';
import { promocodeRouter } from './promocode/controller';
import { activationRouter } from './activation/controller';

export const router = s.router(contract, {
  promocode: promocodeRouter,
  activation: activationRouter,
});
