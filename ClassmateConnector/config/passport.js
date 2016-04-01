// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
//var Model = require('../models');
var Model = require('../models/user.js');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(email, done) {
        new Model.User({ email: email }).fetch().then(function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            
	    new Model.User({ 'googleid' : profile.id }).fetch().then(function(err, user) {
            
	        if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    //var newUser          = new Model.User({ email : profile.emails[0].value });
		    console.log(JSON.stringify(profile));
                    // set all of the relevant information
                    //newUser.googleid    = profile.id;
                    //newUser.googletoken = profile.token;
                    //newUser.googlename  = profile.displayName;
                    //newUser.googleemail = profile.emails[0].value; // pull the first email

                    // save the user
                    var newUser = new Model.User({ email : profile.emails[0].value });
		    newUser.save({ 
		     		   googleid : profile.id,
		    		   token : profile.token,
				   username : profile.displayName,
				   firstname : profile.name.givenName,
				   lastname : profile.name.familyName },
				   { method: 'insert'}).then(function(model) { return done(null, model); } );
		    //new Model.User({ 'googleid' : profile.id }).fetch().then(function(err, user) {
		    //    if (err)
		    //        return done(err);
		    //    return done(null, user);
		    //});
            }
        });

    });

}))
};
