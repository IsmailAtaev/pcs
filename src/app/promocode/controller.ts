import { promocodeContract } from '@src/api/contracts/promocode';
import { s } from '@app/router';
import { promocodeService as service } from './service';

export const promocodeRouter = s.router(promocodeContract, {
  getAll: {
    handler: async ({ query }) => {
      const r = await service.getAll(query);
      return { status: 200, body: r };
    },
  },
  getOne: {
    handler: async ({ params }) => {
      const r = await service.getOne(params.id);
      return { status: 200, body: r };
    },
  },
  create: {
    handler: async ({ body }) => {
      const r = await service.create(body);
      return { status: 201, body: r };
    },
  },
});
