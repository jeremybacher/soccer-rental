const express = require('express');
const router = express.Router();
const data = require('../data/owners');
const { hash, authenticateToken } = require('./login');

// POST Owner
/*
{
  "name": "Example",
  "lastname": "Example",
  "email": "example@example.com",
  "password": "examplee",
  "phone": "1122334455"
}
*/
router.post('/', async (req, res) => {
    if (req.body.name && req.body.lastname && req.body.email && req.body.password && req.body.phone) {
      if (validateOwner(req.body.name, req.body.lastname, req.body.email, req.body.phone, req.body.password)) {
        const hashedPassword = await hash(req.body.password)
        const owner = {
          name: req.body.name,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hashedPassword,
          phone: req.body.phone
        }
        await data.insert(owner)
          .then((result) => {
            if (result != null) {
              res.json(result);
            } else {
              res.status(400).send({"error": "pick another email, selected is used"})
            }  
          })
          .catch((err) => {
            res.status(500).send({"description": "something went wrong, err: " + err});
          })
      } else {
        res.status(400).send({"error": "fields are invalids"})
      }
    } else {
      res.status(400).send({"description": "some fields are lost, you must send name, lastname, email, password and phone."});
    }    
});

// UPDATE Owner
/*
{
  "name": "Example",
  "lastname": "Example",
  "email": "example@example.com",
  "password": "examples",
  "phone": "1122334455"
}
*/
router.put('/:id', authenticateToken, async (req, res) =>{    
  if (req.body.name && req.body.lastname && req.body.email && req.body.phone) {   
    // Ask if user is able to modify
    if (req.user._id == parseInt(req.params.id)) {
      let validFileds = validateOwner(req.body.name, req.body.lastname, req.body.email, req.body.phone)
      if (req.body.password) {
        validFileds = validateOwner(req.body.name, req.body.lastname, req.body.email, req.body.phone, req.body.password)
      }
      if (validFileds) {
        let owner = {
          _id: req.user._id,
          name: req.body.name,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone
        }
        if (req.body.password) {
          const hashedPassword = await hash(req.body.password)
          owner.password = hashedPassword
        }
        await data.update(owner)
          .then((result) => {
            if (result != null) {
              res.json(result);
            } else {
              res.status(400).send({"error": "pick another email, selected is used"})
            }  
          })
          .catch((err) => {
            res.status(500).send({"description": "something went wrong, err: " + err});
          })
      } else {
        res.status(400).send({"error": "fields are invalids"})
      }
    } else {
      res.status(403).send({"description": "you can not modify this user"});
    }
  } else {
    res.status(400).send({"description": "some fields are lost, you must send name, lastname, email, password and phone."});
  }
});

// Validate Owner
function validateOwner(name, lastname, email, phone, password = "optional") {
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const phoneRegexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  let valid = true
  if (name.length < 5 || name.length > 15) {
    valid = false
  }
  if (lastname.length < 5 || lastname.length > 15) {
    valid = false
  }
  if (!emailRegexp.test(email)) {
    valid = false
  }
  if (password.length < 8 || password.length > 15) {
    valid = false
  }
  if (!phoneRegexp.test(phone)) {
    valid = false
  }
  return valid
}

module.exports = router;
