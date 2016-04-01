// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1609927332562840', // your App ID
        'clientSecret'  : '7853a25e8731343698dc625f2516cc14', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'googleAuth' : {
        'clientID'      : '782138728869-qrspu2i1f6nog5kptv964v0ouobl9ktv.apps.googleusercontent.com',
        'clientSecret'  : 'ujBv3k4oUbUeTfhssut7Das-',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
