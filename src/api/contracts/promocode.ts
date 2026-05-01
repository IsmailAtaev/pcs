import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { promocodeSchema as schema } from '../schema';

const c = initContract();

export const promocodeContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: schema.getAll,
      responses: {
        200: schema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '',
      body: schema.create,
      responses: {
        201: schema.getOneRes,
      },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: schema.paramsId,
      responses: {
        200: schema.getOneRes,
        404: z.null(),
      },
    },
  },
  { pathPrefix: '/api/promocodes' },
);
