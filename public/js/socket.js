$(function() {
    var socket = io();

    socket.on('who are you', function(roles){
        roles.forEach(function(role) {
            $('<option value=' + role._id + '>' + role.roleName + '</select>').appendTo('#roles');
        });

        var idCode = localStorage.getItem('identity');
        if ( idCode !== null ){
            console.log('idCode');
            socket.emit('i am', idCode);
        }

    });

    $( '.confirmRole' ).click(function() {
        socket.emit('i am', $( '#roles option:selected' ).val());
    });

    $( '.storeInCookie' ).click(function() {
        var identityID = $( '#roles option:selected' ).val();
        localStorage.setItem('identity', identityID);
    });

    $( '.deleteCookie' ).click(function() {
        localStorage.removeItem('identity');
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

        var roleCategory = clientDescription.role[0].roleCategory;
        window.location.replace('/views/' + roleCategory + '/index.html');

    });

});
