/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

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
    console.log('listening on 6001')
  })
})

app.get('/info', (req, res) => {
  res.sendFile(__dirname + '/public/info.html')
})

app.get('/insert', (req, res) => {
  res.sendFile(__dirname + '/public/insert.html')
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.get('/read', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {
      quotes: result
    })
  })
})



// start server on the specified port and binding host
//app.listen(appEnv.port, '0.0.0.0', function() {
// print a message when the server starts listening
// console.log("server starting on " + appEnv.url);
//});