const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cristi2003',
    database: 'express_db'
  })


  
exports.db = db;
  