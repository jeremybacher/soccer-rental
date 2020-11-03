const connection = require('./connections');
require('dotenv').config()

async function getByUsername(username){
    const connectionMongo = await connection.getConnection();
    const owner = await connectionMongo.db('soccer-rental')
                        .collection('owners')
                        .findOne({username: username});
    return owner;
}

async function insertOwner(owner){
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db('soccer-rental')
                        .collection('owners')
                        .insertOne(owner);
    return result;
}

async function updateOwner(owner){
    const connectionMongo = await connection.getConnection();
    const query = {_id: parseInt(owner._id)}
    const newvalues = {
        $set: {
            username: owner.username
        }
    }
    console.log(newvalues)
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .updateOne(query, newvalues);
    return result;
}

async function deleteOwner(id){
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db(process.env.DB_NAME)
                    .collection('owners')
                    .deleteOne({_id: parseInt(id)});
    return result;
}

module.exports = { insertOwner, getByUsername, deleteOwner, updateOwner }