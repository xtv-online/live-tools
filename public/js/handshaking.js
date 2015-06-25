$(function() {
    var socket = io();
    var identity;

    // UI Event Handlers

    $('.confirmRole').click(function() {
        var idCode = $('#roles option:selected').val();
        var webRTC = doesBrowserSupportWebRTC();
        socket.emit('i am', {
            'roleID': idCode,
            'isWebRtcCapable': webRTC
        });
    });

    $('.storeInCookie').click(function() {
        var identityID = $('#roles option:selected').val();
        localStorage.setItem('identity', identityID);
    });

    $('.deleteCookie').click(function() {
        localStorage.removeItem('identity');
    });

    // Socket Event Handlers

    socket.on('who are you', function(roles) {
        roles.forEach(function(role) {
            $('<option value=' + role._id + '>' + role.roleName + ' / ' + role.shortName + '</select>').appendTo('#roles');
        });

        var idCode = localStorage.getItem('identity');
        var webRTC = doesBrowserSupportWebRTC();
        if (idCode !== null) {
            socket.emit('i am', {
                'roleID': idCode,
                'isWebRtcCapable': webRTC
            });
        }
    });

    socket.on('you are', function(clientDescription) {
        console.log('You are:', clientDescription);
        $('span#identity').text(clientDescription.role[0].roleName);

        identity = clientDescription;

        var roleCategory = clientDescription.role[0].roleCategory;
        window.location.replace('/views/' + roleCategory + '/index.html');
    });

    socket.on('invalid identity', function() {
        alert('Identity provided invalid, returning to handshaking.');
        localStorage.removeItem('identity');
        window.location.replace('/');
    });

    socket.on('reset all', function() {
        location.reload();
    });

    socket.on('client connected', function(client) {
        console.log('Client Connected: ' + client.role[0].roleName);
        $('.messages').prepend('<p><b>' + client.role[0].roleName + '</b>' + ' connected</p>');
    });

    socket.on('client disconnected', function(client) {
        console.log('Client Disconnected: ' + client.role[0].roleName);
        $('.messages').prepend('<p><b>' + client.role[0].roleName + '</b>' + ' disconnected</p>');
    });

    // Utility Functions

    function doesBrowserSupportWebRTC() {
        var today = new Date();
        var status = localStorage.getItem('web-rtc-status');

        if (status !== null) {
            status = JSON.parse(status);
            status.expiration = new Date(status.expiration);
            if (status.expiration > today) {
                return status.enabled;
            }
        }

        var webRTC_status = {
            'enabled': checkCompatability(),
            'expiration': addDays(today, 7)
        };

        localStorage.setItem('web-rtc-status', JSON.stringify(webRTC_status));

        return webRTC_status.enabled;

        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        function checkCompatability() {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            try {
                navigator.getUserMedia({
                        video: false,
                        audio: true
                    },
                    function(stream) {},
                    function(err) {
                        console.log('Failed to get local stream', err);
                    }
                );
            } catch (err) {
                console.log('no rtc');
                return false;
            }

            return true;
        }
    }

});
