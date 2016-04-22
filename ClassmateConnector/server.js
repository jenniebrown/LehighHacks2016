// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var mysql = require('mysql');
var db = require('./config/database.js');
var con = mysql.createConnection(db);
con.connect(function(err) {
    if(err) {
        console.log('Error connecting to database');
        return;
    }
    console.log('Connected to ClearDB');
});

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package.cfenv
var cfenv	= require('cfenv');
//create a new express server
var app      = express();


require('./config/passport')(passport,app); // pass passport for configuration

// set up our express application
//app.use(express.static(__dirname + '/public'));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended : true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
                  resave: true,
                  saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var appEnv = cfenv.getAppEnv();
// routes ======================================================================
require('./app/routes.js')(app, passport, con); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
