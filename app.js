var express = require("express");
var User = require("./models/user").User;
var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/sessions");
var favicon = require('serve-favicon');//favicon
var realtime = require("./realtime");
var formidable = require("express-formidable");

var RedisStore = require("connect-redis")(session);//redis

//..................
var http = require("http");

var app = express();

var server = http.Server(app);



//var server = require('http').createServer(app); 
//realtime(server); 


app.use("/public",express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

//.......   session  .............
var sessionMiddleware = session({
   store: new RedisStore({}),
   secret:"ultra secret word"
});


realtime(server,sessionMiddleware); // REAL TIME

app.use(sessionMiddleware);
app.use(formidable({ keepExtensions: true }));
//................................

app.set("view engine","jade");

app.get("/",function (req,res) {
  res.render("index");
});

app.get("/login",function (req,res) {
  res.render("login");
});

app.get("/signup",function (req,res) {
  res.render("singup");


});

app.post("/users",function(req,res){
  var user = new User({username: req.fields.username,
      email: req.fields.email,
        password: req.fields.password,
        password_confirmation: req.fields.password_confirmation});

  user.save().then(function(us){
     console.log(user.password_confirmation);
       res.send("Guardamos tus datos");
    },function(err){
       console.log(String(err));
       res.send("Hubo un error al guardar el usuario");
    });
}); 

app.post("/sessions",function(req,res){
  console.log("session");
     User.findOne({email: req.fields.email,password: req.fields.password},function(err,user){
       if (user != null) { 
            req.session.user_id = user._id;
            res.redirect("/app");
            console.log(user);
          }else {
            res.send("no existe el usuario");
          }
     });   
}); 

app.use("/app",session_middleware);
app.use("/app",router_app);

server.listen(8080);
