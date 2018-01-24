var express=require("express"),
    app=express(),
    methodOverride=require("method-override"),
    bodyParser=require("body-parser"),
    expressSanitizer=require("express-sanitizer"),
    mongoose=require("mongoose");
 
//APP CONFIG    
mongoose.connect("mongodb://tanmay:tanmay@ds215208.mlab.com:15208/blogger", {useMongoClient: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
    
//MONGOOSEMODEL CONFIG
var blogSchema= mongoose.Schema({
      title:String,
      image:String,
      body:String,
      created:{type: Date ,default :Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);


//RESTful routes  
app.get("/",function(req,res){
   res.redirect("/blogs");   
});
//INDEX route
app.get("/blogs",function(req,res){
      Blog.find({},function(err,blogs){
            if(err){
                  console.log("error!!");
            } else {
                res.render("index",{blogs:blogs});  
            }
      });
      
});

//NEW route
app.get("/blogs/new",function(req,res){
res.render("new");      
});

//CREATE route
app.post("/blogs",function(req,res){
      req.body.blog.body=req.sanitize(req.body.blog.body);
//create blog
Blog.create(req.body.blog,function(err,newBlog){
   if(err){
         res.render("new");
   }  else {
         //then redirect to the index
         res.redirect("/blogs");
   } 
});
});

//SHOW route
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
            res.redirect("/blogs");
      }   else{
            res.render("show",{blog: foundBlog});
      }
   }); 
});

//EDIT route
app.get("/blogs/:id/edit",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
         if(err){
               res.redirect("/blogs");
         } else {
               res.render("edit",{blog:foundBlog});
         }
   })   
});

//UPDATE route
app.put("/blogs/:id",function(req,res){
      req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
      if(err){
            res.redirect("/blogs");
      }   else {
            res.redirect("/blogs/"+req.params.id);
      }
   }); 
});

//dELETE route
app.delete("/blogs/:id",function(req,res){
  //destroy blog
  Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
              res.redirect("/blogs");
        } else {
              res.redirect("/blogs");
        }
  })
  //redirect somewhere
});

app.listen(process.env.PORT,process.env.IP,function(){
      console.log("blog_app has been started")
});
