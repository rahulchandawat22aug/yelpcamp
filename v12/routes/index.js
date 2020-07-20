var express = require("express"); // const { model } = require("../models/comment");
var router = express.Router();
var passport = require("passport"),
    // flash = require("connect-flash"),
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
    user.register(newuser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
            // this line gives error neeed to submit 2 times for flash message insted use next one
            // return res.render("register");
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username)
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
    req.flash("success", "Logged you out!");
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