const { MongoClient } = require('mongodb');


// Connection URL
const url = process.env.dburl || 'mongodb+srv://TaskManager:taks2011@cluster0.dxoxr.mongodb.net/test?authSource=admin&replicaSet=atlas-82j5fk-shard-0&readPreference=primary&ssl=true';
const client = new MongoClient(url);

// Database Name
const dbName =  process.env.dbname ||'MyApp';

let Db;
async function connect() {
  // Use connect method to connect to the server
 let con=await client.connect();
 Db=con.db(dbName)

 console.log(`connected to Db:${Db.databaseName}.`)
  return Db;
}
// client.db().collection('collection')
function getDb()
{
  return Db;
}



// async function find()
// {
//   let data=await Db.collection('Logs').find().toArray();
//   return data;
// }

// find();
module.exports={connect,getDb}