import { search, create, detail } from '../search';

export const routes = [
  {
    method: 'GET',
    url: '/api/v1/health',
    handler: async (req, res) => {
      return { hello: 'world' };
    }
  },
  {
    method: 'GET',
    url: '/api/v1/:collection',
    handler: detail
  },
  {
    method: 'GET',
    url: '/api/v1/:collection/search',
    handler: search
  },
  {
    method: 'POST',
    url: '/api/v1/:collection/create',
    handler: create
  }
];
