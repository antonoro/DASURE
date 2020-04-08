const express = require('express');
const router = express.Router();
const db = require("../db/MongoUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* GET users listing. */
router.get('/', function(req, res, next) {
  db.getDocumentsPromise("application", "users")
  .then(docs => res.json(docs))
});

router.get('/:id', function(req, res, next) {
  db.findOnePromise("application", "users", req.params.id)
  .then(docs => res.json(docs))
});

// @route  POST /users
// @desc   Register user
// @access Public
router.post('/', function(req, res, next) {
  const {name, password, email} = req.body;
  res.clearCookie('x-access-token');
  bcrypt.genSalt(10)
  .then(salt => bcrypt.hash(password, salt))
  .then(encryptedPassword => db.createOneDocumentPromise("application", "users", {name: name, password: encryptedPassword, email: email}))
  .then(docs => {
    if (docs.result.ok == true && docs.ops[0])
    {
      console.log(docs.ops[0]._id);
      const payload = {
        user: {
            _id: docs.ops[0]._id,
            email: docs.ops[0].email,
            name: docs.ops[0].name
        },
    };
    console.log("created", process.env.JWT_SECRET);
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (error, token) => {
            if (error) throw error;
          res.setHeader('Cache-Control', 'private');
          try{
          res.cookie('x-access-token', token, {maxAge: 36000,
            httpOnly: false});
          }
          catch (error){
            console.log(error);
          }
          console.log("Set cookie");
          res.redirect("../");
        });
    }
    else
      res.status(401).json({error: "Error"})
  })
});

// @route  PUT /users/:id
// @desc   Update user
// @access Public
router.put('/:id', function(req, res, next) {
  const {name, password, email} = req.body;
  bcrypt.genSalt(10)
  .then(salt => bcrypt.hash(password, salt))
  .then(encryptedPassword => db.findAndUpdateOnePromise("application", "users", req.params.id, {name: name, password: encryptedPassword, email: email}))
  .then(docs => {
    console.log(docs);
    if (docs.ok == true)
      res.status(200).json({name: name, email: email, result: "ok"})
    else
      res.status(401).json({error: "Error"})
})});

// @route  DELETE /users/:id
// @desc   Delete user
// @access Public
router.delete('/:id', function(req, res, next) {
  db.findAndDeleteOnePromise("application", "users", req.params.id)
  .then(docs => res.json(docs))
});

module.exports = router;