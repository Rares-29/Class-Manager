const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const database = require("./database.js");
const db = database.db;

 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register", {show: false});
})

app.post("/register", (req, res) => {
    /// Register
    const username = req.body.username;
    const password = req.body.password;
    const c_password = req.body.c_password;
    const email = req.body.email;
    const checkbox = req.body.checkbox;
    let teacher = false;
    if (checkbox === "on") teacher = true;
    if (password.length < 8) res.render("register", {error: "Password length must be > 8", show: true});
    if (c_password !== password) res.render("register", {error: "Passwords doesn't match", show: true});
    const find = "SELECT * FROM users WHERE username = ?"
    const sql = "INSERT INTO users VALUES(UUID(), ?, ?,?, ?)";
    const values = [username,password, email, teacher];
    db.query(find, username, function(err, results, fields) {
        if (err) throw err;
        else 
            if (results.length === 0) 
            {   /// Add new user
                db.query(sql, values, function (err, results, fields){
                    if (err) throw err;
                    else console.log(results);
                  })
            }
            else res.render("login", {error: "User already exist", show: true});
    })
 })
 
app.get("/login", (req, res) => {
    res.render("login", {show: false});
})

app.listen(3000, () => {
    console.log("Server is running on port : 3000");
})