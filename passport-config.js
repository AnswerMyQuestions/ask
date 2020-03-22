const fs = require('fs');
const mysql = require('mysql');

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const dbConnection = mysql.createConnection({
     host: conf.host,
     user: conf.user,
     password: conf.password,
     port: conf.port,
     database: conf.database
});
dbConnection.connect();

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


function initialize(passport) {
    const authenticationUser = async (useremail, userpw, done) => {
        let sql = "SELECT * FROM USER WHERE user_email=?";
        let param = [useremail];
        dbConnection.query(sql, param,
          async (err, rows, fields) => {
              if(err) console.log("authenticationUser error" + err);
              if(rows.length == 0) {
                  return done(null, false, { message: 'No user with that email' });
              }
              try {
                  if(await bcrypt.compare(userpw, rows[0].user_password)) {
                      return done(null, rows[0].user_email);
                  } else {
                      return done(null, false, { message: 'Password incorrect' });
                  }
              } catch {
                  return done(e);
              }
      });

    }

    passport.use(new LocalStrategy({
         usernameField: 'useremail',
         passwordField: 'userpw',
        }, authenticationUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, id);
    });
}

module.exports = initialize;