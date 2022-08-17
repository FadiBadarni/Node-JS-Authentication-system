exports.registerPage = (req, res, next) => {
  res.render("register", {
    layout: "register_layout",
    pageTitle: "Register",
  });
};

exports.register = (req, res, next) => {};

exports.loginPage = (req, res, next) => {
  res.render("login", {
    layout: "login_layout",
    pageTitle: "Login",
  });
};

exports.login = (req, res, next) => {};
