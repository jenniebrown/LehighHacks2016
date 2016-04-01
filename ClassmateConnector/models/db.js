var bookshelf = require('bookshelf');
var db = require('../config/database.js);
var config = db;

var DB = Bookshelf.initialize({
   client: 'mysql', 
   connection: config
});

module.exports.DB = DB;
