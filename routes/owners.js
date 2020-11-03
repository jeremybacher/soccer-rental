const express = require('express');
const router = express.Router();
const dataOwners = require('../data/owners');
const { hash, authenticateToken } = require('./login');

// post user
router.post('/', async (req, res) => {
    const hashedPassword = await hash(req.body.password)
    const owner = {
      username: req.body.username,
      password: hashedPassword
    };
    try{
      const result = await dataOwners.insertOwner(owner);
      res.json(result);
    }
    catch (error) {
      res.status(500).send(error);
    }
});

// Modificacion de inventor
router.put('/:id', authenticateToken, async (req, res) =>{
    const owner = req.body;
    console.log(req.params.id)
    try {
        owner._id = req.params.id;
      const result = await dataOwners.updateOwner(owner);
      res.json(result);
      
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Eliminacion de owner
  router.delete('/:id', authenticateToken, async (req, res)=>{
    try {
      const result = await dataOwners.deleteOwner(req.params.id);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;
