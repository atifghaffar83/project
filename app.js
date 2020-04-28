//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://atif-admin:m0ng0At1a5DB@cluster0-h8nw1.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});


var posts = [];

const itemsSchema = {
    titlePost:String,
    postDetail: String
};

const postItem = mongoose.model("postItem",itemsSchema);


app.get("/",function(req,res){

    postItem.find({}, function(err,findItems){
        if (findItems.length===0){
            console.log("No Posts");
            res.redirect("home");
        }
        else {
            res.render("home",{findItemsRender:findItems});
        }
    });


});

app.get("/about",function(req,res){
  res.render("about",{aboutIntro:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactIntro:contactContent});
});

app.get("/compose", function(req,res){

    res.render("compose");

});


app.get("/post/:anything", function(req, res){

    var anything = _.kebabCase(req.params.anything);

postItem.find({}, function(err,findItems){

    for (var i = 0; i < findItems.length; i++) {

        if (anything == _.kebabCase(findItems[i].titlePost)) {

            res.render("post",{postTitle:findItems[i].titlePost, postBlog:findItems[i].postDetail})
            console.log("Match Found");
        }
    }
}

);
});


app.post("/compose",function(req,res){

    var newTitle = req.body.newTitle;
    var newPost = req.body.newPost;
    // var post = {title:newTitle,newForum:newPost};

    if (newTitle.length==0 || newPost.length==0){
        res.redirect("/compose");
    }
    else {

        const postNew = new postItem({
            titlePost:newTitle,
            postDetail: newPost
        });

        postNew.save(function(err){
            if(!err){
                    res.redirect("/");
            }
        });

        // posts.push(post);
        // items.push(item);

        // console.log(posts);


    }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000 or heroku");
});
