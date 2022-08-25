const User = require("../models/User");
exports.homePage = (req, res, next) => {
  const username = req.session.name;
  res.render("", {
    isLoggedIn: req.session.loggedin,
    username,
  });
};
