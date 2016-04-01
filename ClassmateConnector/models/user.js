// load the things we need

var DB = require('./db').DB;

var User = DB.Model.extend({
  tableName: 'users',
  idAttribute: 'email'
});

// create the model for users and expose it to our app
module.exports = {
  User: User
};
