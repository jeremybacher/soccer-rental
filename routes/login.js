var express = require('express');
var router = express.Router();
const dataOwners = require('../data/owners');
const dataCustomers = require('../data/customers');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

function generateAccessToken(response) {
  return jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

async function hash(password) {
  const salt = await bcrypt.genSalt()
  const hashed = await bcrypt.hash(password, salt)
  return hashed
}

async function compare(password, hashed) {
  const match = await bcrypt.compare(password, hashed)
  return match
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({"message": "token is required"})
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({"message": "invalid token"})
      req.user = user
      next()
  })
}

// POST Login
/*
{
  "email": "example@example.com",
  "password": "examplee",
  "owner": true
}
*/
router.post('/', (req, res) => {
  if (req.body.email && req.body.password) {
    let data = dataOwners
    if(!req.body.owner){
      data = dataCustomers
    }
    data.getByEmail(req.body.email)
      .then(async response => {
        if (response != null) {
          const match = await compare(req.body.password, response.password);
          if (match) {
            const token = generateAccessToken(response);
            res.json({ "token": token});
          } else {
            res.status(401).json({ "message": "invalid data" })
          }          
        } else {
          res.status(401).json({ "message": "invalid data" })
        }
      })
      .catch(err => {
        let message = "Something went wrong: " + err;
        res.status(500).json({"message": message})
      })
  } else {
    res.status(401).json({ "message": "invalid data" })
  }
});

/* module.exports = { hash, router }; */
module.exports = { router, authenticateToken, hash };