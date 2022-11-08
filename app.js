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
 const e = require("express");
 initializePassport();
 
 function Item(value, description) {
    this.value = value;
    this.description = description;
 }
 let menuTeacher = [new Item("assignment", "Upload Assignment"), new Item("assignments","Assignment list"), new Item("submissions", "View Submissions"), new Item("students", "All Students List"), 
                    new Item("classes", "Class List"), new Item("notices", "Write Notice"), new Item("inbox", "Inbox"), new Item("profile", "Profile"), new Item("password", "Change Password"), new Item("logout", "Logout")];
                    
 let menuStudent = [new Item("assignments", "Assignment List"), new Item("marks", "Marks"), new Item("notice", "Class Notice"), new Item("teachers", "Teacher list"), 
                    new Item("profile", "Profile"), new Item("password", "Change Password"), new Item("logout", "Logout")];
 let menu = [new Item("register", "Register"), new Item("login", "Login") ];

 app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
 }))

 app.use(passport.initialize());
 app.use(passport.session());

 let id;

app.get("/", (req, res) => {
    console.log(menu);
    res.render("home", {menu: menu});
})

app.get("/register", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/profile");
    else res.render("register", {show: false, menu: menu});
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
    if (password.length < 8) res.render("register", {error: "Password length must be > 8", show: true, menu: menu});
    if (c_password !== password) res.render("register", {error: "Passwords doesn't match", show: true, menu: menu});
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
            else res.render("register", {error: "User already exist", show: true, menu: menu});
    })
 })
 
app.get("/login", (req, res) => {
    if (req.isAuthenticated()) res.redirect("/profile");
    else
        res.render("login", {show: false, menu: menu});
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}));


app.listen(3000, () => {
    console.log("Server is running on port : 3000");
})

app.get("/profile", async(req, res) => {
    if (req.isAuthenticated()) {
    const find = "SELECT name from classes";
    const findTeacher = "SELECT teacher from users WHERE username = ?"
    const teach = new Promise (function(resolve, error) {db.query(findTeacher, req.user.username, function(err, data) {
        if (err) throw err;
        else resolve(data[0].teacher);
    })})
    const data = await teach;
    console.log(data);
    if (data === 0) {menu = menuStudent; res.render("profile", {menu: menu, hide: true, classes: ["no", "class"]})}
    else {
    menu = menuTeacher;
    db.query(find, function(err, data) {
        const classes = data.map(x => x.name); 
        res.render("profile", {hide: false, classes: classes, menu: menu});
    })
    }
    }
    else {res.redirect("/login");}
})

app.post("/profile", (req, res) => {
    const findUser = "SELECT * from users WHERE username = ?";
    const insertTeacher = "INSERT INTO teachers VALUES(?, ?, ?, ?)";
    const user = req.user.username;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const group = req.body.group;
    ab = new Promise(function(resolve, error) {db.query(findUser, user, function(err, data) {
        if (!err) id = data[0].ID;
        resolve(id);
    })})
    ab.then(function(){
    const values = [id, name, phone, email]
    console.log(id, name, phone, email); 
    db.query(insertTeacher, values, function(err) {
        if (err) console.log(err);
        else res.redirect("/");
    })
    })
})

app.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
      });
})