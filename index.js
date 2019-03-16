var expresssanitizer=require("express-sanitizer"),
    methodoverride=require("method-override"),
    express = require("express"),
    mongoose = require("mongoose"),
    bodyparser = require("body-parser");
    
     
var app = express();
app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
    
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser:true});
var blogschema=new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type :Date, default: Date.now}
});
var blog =mongoose.model("blog",blogschema);





//entry route
app.get("/",function(req, res) {
    res.redirect("/blogs"); 
})

//index route
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if (err){
            console.log("error!");
        }else{
            res.render("index",{blogs:blogs}); 
        }
    });
});

// new route 
app.get("/blogs/new",function(req, res) {
    res.render("new");
})
 
// create route
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitizer(req.body.blog.body);
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
});
 
// show route
app.get("/blogs/:id",function(req, res) {
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundblog})
        }
    });
});
 
//edit route
app.get("/blogs/:id/edit",function(req, res) {
     blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundblog})
        }
    });
})

//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitizer(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//delete route
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
     if(err){
         res.redirect("/blogs");
            }else{
                res.redirect("/blogs");
            }   
    });
});



 app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server start!!!")   
 });