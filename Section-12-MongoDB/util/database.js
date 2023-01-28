const { MongoClient, ServerApiVersion } = require('mongodb');

let _db;

const mongoConnect = async cb => {
  const uri =
    'mongodb://localhost:27017/shop';

  const client = new MongoClient(uri);

  try {
    const cl = await client.connect();
    _db = cl.db();
    cb(cl);
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    // await client.close();
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database Found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
