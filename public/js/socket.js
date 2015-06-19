$(function() {
    var socket = io();
    
    socket.on("who are you", function(roles){
        console.log(roles);
        socket.emit("i am", "Camera 2");
    });
 
});