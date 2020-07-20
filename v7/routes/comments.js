var express = require("express"),
    campground = require("../models/campgrounds"),
    comments = require("../models/comment");
var router = express.Router({ mergeParams: true });

//==============================================================
//comments, isloggedin is used to check if user is logged in
//=============================================================
router.get("/new", isloggedin, function (req, res) {
    //find campground by id

    campground.findById(req.params.id, function (err, foundcampground) {
        res.render("./comments/new", { campground: foundcampground });
    });
});

//we need to add the isloggedin here also coz anyone can send post request using postman
router.post("/", isloggedin, function (req, res) {
    campground.findById(req.params.id, function (err, foundcampground) {
        comments.create(req.body.comment, function (err, comment) {
            foundcampground.comments.push(comment);
            foundcampground.save();
            res.redirect("/campgrounds/" + foundcampground._id);
        });
    });
});
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
