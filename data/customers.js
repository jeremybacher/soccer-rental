const connection = require('./connections');

async function insert(customer){
    customer._id = await connection.getNextSequenceValue("customers", "customerId");
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .insertOne(customer);
    return customer;
}

async function update(customer){
    const connectionMongo = await connection.getConnection();
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
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .updateOne(query, newvalues);
    return result;
}

async function getByEmail(email){
    const connectionMongo = await connection.getConnection();
    const customer = await connectionMongo.db(process.env.DB_NAME)
                        .collection('customers')
                        .findOne({email: email});
    return customer;
}

module.exports = { insert, update, getByEmail }