var pg = require('pg');
var flash = require('connect-flash');
var pg = require('pg');


var connectionString ='postgres://chcwsjyztzinsw:5b3c3ed64fd32369ac6776d2cdc7cdf92a64ba8f94dab955cb96c1906a4b71e5@ec2-174-129-231-100.compute-1.amazonaws.com:5432/dcb6hvosdu5j0?ssl=true';
var client=new pg.Client(connectionString);
client.connect(function(err) {
  if(err) {
    console.log('Unable to connect to postgres instance. Error: ', err);
  }
  else{
    console.log("Connected to DB")
  }
});


exports.beginner=(req,res,next)=>{
    client.query('SELECT * FROM  public."flashcard"', function(err, result) {
        if(err) {
        return console.error('error running query', err);
      } 
     res.render('flashcards/beginner',{flashcard:result.rows});
    });
  };