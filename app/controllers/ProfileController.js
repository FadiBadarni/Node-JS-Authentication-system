const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.profilePage = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.render("login", {
      message: "You need to login first!",
    });
  }
  var payload;
  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end();
    }
    return res.status(400).end();
  }
  res.render("profile", {
    title: "Profile",
    username: req.session.name,
  });
};

exports.profile = (req, res, next) => {
  const username = req.session.name;
  res.render("profile", {
    username,
  });
};
