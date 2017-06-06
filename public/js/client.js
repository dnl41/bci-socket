var socket = io();

socket.on('mensaje',function(data){
     console.log(data);
})
