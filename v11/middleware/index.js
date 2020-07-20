const { model } = require("../models/user");
var express = require("express");
var campground = require("../models/campgrounds");
var comments = require("../models/comment")

modelObj = {
    // userdefined middleware to check if user is logged in
    isloggedin(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            // setting up key and value to use later in login page
            req.flash("error", "You need to login to do that!");
            res.redirect("/login");
        }
    },

    checkCampgroundOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            campground.findById(req.params.id, function (err, foundcampground) {
                if (foundcampground.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    res.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            });
        }
        else {
            res.redirect("back");
        }
    },

    checkCommentOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            comments.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    res.redirect("back");
                }
                else {
                    if (foundComment.author.id.equals(req.user._id)) {
                        return next();
                    }
                    else {
                        res.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                }
            });
        }
        else {
            res.flash("error", "You don't have permission to do that!");
            res.redirect("back");
        }
    }
};

module.exports = modelObj;