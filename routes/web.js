const express = require("express");
const router = express.Router();
const HomeController = require("../app/controllers/HomeController");
const AuthController = require("../app/controllers/AuthController");

router.get("/", HomeController.homePage);

router.get("/register", AuthController.registerPage);
router.post("/register", AuthController.register);

router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.login);

module.exports = router;
