var mongoose=require("mongoose");

var campgroundschema=new mongoose.Schema({
    name: String,
    image: String,
    description : String,
    //adding comments by reference not embeded
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});
module.exports=mongoose.model("campground", campgroundschema);
