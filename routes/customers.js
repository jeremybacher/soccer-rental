const express = require('express');
const router = express.Router();
const dataCustomers = require('../data/customers');
const { hash } = require('./login');

// post user
router.post('/', async (req, res) => {
    const hashedPassword = await hash(req.body.password)
    const customer = {
      username: req.body.username,
      password: hashedPassword
    };
    try{
      const result = await dataCustomers.post(customer);
      res.json(result);
    }
    catch (error) {
      res.status(500).send(error);
    }
});

module.exports = router;