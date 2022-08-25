const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerPage = (req, res, next) => {
  if (req.session.loggedin) {
    res.render("index", {
      isLoggedIn: req.session.loggedin,
      username: req.session.name,
    });
  } else {
    res.render("register", {
      isLoggedIn: req.session.loggedin,
      username: req.session.name,
    });
  }
};

exports.register = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return bcrypt
          .hash(req.body.password, 12)
          .then((hashedPassword) => {
            const user = new User({
              username: req.body.username,
              email: req.body.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return res.redirect("/login");
          });
      } else {
        console.log("E-Mail exists already, please pick a different one.");
        return res.redirect("/register");
      }
    })
    .catch((err) => console.log(err));
};

exports.loginPage = (req, res, next) => {
  res.render("login", {
    isLoggedIn: req.session.loggedin,
  });
};

exports.login = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.inputUsername,
    },
  })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.inputPassword, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.loggedin = true;
              req.session.name = req.body.inputUsername;
              const username = req.session.name;
              res.locals.user = user;
              const token = jwt.sign(
                {
                  username: username,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "1h",
                }
              );
              console.log("from login token:", token);
              res.cookie("token", token, { maxAge: 30 * 1000 });
              return res.redirect("/");
            }
            return res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
            return res.redirect("/login");
          });
      } else {
        return res.redirect("/login");
      }
    })
    .catch((err) => console.log(err));
};
