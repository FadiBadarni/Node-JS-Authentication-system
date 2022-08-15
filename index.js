const mysql = require("mysql");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();
const encoder = bodyParser.urlencoded();

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
app.use("/StyleSheets", express.static(__dirname + "/StyleSheets"));

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

//User Creation Post Request
app.post("/register", encoder, async (req, res) => {
  var user = req.body.username;
  var email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  connection.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM accounts.users WHERE username = ?";
    const search_query = mysql.format(sqlSearch, [user]);
    const sqlInsert = "INSERT INTO accounts.users VALUES (0,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [user, hashedPassword, email]);
    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      if (result.length != 0) {
        connection.release();
        //console.log("------> User already exists");
        res.redirect("/register");
      } else {
        await connection.query(insert_query, (err, result) => {
          connection.release();
          if (err) throw err;
          //console.log("--------> Created new User");
          res.redirect("/home");
        });
      }
    });
  });
});

//User Log In Post Request
app.post("/login", encoder, (req, res) => {
  var user = req.body.username;
  const password = req.body.password;
  req.session.username = req.body.username;

  connection.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from accounts.users where username = ?";
    const search_query = mysql.format(sqlSearch, [user]);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.redirect("/login");
      } else {
        const hashedPassword = result[0].password;
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful");

          // var token = jwt.sign(
          //   { user: user },
          //   process.env.ACCESS_TOKEN_SECRET,
          //   {
          //     expiresIn: "1m",
          //   }
          // );

          res.redirect("/test");
        } else {
          console.log("---------> Password Incorrect");
          res.redirect("/login");
        }
      }
    });
  });
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/views/Pages/login.html");
});
app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/views/Pages/register.html");
});

app.get("/test", async (req, res, next) => {
  res.render("index", { username: req.session.username });
});
app.listen(3000);
