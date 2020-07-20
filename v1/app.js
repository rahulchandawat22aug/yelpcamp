var express=require("express");
var app=express();
var bodyparser=require("body-parser");

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended : true}));

var campgrounds=[
        {name: "camp1", image: "https://images.pexels.com/photos/4328071/pexels-photo-4328071.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp1", image: "https://images.pexels.com/photos/4328071/pexels-photo-4328071.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp2", image: "https://images.pexels.com/photos/4631093/pexels-photo-4631093.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp2", image: "https://images.pexels.com/photos/4631093/pexels-photo-4631093.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp3", image: "https://images.pexels.com/photos/4348095/pexels-photo-4348095.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp3", image: "https://images.pexels.com/photos/4348095/pexels-photo-4348095.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp3", image: "https://images.pexels.com/photos/4348095/pexels-photo-4348095.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp3", image: "https://images.pexels.com/photos/4348095/pexels-photo-4348095.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "camp3", image: "https://images.pexels.com/photos/4348095/pexels-photo-4348095.jpeg?auto=compress&cs=tinysrgb&h=350"}
]

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){    
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    campgrounds.push({name: name, image: image});
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(req, res){
    console.log("YelpCamp is running");
});