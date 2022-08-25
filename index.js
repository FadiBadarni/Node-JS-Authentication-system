const path = require("path");
const mysql = require("mysql");
const passport = require("passport");
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const sequelize = require("./config/database");
const webRoutes = require("./routes/web");
const errorController = require("./app/controllers/ErrorController");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  //This middleware checks the local user
  res.locals.user = req.user;
  next();
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(webRoutes);
app.use(errorController.pageNotFound);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
    console.log("App listening on port " + process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
