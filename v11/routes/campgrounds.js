var express = require("express"),
    campground = require("../models/campgrounds") // const { model } = require("../models/comment");
var router = express.Router();
var modelObj = require("../middleware");

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

router.post("/", modelObj.isloggedin, function (req, res) {
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
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", modelObj.isloggedin, function (req, res) {
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

// edit campground
router.get("/:id/edit", modelObj.checkCampgroundOwnership, function (req, res) {
    campground.findById(req.params.id, function (err, foundcampground) {
        if (foundcampground.author.id.equals(req.user._id)) {
            res.render("campgrounds/edit", { campground: foundcampground });
        }
        else {
            res.redirect("back");
        }
    });
});

// update campground
router.put("/:id", modelObj.checkCampgroundOwnership, function (req, res) {
    //find and update correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, foundcampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// delete campground
router.delete("/:id", modelObj.checkCampgroundOwnership, function (req, res) {
    campground.findByIdAndRemove(req.params.id, function (err) {
        res.redirect("/campgrounds");
    });
});

module.exports = router;
