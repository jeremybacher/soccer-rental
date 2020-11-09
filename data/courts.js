const connection = require('./connections');

async function insert(court){
    court._id = await connection.getNextSequenceValue("courts", "courtId");
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .insertOne(court);
    return result.ops[0];
}

async function listByFilters(neighborhood, date, players){
    const timestamp = (new Date(date))
    const day = timestamp.toLocaleString('en-us', { weekday:'long' }).toLowerCase()
    const time = timestamp.getHours()
    const filterFrom = "calendar." + day.toString() + ".from"
    const filterTo = "calendar." + day.toString() + ".to"
    const query = {
        neighborhood: neighborhood,
        players: players
    }
    query[filterFrom] = { $lte: time }
    query[filterTo] = { $gte: time }
    const connectionMongo = await connection.getConnection();
    const owner = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .find(query).toArray();
    return owner;
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

module.exports = { insert, addReservation, listByFilters }