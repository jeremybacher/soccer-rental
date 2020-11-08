const connection = require('./connections');

async function insert(court){
    court._id = await connection.getNextSequenceValue("courts", "courtId");
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .insertOne(court);
    return result.ops[0];
}

async function addReservation(courtId, reservation){
    const connectionMongo = await connection.getConnection();
    const query = {_id: parseInt(courtId)}
    let court = await getById(courtId)
    court.reservations.push(reservation) 
    let newvalues = {
        $set: {
            reservations: court.reservations
        }
    }
    await connectionMongo.db(process.env.DB_NAME)
                    .collection('courts')
                    .updateOne(query, newvalues);
    return court;
}

async function getById(id){
    const connectionMongo = await connection.getConnection();
    const court = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .findOne({_id: id});
    return court;
}

module.exports = { insert, addReservation }