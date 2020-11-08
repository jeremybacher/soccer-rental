const { MongoClient } = require('mongodb');

const uriMongo = 'mongodb+srv://'+ process.env.DB_USER +':' + process.env.DB_PASS + '@cluster0.css49.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority';

const client = new MongoClient(uriMongo, {useUnifiedTopology: true, useNewUrlParser:true})

async function getConnection(){
    return await client.connect().catch(err => console.log(err));
}

async function getNextSequenceValue(collectionName, sequenceName){
    const connectionMongo = await getConnection();
    const query = {_id: sequenceName}
     const newvalues = {
        $inc: {
            sequence_value: 1
        }
    }
    const sequenceDocument = await connectionMongo.db(process.env.DB_NAME)
                        .collection(collectionName)
                        .findOneAndUpdate(query, newvalues, {return_document: true});
    return sequenceDocument.value.sequence_value;
}

module.exports = { getConnection, getNextSequenceValue };