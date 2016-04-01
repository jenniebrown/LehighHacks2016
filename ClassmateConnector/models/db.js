var db = require('../config/database.js');
var config = {
    host: db.host,
    user: db.user,
    password: db.password,
    database: 'ad_d53a746137f39ff'
};

var knex = require('knex') ({
   client: 'mysql',
   connection: config
});

var Bookshelf = require('bookshelf')(knex);


module.exports.DB = Bookshelf;
