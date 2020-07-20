var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology: true, useNewUrlParser:true});
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended : true}));

var campgroundschema=new mongoose.Schema({
    name:String,
    image: String,
    description : String
});

var campground=mongoose.model("campground", campgroundschema);

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
            res.render("index", {campgrounds:allcampfromdb});            
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
    res.render("new");
});

//showing each campground on a page
app.get("/campgrounds/:id", function(req, res){
    campground.findById(req.params.id, function(err, foundcampground){
        if(err){
            console.log(err);
        } else{
            res.render("show", {campground : foundcampground});
        }
    });
});

app.listen(3000, function(req, res){
    console.log("YelpCamp is running");
});