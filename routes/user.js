var express = require('express');
var router =  express.Router();
var csrf = require('csurf');
var pg = require('pg');
var moment=require('moment');
// var passport = require('../config/passport')(passport);

var user_controller = require('../controllers/user');

var csfrProtection = csrf();
router.use(csfrProtection);

var connectionString ='postgres://chcwsjyztzinsw:5b3c3ed64fd32369ac6776d2cdc7cdf92a64ba8f94dab955cb96c1906a4b71e5@ec2-174-129-231-100.compute-1.amazonaws.com:5432/dcb6hvosdu5j0';
var client=new pg.Client(connectionString);
client.connect(function(err) {
  if(err) {
      err => console.log('Unable to connect to postgres instance. Error: ', err);
  }
  else{
      res => console.log("Connected to DB")
  }
});

router.get('/signup', function(req,res,next) {
    res.render('user/signup',{csrfToken: req.csrfToken()});
  });
router.get('/signin', function(req,res,next) {
  res.render('user/signin',{csrfToken: req.csrfToken()});
});
router.get('/pproducts',user_controller.pproducts);
router.post('/signin',user_controller.signin);
router.post('/signup',user_controller.signup);

  
module.exports = router;