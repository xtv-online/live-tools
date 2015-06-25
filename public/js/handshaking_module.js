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
        location.replace('/');
    });

    // Utility Functions

    function doesBrowserSupportWebRTC() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // save stream object pointer
        try {
            navigator.getUserMedia({
                    video: false,
                    audio: true
                },
                function(stream) {
                },
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
