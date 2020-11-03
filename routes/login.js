var express = require('express');
var router = express.Router();
const dataOwners = require('../data/owners');
const dataCustomers = require('../data/customers');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const ACCESS_TOKEN_SECRET = 'e9b1bc2db3a04a7d84a1cd148dcb4256c0da873c998dc3c0f37e3232f831b9d7c0fd9d09d1bfd3a3c9d6fe948bf499f9d445896ed603c5223d646e43277e7ca5';

function generateAccessToken(username) {
  return jwt.sign(username, ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
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
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({"message": "invalid token"})
      req.user = user
      next()
  })
}

/* POST login. */
router.post('/', (req, res) => {
    if (req.body.username && req.body.password) {
      let data = dataCustomers
      if(!req.body.customer){
        data = dataOwners
      }
      data.getByUsername(req.body.username)
        .then(async response => {
          if (response != null) {
            const match = await compare(req.body.password, response.password);
            if (match) {
              const token = generateAccessToken({ username: req.body.username });
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