var moment=require('moment');
var pg = require('pg');
var flash = require('connect-flash');

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

exports.pproducts=(req,res,next)=>{
    client.query('SELECT * FROM  public."user"', function(err, result) {
      if(err) {
      return console.error('error running query', err);
    } 
   res.render('user/pproducts',{user:result.rows});
  });
};

exports.signin=(req,res,next)=>{
  console.log('Signin function starts');
  const{email,password}=req.body
  console.log(req.body.email);
  console.log(req.body.password);
  client.query('SELECT * from public."user" where email=$1 and password=$2',[email,password],function(error,result){
    if(error){
      return console.error('error running query', error);
      }
    // if(!result){
    //   return console.error('User not found.')
    // }
  //   if (!result.fields(password)){
  //     return done(null, false, {message: 'Username and Password do not match.'});
  // }
});
  res.render('user/profile');
};


exports.signup =(req,res,done,next) => {
  console.log('Create User');
  const{email,password}=req.body
  console.log(req.body.email);
  console.log(req.body.password);
  var mp=0;
  var exp=0;
  client.query('SELECT * from public."user" where "email"= $1',[email],function(error,result){
    if(error) {
      return console.error('error running query', error);
    }
    if(result){
      return done(null, false, {message: 'email already exists'});
    }
  })
  client.query('INSERT INTO public."user"("email","password","created_on","mp","exp")VALUES($1,$2,$3,$4,$5)',[email,password,moment(new Date()),mp,exp] ,(error, results) => {
    if(error) {
      return console.error('error running query', error);
    } 
  });
  res.render('user/profile');
  };

