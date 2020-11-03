const connection = require('./connections');

async function getByUsername(username){
    const connectionMongo = await connection.getConnection();
    const customer = await connectionMongo.db('soccer-rental')
                        .collection('customers')
                        .findOne({username: username});
    return customer;
}

async function post(customer){
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db('soccer-rental')
                        .collection('customers')
                        .insertOne(customer);
    return result;
}

module.exports = { post, getByUsername }