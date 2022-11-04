const passport = require("passport");
const LocalStrategy = require('passport-local');
const bcrypt = require("bcrypt");
const db = require('./database').db;

function initialize()
{
function verify(username,password, done){
    db.query("SELECT * FROM users WHERE username = ?", [username], function(err, foundUser) {
        if (err) {return done(err);}
        if (foundUser.length === 0) {return done(null, false, {message: "Incorrect username or password."});}
        bcrypt.compare(password, foundUser[0].password, function(err, result) {
            if (err) console.log(err);
            else if (!result) return done(null, false, {message:"Incorrect username or password!"})
        return done(null, foundUser[0]);
        })
    })
}
    passport.use(new LocalStrategy(verify));
    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
          cb(null, { id: user.id, username: user.username });
        });
      });
      
      passport.deserializeUser(function(user, cb) {
        console.log(user);
        process.nextTick(function() {
          return cb(null, user);
        });
      });
}

module.exports = initialize;