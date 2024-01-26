require('dotenv').config();
const mysql = require('mysql');
const util = require('util');


var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('dataBase connected successfully :)');
    }
});

connection.query = util.promisify(connection.query);

module.exports = connection;