const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect();

function queryDB(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        })
    })
}

module.exports = {queryDB, connection};