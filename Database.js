"use  strict";

let pg = require("pg");
let moment=require('moment');
let Database={};


Database.configure = function() {

var connectionString ='postgres://chcwsjyztzinsw:5b3c3ed64fd32369ac6776d2cdc7cdf92a64ba8f94dab955cb96c1906a4b71e5@ec2-174-129-231-100.compute-1.amazonaws.com:5432/dcb6hvosdu5j0?ssl=true';
var client=new pg.Client(connectionString);
client.connect(function(err) {
  if(err) {
    console.log('Unable to connect to postgres instance. Error: ', err);
  }
  else{
    console.log("Connected to DB");
  }
});
    return client;
};



Database.login=function(loginDetails, done) {
  //Calling Configuration
  let client = this.configure();

  //Retrieving login details from database
  console.log(loginDetails.un);
  console.log(loginDetails.pw);

  let query ="select * from public.user where username=$1 and password=$2";
  client.query(query,[loginDetails.un,loginDetails.pw],function(err, rows) {
      if (err) throw err;
      client.end();  
       //Checks if any usernames are returned with "loginDetails.un" name && "loginDetails.pw" password
    if (rows.rowCount==1) {
      console.log("rows");
      done(err, rows);
    } else {
      console.log("hiii");
      done(err, null);
    }
   
  });
};

Database.scoreupdate = function(scoreSet) {
  let client = this.configure();
  client.query("select firstname,score from public.userscores where firstname=$1",
    [scoreSet[0]],
    function(err, rows) {
      if (err) throw err;
      //console.log(scoreSet[1]);
      console.log(rows);
      if (rows.rows[0] && rows.rows[0].score < scoreSet[1]) {
        console.log("rows info");
       client.query("update public.userscores set score=$1 where firstname=$2",
          [scoreSet[1], scoreSet[0]],
          function() {
            client.end();
          }
        );
      } else if (rows.rowCount==0) {
        console.log('here');
        client.query(
          "insert into public.userscores (firstname,noofquestions,score) values($1,$2,$3)",
          [scoreSet[0], 10, scoreSet[1]],
          function() {
           client.end();
          }
        );
      }
      return;
    }
  );
};

Database.register = function(regDetails, done) {
  var score=0;
  var exp=0;
  //Calling Configuration
  let client = this.configure();
  console.log(regDetails.un);
  //checks if user with username already exists
  let query ="select * from public.user where username=$1"
  client.query(query,[regDetails.un],function(err, rows) {
    if (err) throw err;
     
      //if not exists enter details into database
      if (rows.rowCount!=1) {
        //Entering Details into Database
        console.log(rows.rowCount!=1);
        let query = "insert into public.user (firstname,lastname,username,email,password,created_on,score,exp) values($1,$2,$3,$4,$5,$6,$7,$8)";
        client.query(
          query,
          [regDetails.first, regDetails.last, regDetails.un,regDetails.em,regDetails.pw,moment(new Date()),score,exp],
          function() {
           client.end();
          }
        );
        done("success");
      } else {
        //callback return call
        done(null);
      }
    }
  );
};

Database.questionsFromDB = function(done) {
  let  client = this.configure();
  client.query(
      "select question,option1,option2,option3,option4 from questions ORDER BY RANDOM() LIMIT 10",
      function(err, rows) {
        if (err) throw err;
        client.end();
        console.log(rows.rows);
       let qaSet = { quizlist:rows.rows};
        done(qaSet);
      }
    );
  };

  Database.getScores = function(done) {
    //Calling Configuration
    let client=this.configure();
    client.query("SELECT firstname,score from public.userscores order by score desc",
      function(err, rows) {
        if (err) throw err;
        client.end();
        done(rows.rows);
        console.log(rows.rows);
      }
    );
  };

  module.exports = Database;
