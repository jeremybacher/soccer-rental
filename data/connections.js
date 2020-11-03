require('dotenv').config()
//const mongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');

// TODO: Crear variables de entorno, sacar el harcodeo
const uriMongo = 'mongodb+srv://'+ process.env.DB_USER +':' + process.env.DB_PASS + '@cluster0.css49.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority';

const client = new MongoClient(uriMongo, {useUnifiedTopology: true, useNewUrlParser:true})

async function getConnection(){
    return await client.connect().catch(err => console.log(err));
}

module.exports = {getConnection};