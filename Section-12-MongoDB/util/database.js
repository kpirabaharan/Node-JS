const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoConnect = async (cb) => {
  const uri =
    'mongodb+srv://kpirabaharan:7tTH4fUSTDZ4fcz@node-nosql.b4w22at.mongodb.net/?retryWrites=true&w=majority';

  const client = new MongoClient(uri);

  try {
    const cl = await client.connect();
    cb(cl);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
};

module.exports = mongoConnect;
