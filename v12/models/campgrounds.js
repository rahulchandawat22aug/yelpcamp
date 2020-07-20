var mongoose = require("mongoose");

var campgroundschema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    //this is added here so that we can attach logged in username and id with the campground created
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    //adding comments by reference not embeded
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});
module.exports = mongoose.model("campground", campgroundschema);
