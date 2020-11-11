const express = require('express');
const router = express.Router();
const data = require('../data/courts');
const { authenticateToken } = require('./login');

// POST Court
/*
{
    "court": 1,
    "date": 1604867001067,
}
*/
router.post('/', authenticateToken, async (req, res) =>{    
    if (req.user.type == 'customer') {
        if (req.body.court && req.body.date) {   
            let reservation = {
                customer: req.user._id,
                date: parseInt(req.body.date)
            }
            await data.addReservation(parseInt(req.body.court), reservation)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    res.status(500).send({"description": "Something went wrong, err: " + err});
                })
        } else {
            res.status(400).send({"description": "Some fields are lost, you must send court, date."});
        }
    } else {
        res.status(403).send({"description": "You can not create reservation"});
    }    
});

// GET Reservations /customer
router.get('/customer', authenticateToken, async (req, res) => {
    if (req.user.type == 'customer') {
        await data.getReservationsByCustomer(parseInt(req.user._id))
            .then((result) => {
                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.status(404).send({"description": "no reservations were"});
                }
            })
            .catch((err) => {
                res.status(500).send({"description": "something went wrong, err: " + err});
            })
    } else {
        res.status(403).send({"description": "you must be customer"});
    }   
});

module.exports = router;