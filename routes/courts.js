const express = require('express');
const router = express.Router();
const data = require('../data/courts');
const { authenticateToken } = require('./login');

// POST Court
/*
{
    "owner": 1,
    "name": "Name 1"
    "players": 11,
    "hourprice": 100,
    "address": "Gallo 29",
    "neighborhood": "Almagro"
    "description": "Dome description.",
    "calendar": {
        "monday": {
            "form": 8,
            "to": 20
        },
        "wednesday": {
            "form": 8,
            "to": 20
        },
        "friday": {
            "form": 8,
            "to": 20
        }
    }
}
*/
router.post('/', authenticateToken, async (req, res) =>{    
    if (req.user.type == 'owner') {
        if (req.body.name && req.body.players && req.body.hourprice && req.body.address && req.body.neighborhood && req.body.description && req.body.calendar) {   
            let court = {
                owner: req.user._id,
                name: req.body.name,
                players: req.body.players,
                hourprice: req.body.hourprice,
                address: req.body.address,
                neighborhood: req.body.neighborhood,
                description: req.body.description,
                calendar: req.body.calendar,
                reservations: []
            }
            await data.insert(court)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    res.status(500).send({"description": "Something went wrong, err: " + err});
                })
        } else {
            res.status(400).send({"description": "Some fields are lost, you must send players, hourprice, address, description and calendar."});
        }
    } else {
        res.status(403).send({"description": "You can not create court"});
    }    
});

module.exports = router;