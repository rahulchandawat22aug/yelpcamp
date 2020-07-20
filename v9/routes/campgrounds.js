var express = require("express"),
    campground = require("../models/campgrounds") // const { model } = require("../models/comment");
var router = express.Router();

//index show all campgrounds
router.get("/", function (req, res) {
    campground.find({}, function (err, allcampfromdb) {
        if (err) {
            console.log("error occured ");
            console.log(err);
        } else {
            res.render("./campgrounds/index", { campgrounds: allcampfromdb });
        }
    });
});

router.post("/", isloggedin, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        // the req.user.username is name of user logged in, we can access logged in user using this
        id: req.user._id,
        username: req.user.username
    };
    var newcampground = { name: name, image: image, description: description, author: author };
    campground.create(newcampground, function (err, newlycreated) {
        if (err) {
            console.log("error occured ");
            console.log(err);
        } else {
            console.log(newlycreated);
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isloggedin, function (req, res) {
    res.render("./campgrounds/new");
});

//show
//showing each campground on a page
router.get("/:id", function (req, res) {
    //populate and exec are adding to below line to get comments by data instead of only by id
    // campground.findById(req.params.id, function(err, foundcampground){
    campground.findById(req.params.id).populate("comments").exec(function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("./campgrounds/show", { campground: foundcampground });
        }
    });
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
