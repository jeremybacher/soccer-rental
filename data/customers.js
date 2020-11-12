const connection = require('./connections');

async function insert(customer){
    const connectionMongo = await connection.getConnection();
    const customerValidate = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .findOne({email: customer.email});
    if (customerValidate != null) {
        return null
    }
    customer._id = await connection.getNextSequenceValue("customers", "customerId");
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .insertOne(customer);
    return result.ops[0];
}

async function update(customer){
    const connectionMongo = await connection.getConnection();

    const customerValidate = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .findOne({email: customer.email});
    if (customerValidate != null) {
        if (customerValidate._id != customer._id) {
            return null
        }
    }

    const query = {_id: parseInt(customer._id)}
    let newvalues = {
        $set: {
            name: customer.name,
            lastname: customer.lastname,
            email: customer.email,
            phone: customer.phone
        }
    }
    if (customer.password) {
        newvalues.$set.password = customer.password
    }
    await connectionMongo.db(process.env.DB_NAME)
                    .collection('customers')
                    .updateOne(query, newvalues);
    return customer;
}

async function getByEmail(email){
    const connectionMongo = await connection.getConnection();
    const customer = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .findOne({email: email});
    return customer;
}

async function get(id){
    const connectionMongo = await connection.getConnection();
    const customer = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .findOne({_id: id});
    return customer;
}

module.exports = { insert, update, getByEmail, get }