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
                date: req.body.date
            }
            await data.addReservation(req.body.court, reservation)
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

module.exports = router;