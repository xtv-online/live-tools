$(function() {
    var socket = io();

    socket.on("who are you", function(roles){
        roles.forEach(function(role) {
            $('<option value=' + role._id + '>' + role.roleName + '</select>').appendTo('#roles');
        });
    });

    $( ".confirmRole" ).click(function() {
        socket.emit("i am", $( "#roles option:selected" ).val());
    });

    socket.on("client connected", function(client) {
        console.log('Client Connected: ' + client.role[0].roleName);
        $('.messages').prepend('<p>' + '<b>Client Connected: </b>' + client.role[0].roleName + '</p>');
    });

    socket.on("client disconnected", function(client) {
        console.log('Client Disconnected: ' + client.role[0].roleName);
        $('.messages').prepend('<p>' + '<b>Client Disconnected: </b>' + client.role[0].roleName + '</p>');
    });

    socket.on("invalid identity", function () {
        console.log('Invalid identity provided');
    });

    socket.on("you are", function (clientDescription) {
        console.log('You are:', clientDescription);
    });

});
