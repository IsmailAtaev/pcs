import { initContract } from '@ts-rest/core';
import { promocodeContract } from './promocode';
import { activationContract } from './activation';

const c = initContract();

export const contract = c.router({
  promocode: promocodeContract,
  activation: activationContract,
});
