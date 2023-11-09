var express = require('express');
var router = express.Router();
const db = require('../models/index')
const UserService = require('../services/UserService')
const users = new UserService(db)
/* GET users listing. */
router.get('/', async(req, res, next) => {
  try {
    let userResults = await users.get(1)
    return res.status(200).json({result:userResults})
  } catch (error) {
    return res.status(500).json({result:usersResult})
  }
});

module.exports = router;
