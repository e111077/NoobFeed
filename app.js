var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');
var cheerio = require('cheerio');

// Schemas
var article = require('./models/article.js');

// Mongo
var connection_string = 'mongodb://127.0.0.1/epip';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/shiftshark'; // CHANGE LATER!
}

mongoose.connect(connection_string);

var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function callback () {
  app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);
});


// Ronfig
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// Routing
app.use('/', require('./routes/routes'));
app.use('/articles', require('./routes/articles'));
 
// Error handling
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(3000);
console.log("App listening on port 3000");