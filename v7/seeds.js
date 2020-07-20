const { remove } = require("./models/campgrounds");

var mongoose = require("mongoose"),
campground = require("./models/campgrounds"),
comment=require("./models/comment")

var data=[
    {
        name: "camp1",  
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvOT04WFq02AARakvc2IGefmlbfVIcT4H0d9dAgMNR8Uy3REU&s",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "camp2",
        image: "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "camp3",
        image: "https://q9m3bv0lkc15twiiq99aa1cy-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/TENT.jpeg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

function seeddb(){
    //remove all campgrounds
    campground.deleteMany({}, function(err){
        console.log("campgrounds removed!!");
        data.forEach(function(data){
            campground.create(data, function(err, campground){
                console.log("campground is created");
                //creating a comment
                comment.create({text: "this place is great!!", author: "homer"}, function(err, comment){
                        campground.comments.push(comment);
                        campground.save();
                        console.log("new comment is created");
                    });
            });
        });
    });
}
 
module.exports = seeddb;