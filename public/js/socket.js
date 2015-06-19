$(function() {
    var socket = io();
    
    socket.on("who are you", function(roles){
        console.log(roles);
        roles.forEach(function(role) {
            $('<option value=' + role._id + '>' + role.roleName + '</select>').appendTo('#roles');
            console.log("adding", role.roleName);
        });
    });
 
 
    $( ".confirmRole" ).click(function() {
        console.log("selected", $( "#roles option:selected" ).val());
        socket.emit("i am", $( "#roles option:selected" ).val());
    });
});