const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);


const options = {
  host: 'localhost',
  user: 'root',
  password: 'Cristi2003',
  database: 'express_db'
}
const db = mysql.createConnection(options);
var sessionStore = new MySQLStore(options);


  
module.exports.db = db;
module.exports.sessionStore = sessionStore;
