var express = require("express");
var router = express.Router();
var Conectores = require('./conexion');
var redis = require("redis");

var client = redis.createClient();


  var Conector = new Conectores.Openbci_on ({
       verbose: true
   });


router.get("/",function(req,res){
 res.render("app/home"); 

});

router.route('/deslogear') 
  .get(function(req, res) { 
      delete req.session.user_id; 
 
      res.redirect('/') 
 
  })

router.post("/play",function(req,res){
   console.log("play");


   Conector.start();
   Conector.stream((data) => {
    client.publish("datos",data.channelData[1].toFixed(8).toString());
    //console.log(data);
    });

   res.redirect("/app");
 });


router.post("/stop",function(req,res){
   Conector.stop();
   res.redirect("/app");
   console.log("stop");
    
 });  
   
module.exports = router;