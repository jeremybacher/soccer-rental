const connection = require('./connections');

async function insert(court){
    court._id = await connection.getNextSequenceValue("courts", "courtId");
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .insertOne(court);
    return result.ops[0];
}

async function list(ownerId){    
    const connectionMongo = await connection.getConnection();
    const query = {
        owner: ownerId,
    }
    const courts = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .find(query).toArray();
    return courts;
}

async function update(ownerId, courtId, court) {
    const connectionMongo = await connection.getConnection();
    const courtValidate = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .findOne({_id: courtId, owner: ownerId});
    if (courtValidate == null) {
        return null
    }
    const newvalues = {
        $set: {
            name: court.name,
            players: court.players,
            hourprice: court.hourprice,
            address: court.address,
            neighborhood: court.neighborhood,
            description: court.description,
            services: court.services,
            calendar: court.calendar
        }
    }
    const result = await connectionMongo.db(process.env.DB_NAME)
                    .collection('courts')
                    .updateOne({_id: courtId, owner: ownerId}, newvalues);
    return result;
}

async function deleteCourt(courtId, ownerId) {
    const connectionMongo = await connection.getConnection();
    const result = await connectionMongo.db(process.env.DB_NAME)
                    .collection('courts')
                    .deleteOne({_id: courtId, owner: ownerId});
    return result;
}

async function listByFilters(neighborhood, date, players){
    const timestamp = new Date(date * 1000)
    const day = timestamp.toLocaleString('en-US', { weekday:'long', timeZone: 'UTC' }).toLowerCase()
    const time = timestamp.getUTCHours()
    const filterFrom = "calendar." + day.toString() + ".from"
    const filterTo = "calendar." + day.toString() + ".to"
    const query = {
        neighborhood: neighborhood,
        players: players
    }
    query[filterFrom] = { $lte: time }
    query[filterTo] = { $gte: time }
    const connectionMongo = await connection.getConnection();
    const courts = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .find(query).toArray();
    console.log(query)
    const courtsAvailables = courts.filter(court => {
        const reservations = court.reservations.filter(reservation => reservation.date == date)
        if (!reservations.length) {
            return court
        }
    })
    return courtsAvailables;
}

async function addReservation(courtId, reservation){
    const connectionMongo = await connection.getConnection();
    const queryValidateReservation = {
        _id: courtId,
        reservations: {
            $elemMatch: {
                date: reservation.date
            }
        }
    }
    const courtValidate = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .findOne(queryValidateReservation);
    if (courtValidate != null) {
        return null
    }
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

async function getReservationsByCustomer(customerId) {
    const query = {
        reservations: {
            $elemMatch: {
                customer: customerId
            }
        }
    }
    const connectionMongo = await connection.getConnection();
    const courts = await connectionMongo.db(process.env.DB_NAME)
                        .collection('courts')
                        .find(query).toArray();
    return courts;
}

module.exports = { insert, addReservation, listByFilters, list, getById, getReservationsByCustomer, update, deleteCourt }