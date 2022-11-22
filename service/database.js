const { MongoClient } = require("mongodb");

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error("Database not configured. Set environment variables");
}

const uri = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(uri);

async function addScore(score) {
  const collection = client.db("simon").collection("scores");
  await collection.insertOne(score);
}

async function getHighScores() {
  const collection = client.db("simon").collection("scores");

  const query = {};
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = collection.find(query, options);
  return await cursor.toArray();
}

module.exports = { addScore, getHighScores };
