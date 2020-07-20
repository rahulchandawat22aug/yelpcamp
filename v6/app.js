var express = require("express"),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localstrategy = require("passport-local"),
    campground = require("./models/campgrounds"),
    comments = require("./models/comment"),
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

app.get("/", function (req, res) {
    res.render("landing");
});

//index show all campgrounds
app.get("/campgrounds", function (req, res) {
    campground.find({}, function (err, allcampfromdb) {
        if (err) {
            console.log("error occured ");
            console.log(err);
        } else {
            res.render("./campgrounds/index", { campgrounds: allcampfromdb });
        }
    });
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newcampground = { name: name, image: image, description: description };
    campground.create(newcampground, function (err, newlycreated) {
        if (err) {
            console.log("error occured ");
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("./campgrounds/new");
});

//show
//showing each campground on a page
app.get("/campgrounds/:id", function (req, res) {
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

//==============================================================
//comments, isloggedin is used to check if user is logged in
//=============================================================
app.get("/campgrounds/:id/comments/new", isloggedin, function (req, res) {
    //find campground by id

    campground.findById(req.params.id, function (err, foundcampground) {
        res.render("./comments/new", { campground: foundcampground });
    });
});

//we need to add the isloggedin here also coz anyone can send post request using postman
app.post("/campgrounds/:id/comments", isloggedin, function (req, res) {
    campground.findById(req.params.id, function (err, foundcampground) {
        comments.create(req.body.comment, function (err, comment) {
            foundcampground.comments.push(comment);
            foundcampground.save();
            res.redirect("/campgrounds/" + foundcampground._id);
        });
    });
});

//show register form
app.get("/register", function (req, res) {
    res.render("register");
});

// handle sign up logic
app.post("/register", function (req, res) {
    var newuser = new user({ username: req.body.username });
    user.register(newuser, req.body.password, function (err, user) {
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
app.get("/login", function (req, res) {
    res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) { }
);

// logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
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

app.listen(3000, function (req, res) {
    console.log("YelpCamp is running");
});