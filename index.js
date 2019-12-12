// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const qs2m = require('qs-to-mongo');
const cors = require('cors');
const MONGO = require('mongodb').MongoClient;
const url =
  'mongodb://admin:admin1212@ds025232.mlab.com:25232/num?connectTimeoutMS=10000&authSource=num&authMechanism=SCRAM-SHA-1&3t.uriVersion=3&3t.databases=num';

fastify.get('/', async (req, res) => {
  return { hello: 'world' };
});

fastify.get('/api/v1/:collection', async (req, res) => {
  const qs = qs2m(req.query);
  const client = await MONGO.connect(url);
  const MyCollection = client.db('num').collection(req.params.collection);
  const result = await MyCollection.find(qs.criteria, qs.options).toArray();
  if (result[0].data) {
    const unique = removeDuplicates(result[0].data, req.query.fields.replace('data.', ''));
    result[0].data = unique;
  }

  res.send(result);
});

fastify.get('/api/v1/:collection/search', async (req, res) => {
  const client = await MONGO.connect(url);
  const MyCollection = client.db('num').collection(req.params.collection);
  let result = {};
  if (!isNaN(req.query.val1)) {
    req.query.val1 = parseInt(req.query.val1);
  }
  if (req.query.col1 && req.query.val1 && !req.query.range) {
    result = await MyCollection.aggregate(
      {
        $project: {
          data: {
            $filter: {
              input: '$data',
              as: 'item',
              cond: { $eq: ['$$item.' + req.query.col1, req.query.val1] }
            }
          }
        }
      },
      { cursor: {} }
    ).toArray();
  } else if (req.query.col1 && req.query.val1 && req.query.range) {
    console.log('range..');
    result = await MyCollection.aggregate(
      [
        {
          $project: {
            data: {
              $filter: {
                input: '$data',
                as: 'item',
                cond: {
                  $and: [
                    { $lte: ['$$item.inicial', parseInt(req.query.range)] },
                    { $gte: ['$$item.final', parseInt(req.query.range)] }
                  ]
                }
              }
            }
          }
        }
      ],
      { cursor: {} }
    ).toArray();
    // console.log(result[0].data);
    result = result[0].data.filter(el => el[req.query.col1] === req.query.val1);
    console.log(result);
  } else {
    result = await MyCollection.aggregate(
      {
        $project: {
          data: {
            $filter: {
              input: '$data',
              as: 'item',
              cond: {
                $and: [
                  { $eq: ['$$item.' + req.query.col1, req.query.val1] },
                  { $eq: ['$$item.' + req.query.col2, req.query.val2] }
                ]
              }
            }
          }
        }
      },
      { cursor: {} }
    ).toArray();
  }
  if (result.length > 1 && result[0].data[0]) removeNull(result[0].data[0]);
  res.send(result);
});

fastify.use(cors());
fastify.options('*', (request, reply) => {
  reply.send();
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
