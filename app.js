const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const db = require("./database.js");
 
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req, res) => {
    res.render("home");
})

app.listen(3000, () => {
    console.log("Server is running on port : 3000");
})