import { activationContract } from '@src/api/contracts/activation';
import { s } from '@app/router';
import { activationService as service } from './service';

export const activationRouter = s.router(activationContract, {
  getAll: {
    handler: async ({ params }) => {
      const r = await service.getActivations(params.id);
      return { status: 200, body: r };
    },
  },
  activate: {
    handler: async ({ params, body }) => {
      const r = await service.activate(params.id, body);
      return { status: 200, body: r };
    },
  },
});
