var express = require("express"); // const { model } = require("../models/comment");
var router = express.Router();
var passport = require("passport"),
    user = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
});

//show register form
router.get("/register", function (req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function (req, res) {
    var newuser = new user({ username: req.body.username });
    user.register(newuser, req.body.password, function (err) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function (req, res) {
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function () { }
);

// logout
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


// userdefined middleware to check if user is logged in
// userdefined middleware to check if user is logged in
function isloggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;