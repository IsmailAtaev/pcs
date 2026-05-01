import { initContract } from '@ts-rest/core';
import { activationSchema as schema } from '../schema/activation';

const c = initContract();

export const activationContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/:id/activations',
      pathParams: schema.paramsId,
      responses: {
        200: schema.getActivationsRes,
      },
    },
    activate: {
      method: 'POST',
      path: '/:id/activate',
      pathParams: schema.paramsId,
      body: schema.activate,
      responses: {
        200: schema.activateRes,
      },
    },
  },
  { pathPrefix: '/api/promocodes' },
);
