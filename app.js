/*eslint-env node*/
// This application uses express as its web server
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/pages'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


// app stuff
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
  extended: true
}))
var db;
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://root:toor@ds235328.mlab.com:35328/nodejs-db', (err, client) => {
  if (err) return console.log(err)
  db = client.db('nodejs-db') // whatever your database name is
  app.listen(appEnv.port, '0.0.0.0', () => {
    console.log('///// shit happens on port 6001 /////')
  })
})

app.post('/workout', (req, res) => {
  db.collection('workout').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('easy man... its on the db cloud now!')
    res.redirect('/read')
  })
})

app.get('/read', (req, res) => {
  db.collection('workout').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('pages/read.ejs', {
      workout: result
    })
  })
})


///////login/////
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//connect to MongoDB
mongoose.connect('mongodb://root:toor@ds235328.mlab.com:35328/nodejs-db');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


// serve static files from template
//app.use(express.static(__dirname + '/pages/index'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Here is a 404 error. WTF is going on?');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

