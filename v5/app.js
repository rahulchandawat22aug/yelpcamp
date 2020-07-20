var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose"),
campground=require("./models/campgrounds"),
// user=require("./models/user"),
comments=require("./models/comment"),
seeddb=require("./seeds")

seeddb();

mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology: true, useNewUrlParser:true});
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended : true}));
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

app.get("/", function(req, res){
    res.render("landing");
});


app.get("/campgrounds", function(req, res){
    campground.find({}, function(err, allcampfromdb){
        if(err){
            console.log("error occured ");
            console.log(err);
        } else{
            res.render("./campgrounds/index", {campgrounds:allcampfromdb});            
        }
    });    
});

app.post("/campgrounds", function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newcampground={name:name, image:image, description:description};
    campground.create(newcampground, function(err, newlycreated){
        if(err){
            console.log("error occured ");
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("./campgrounds/new");
});

//show
//showing each campground on a page
app.get("/campgrounds/:id", function(req, res){
    //populate and exec are adding to below line to get comments by data instead of only by id
    // campground.findById(req.params.id, function(err, foundcampground){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err);
        } else{
            res.render("./campgrounds/show", {campground : foundcampground});
        }
    });
});

//==============================================================
//comments
//=============================================================
app.get("/campgrounds/:id/comments/new", function(req, res){
    //find campground by id
    campground.findById(req.params.id, function(err, foundcampground){
        res.render("./comments/new", {campground:foundcampground});
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    campground.findById(req.params.id, function(err, foundcampground){
        comments.create(req.body.comment, function(err, comment){
            foundcampground.comments.push(comment);
            foundcampground.save();
            res.redirect("/campgrounds/"+foundcampground._id);
        });
    });
});

app.listen(4000, function(req, res){
    console.log("YelpCamp is running");
});