const connection = require('./connections');

async function insert(owner){
    const connectionMongo = await connection.getConnection();
    const ownerValidate = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .findOne({email: owner.email});
    if (ownerValidate != null) {
        return null
    }
    owner._id = await connection.getNextSequenceValue("owners", "ownerId");
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .insertOne(owner);
    return result.ops[0];
}

async function update(owner){
    const connectionMongo = await connection.getConnection();

    const ownerValidate = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .findOne({email: owner.email});
    if (ownerValidate != null) {
        if (ownerValidate._id != owner._id) {
            return null
        }
    }

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
    await connectionMongo.db(process.env.DB_NAME)
                    .collection('owners')
                    .updateOne(query, newvalues);
    return owner;
}

async function getByEmail(email){
    const connectionMongo = await connection.getConnection();
    const owner = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .findOne({email: email});
    return owner;
}

async function get(id){
    const connectionMongo = await connection.getConnection();
    const owner = await connectionMongo.db(process.env.DB_NAME)
                        .collection('owners')
                        .findOne({_id: id});
    return owner;
}

module.exports = { insert, update, getByEmail, get }