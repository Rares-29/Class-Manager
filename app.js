require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const db = require("./database").db;
const bcrypt = require("bcrypt");
const salt = 10;
const passport = require("passport");
const session = require("express-session");
const sessionStore = require("./database").sessionStore;
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));

 const initializePassport = require("./passport-config");
 initializePassport();


 app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
 }))

 app.use(passport.initialize());
 app.use(passport.session());

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
    db.query(find, username, function(err, results, fields) {
        if (err) throw err;
        else 
            if (results.length === 0) 
            {   /// Add new user
                bcrypt.hash(password, salt, function(err, hash) {
                    const values = [username, hash, email, teacher];
                    db.query(sql, values, function (err, results, fields){
                        if (err) throw err;
                        else res.redirect("/profile");
                      })    
                })
            }
            else res.render("register", {error: "User already exist", show: true});
    })
 })
 
app.get("/login", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/profile");
    else
        res.render("login", {show: false});
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}));


app.listen(3000, () => {
    console.log("Server is running on port : 3000");
})

app.get("/profile", (req, res) => {

    const find = "SELECT * from users WHERE username = ?"
    const user = req.user.username;
    let email;
    db.query(find, user, function(err, data) {
        if (!err) email = data[0].email;
        console.log(email);

    })
    res.render("profile");
})