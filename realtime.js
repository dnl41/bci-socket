module.exports = function(server,sessionMiddleware){
    var io = require('socket.io')(server);
    var redis = require("redis");
    var client = redis.createClient();

    client.subscribe("datos");

   io.use(function(socket,next){
    sessionMiddleware(socket.request,socket.request.res,next);
   });
    
   client.on("message",function(channel,message){
    
    if(channel=="datos"){
    	console.log(message);
        io.emit('mensaje',message)
    }

   });

   io.sockets.on('connection', function(socket) {  
     console.log("dont mames"+socket.request.session.user_id)
   });


/*
    io.on('connection', function(socket) {  
    console.log('Un cliente se ha conectado');
    socket.emit('mensaje',{id: 1, hola:"hola"})
    });

    */
 }