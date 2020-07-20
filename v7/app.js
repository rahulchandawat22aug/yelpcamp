var express = require("express"),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localstrategy = require("passport-local"),
    user = require("./models/user"),
    seeddb = require("./seeds")
var app = express();
seeddb();

mongoose.connect("mongodb://localhost/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
//to use css file we need this
app.use(express.static(__dirname + "/public"));
// campground.create({
//     name: "camp2", 
//     image: "https://images.pexels.com/photos/4631093/pexels-photo-4631093.jpeg?auto=compress&cs=tinysrgb&h=350",
//     description: "this is a very beautiful place"
//     },
//     function(err, campground){
//         if(err){
//             console.log("error is");
//             console.log(err);
//         } else{
//             console.log("camp is added ");
//             console.log(campground);
//         }
//     }
// );

// passport configuration
app.use(require("express-session")({
    secret: "once again rusty wins cutest dog",
    // we need to add these every time
    resave: false,
    saveUninitialized: false
}));
// we need to add these every time default
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentuser = req.user;
    next();
});

var campgroundroutes = require("./routes/campgrounds"),
    commentsroutes = require("./routes/comments"),
    indexroutes = require("./routes/index")

// writing the url in quotes attach the campground url after the written url in quotes
app.use("/campgrounds", campgroundroutes);
app.use("/campgrounds/:id/comments", commentsroutes);
app.use("/", indexroutes);

app.listen(3000, function () {
    console.log("YelpCamp is running");
});