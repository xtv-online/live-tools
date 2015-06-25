var identity;
var socket = io();

function handshaking_module(readyFunction) {

    // Socket Event Handlers

    socket.on('who are you', function(roles) {
        var idCode = localStorage.getItem('identity');
        var webRTC = doesBrowserSupportWebRTC();
        if (idCode !== null) {
            socket.emit('i am', {
                'roleID': idCode,
                'isWebRtcCapable': webRTC
            });
        } else {
            location.replace('/');
        }
    });

    socket.on('you are', function(clientDescription) {
        identity = clientDescription;
        readyFunction();
    });

    socket.on('invalid identity', function() {
        alert('Identity provided invalid, returning to handshaking.');
        localStorage.removeItem('identity');
        location.replace('/');
    });

    socket.on('reset all', function () {
        location.reload();
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

}
