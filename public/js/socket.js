$(function() {
    var socket = io();

    socket.on('who are you', function(roles){
        roles.forEach(function(role) {
            $('<option value=' + role._id + '>' + role.roleName + '</select>').appendTo('#roles');
        });

        if ($.cookie('live-tools-identity') !== undefined) {
            socket.emit('i am', $.cookie('live-tools-identity'));
        }
    });

    $( '.confirmRole' ).click(function() {
        socket.emit('i am', $( '#roles option:selected' ).val());
    });

    $( '.storeInCookie' ).click(function() {
        var identityID = $( '#roles option:selected' ).val();
        $.cookie('live-tools-identity', identityID);
    });

    $( '.deleteCookie' ).click(function() {
        $.removeCookie('live-tools-identity');
    });

    socket.on('client connected', function(client) {
        console.log('Client Connected: ' + client.role[0].roleName);
        $('.messages').prepend('<p><b>' + client.role[0].roleName + '</b>' + ' connected</p>');
    });

    socket.on('client disconnected', function(client) {
        console.log('Client Disconnected: ' + client.role[0].roleName);
        $('.messages').prepend('<p><b>' + client.role[0].roleName + '</b>' + ' disconnected</p>');
    });

    socket.on('invalid identity', function () {
        console.log('Invalid identity provided');
    });

    socket.on('you are', function (clientDescription) {
        console.log('You are:', clientDescription);
        $('span#identity').text(clientDescription.role[0].roleName);
    });

});
