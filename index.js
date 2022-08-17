const path = require("path");
const mysql = require("mysql");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();

const encoder = bodyParser.urlencoded();
const webRoutes = require("./routes/web");
const errorController = require("./app/controllers/ErrorController");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;
const connection = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(webRoutes);
app.use(errorController.pageNotFound);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

connection.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Data Base connected successfully: " + connection.threadId);
});

app.listen(3000);
