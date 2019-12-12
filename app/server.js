import cors from 'cors';
import { routes } from './routes';
// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
});

fastify.use(cors())
fastify.options('*', (request, reply) => {
  reply.send();
});

routes.forEach((route, index) => {
  fastify.route(route);
});
// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
