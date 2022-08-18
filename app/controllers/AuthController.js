const bcrypt = require("bcryptjs");

const User = require("../models/User");

exports.registerPage = (req, res, next) => {
  res.render("register", {
    layout: "register_layout",
    pageTitle: "Register",
  });
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
    layout: "login_layout",
    pageTitle: "Login",
  });
};

exports.login = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.inputEmail,
    },
  })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.inputPassword, user.password)
          .then((doMatch) => {
            if (doMatch) {
              return res.redirect("/");
            }
            // req.flash('error', 'Invalid email or password.');
            // req.flash('oldInput',{email: req.body.inputEmail});
            return res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
            // req.flash('error', 'Sorry! Somethig went wrong.');
            // req.flash('oldInput',{email: req.body.inputEmail});
            return res.redirect("/login");
          });
      } else {
        // req.flash('error', 'No user found with this email');
        // req.flash('oldInput',{email: req.body.inputEmail});
        return res.redirect("/login");
      }
    })
    .catch((err) => console.log(err));
};
