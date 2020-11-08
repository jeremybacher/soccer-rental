const connection = require('./connections');

async function insert(owner){
    owner._id = await connection.getNextSequenceValue("owners", "ownerId");
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .insertOne(owner);
    return owner;
}

async function update(owner){
    const connectionMongo = await connection.getConnection();
    const query = {_id: parseInt(owner._id)}
    let newvalues = {
        $set: {
            name: owner.name,
            lastname: owner.lastname,
            email: owner.email,
            phone: owner.phone
        }
    }
    if (owner.password) {
        newvalues.$set.password = owner.password
    }
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .updateOne(query, newvalues);
    return result;
}

async function getByEmail(email){
    const connectionMongo = await connection.getConnection();
    const owner = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .findOne({email: email});
    return owner;
}

module.exports = { insert, update, getByEmail }