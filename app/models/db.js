const mysql = require("mysql2");
const dbConfig = require("../config/db.config");

require("dotenv").config();
const connection = mysql.createConnection(process.env.DATABASE_URL);

// const connection = mysql.createConnection({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB,
//     PORT: dbConfig.PORT
// });

connection.connect(error => {
    if (error) {
        console.log("MySQL connection: " + error);
    } else {
        console.log("Successfully connected to the database.");
    }
});

module.exports = connection;