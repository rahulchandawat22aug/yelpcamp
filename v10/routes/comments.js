var express = require("express"),
    campground = require("../models/campgrounds"),
    comments = require("../models/comment");
const campgrounds = require("../models/campgrounds");
var router = express.Router({ mergeParams: true });
var modelObj = require("../middleware");

//==============================================================
//comments, isloggedin is used to check if user is logged in
//=============================================================
router.get("/new", modelObj.isloggedin, function (req, res) {
    //find campground by id
    campground.findById(req.params.id, function (err, foundcampground) {
        res.render("./comments/new", { campground: foundcampground });
    });
});

//we need to add the isloggedin here also coz anyone can send post request using postman
router.post("/", modelObj.isloggedin, function (req, res) {
    campground.findById(req.params.id, function (err, foundcampground) {
        comments.create(req.body.comment, function (err, comment) {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            foundcampground.comments.push(comment);
            foundcampground.save();
            res.redirect("/campgrounds/" + foundcampground._id);
        });
    });
});

// comment edit request after edit button from show page
router.get("/:comment_id/edit", modelObj.checkCommentOwnership, function (req, res) {
    comments.findById(req.params.comment_id, function (err, foundcomment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { comment: foundcomment, campground_id: req.params.id });
        }
    });
});

// comment edit request after submit btn from edit comment page
router.put("/:comment_id", modelObj.checkCommentOwnership, function (req, res) {
    comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedcomment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// delete request sent from show page
router.delete("/:comment_id", modelObj.checkCommentOwnership, function (req, res) {
    comments.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;