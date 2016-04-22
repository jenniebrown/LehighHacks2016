// app/routes.js
var document = require('document');
var mysql = require('mysql');
module.exports = function(app, passport, con) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	app.get('/', function(req, res){
		res.render('landingpage.ejs', {"classes":["CSE241","CSE271","CSE261"]}); //index.ejs'); // load the index.ejs file
	});

	io.on('connection', function(socket){
	  socket.on('chat message', function(msg){
	    io.emit('chat message', msg);
	  });
	});
	
	/*app.get('/', function(req, res) {
		res.render('landingpage.ejs', {"classes":["CSE241","CSE271","CSE261"]}); //index.ejs'); // load the index.ejs file
	});*/

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		con.connect(function(err) {
			if (err) {
				console.log('Error connecting to database routes.js');
				return;
			} else {
				console.log('Connected to ClearDB');
			}
		});
		var columns = ['classID', 'sectionID'];
		var email = document.cookie;
		console.log(email);
		var courses = con.query('SELECT ?? FROM ?? WHERE email = ?', [columns, 'takes', email], function(err, rows, fields){
				if (err) {
				    console.log(err);
				    return;
				} else {
				    console.log(rows);
				}
			});
		res.render('landingpage.ejs', {"classes":["CSE241","CSE271","CSE261"]}); 
		console.log('in PROFILE SECTION. just rendered profile.ejs');
		con.end(function(err) {
			if (err) {
				console.log('Error disconnecting from DB');
				return;
			}
		});
	});


	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    console.log('after authentication');
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));
    console.log('finished google callback');

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
	        console.log('checking that user is authenticated still');
		return next();
	}

	// if they aren't redirect them to the home page
	res.redirect('/');
}
