var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
const sequelize = require('sequelize');
var session = require('express-session');// session
var passport = require('passport');
var pg = require('pg');
var flash = require('connect-flash');
const {check,validator} = require('express-validator');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var flashcardsRouter=require('./routes/flashcards');

const methodeOverride=require('method-override');




var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })


var app = express();

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

// const Sequelize = new sequelize('postgres://chcwsjyztzinsw:5b3c3ed64fd32369ac6776d2cdc7cdf92a64ba8f94dab955cb96c1906a4b71e5@ec2-174-129-231-100.compute-1.amazonaws.com:5432/dcb6hvosdu5j0:ssl=off');
// Sequelize
//   .authenticate()
//   .then(function(err) {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(function (err) {
//     console.log('Unable to connect to the database:', err);
//     require('./config/passport');
//   });

// const db = new sequelize('dcb6hvosdu5j0', 'chcwsjyztzinsw', '5b3c3ed64fd32369ac6776d2cdc7cdf92a64ba8f94dab955cb96c1906a4b71e5', {
//   host: 'ec2-174-129-231-100.compute-1.amazonaws.com',
//   dialect: 'postgres',
//   operatorAliases:false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
// });
// //Test DB
// db
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs',
helpers:{
  // Function to do basic mathematical operation in handlebar
math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue,
    }[operator];

}
}
}));
app.use(methodeOverride('_method'));
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
  secret: "myseacretkey",
  resave: false, 
  saveUninitialized: false,
  // store: new PgStore,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));



app.use(function(req, res, next){ // global variable to check if authenticated (in all views)
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session; // access session in views
  next(); // let request continue
});

// app.use('/category',categoryRouter);
app.use('/flashcards', flashcardsRouter);
app.use('/user', userRouter);
app.use('/',indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
