const express = require("express");
const session = require("express-session");
const validationMiddleware = require("../app/middlewares/validation");
const router = express.Router();
const HomeController = require("../app/controllers/HomeController");
const AuthController = require("../app/controllers/AuthController");
const ProfileController = require("../app/controllers/ProfileController");
const LogoutController = require("../app/controllers/LogoutController");

router.get("/", HomeController.homePage);

router.get("/register", AuthController.registerPage);
router.post(
  "/register",
  validationMiddleware.validateRegister,
  AuthController.register
);

router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.login);

router.get("/profile", ProfileController.profilePage);
router.post("/profile", ProfileController.profile);

router.get("/logout", LogoutController.logout);

module.exports = router;
