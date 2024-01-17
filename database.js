const mysql = require('mysql');
const util = require('util');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Admin123',
    database: 'testsubject',
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