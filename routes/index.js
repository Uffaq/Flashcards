"use strict";

var express = require('express');
var router = express.Router();

let database = require('../Database');
//Require Controller Functions
var index_controller = require('../controllers/index');
let path = require("path");
let session = require("express-session");
//Creates a session
router.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "SECRETSESSION",
    cookie: { maxAge: 60000 }
  })
);
let sess;
let set;
/* GET home page. */
router.get("/", function(req, res) {
  //Checks if already a logged session of user exists , else takes to login page
  if (sess) {
    //Directs to Main Bullseye Page
    res.redirect("/quizmain");
  } else {
    //res.render('index', { title: 'Express' });
    var successMsg = req.flash('success')[0];
    res.render('home/login', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
    //res.sendFile(path.join('..','/html/login.html'));
  }
});
// router.get('/',index_controller.home);
router.get('/login',function(req,res){
  
  if(sess){
    res.redirect("/quizmain");
  } else{
    var successMsg = req.flash('success')[0];
    res.render('home/login', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
  }
});
router.post("/loginaction", function(req, res) {
  let loginDetails = req.body; //req.body is a json object containing username and password

  //Checking existence of loginDetails in database
  database.login(loginDetails, function(err, validDetails) {
    //Condition for valid Login data
    if (validDetails) {
       sess = req.session;
       sess.userDetails = validDetails; 
       var name=sess.userDetails.rows[0].firstname;
       console.log(name);
       res.render('home/quizmain',{name:name});
      //  res.redirect("/quizmain");
     } else {
      //Asks to Login on failing condition above
      res.send(
        '<div align="center">Invalid Login , Please Re-Enter Details or Register a New Account</div>'
      );
    }
  });
});
router.get('/register', function(req, res) { 
 
    var successMsg = req.flash('success')[0];
    res.render('home/register', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
  
});

router.post("/registeraction", function(req, res) {
  let regDetails = req.body; //req.body is a json object containing username and password
  database.register(regDetails, function(decide) {
    //checks the value if username already exists
    if (decide == "success") {
      //Registration Successful!!
      res.redirect("/quizmain");
    } else {
      //if user already exists in database , asks to login
      res.send(
        '<div align="center">User already exists , Please <br><a href="/login">Click Here To Login</a></div>'
      );
    }
  });
});

router.post("/scoreupdate", function(req, res) {
  //Collecting name of user from session variable , and retrieving score from body
  let name = sess.userDetails.rows[0].firstname;
  console.log(name);
  //formatting score to number
  let score = req.body.score.split("/")[0];

  //Combining (name,score) ---->  [name,score] Array
  let scoreSet = [];
  scoreSet.push(name);
  scoreSet.push(score);

  //sedning to database
  database.scoreupdate(scoreSet);
  var successMsg = req.flash('success')[0];
  res.render('home/acknowledge', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
});

router.get('/scores',function(req,res){
 //Checks if already a logged session of user exists , else takes to login page
 if (sess) {
  var successMsg = req.flash('success')[0];
  res.render('home/scores', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
} else {
  res.send(
    '<div align="center">  Please Login to Play Quiz  <br><a href="/login">Login Here</a></div>'
  );
}
});
router.post("/scoreset", function(req, res) {
  //Code for retrieving score Details from DB and sending them in JSON type as response
  database.getScores(function(data) {
    res.json(data);
  });
});


router.get('/quizmain',index_controller.quizmain);
router.get('/level',index_controller.level);
router.get('/instructions',index_controller.instructions);
router.get('/scores',index_controller.scores);
router.post('/levelselect', function(req, res) {
  database.questionsFromDB(function(qaSet) {
    //assigning "qaSet" to global variable "set" to send json value of "set" variable in another GET Request (/jsonset)
    set = qaSet;
  });

  //Directing to Question-Answer Display page
  var successMsg = req.flash('success')[0];
  res.render('home/questionpage', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
});

router.post("/jsonset", function(req, res) {
  res.json(set);
});

// router.get('/jsonset', function(req, res, next) {
//    res.json(set);
//    });
router.get("/questionreview", function(req, res) {
  sess=req.session;
  //Checks if already a logged session of user exists , else takes to login page
  if (sess) {
    var successMsg = req.flash('success')[0];
  res.render('home/questionreview', { title: 'Language Learning Application - Home', pagename: 'home', successMsg: successMsg, noMessages: !successMsg });
  } else {
    res.send(
      '<div align="center">  Please Login to Play Quiz  <br><a href="/login">Login Here</a></div>'
    );
  }
});
router.get("/logout", function(req, res) {
  //destroys any session present
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    }
  });

  //redirects to login page
  res.redirect("/login");
  //removes any session value in this Variable
  sess = null;
});
  
module.exports=router;
