function txtime_module(timeSelector, titleSelector, divSelector) {

    socket.on('live status', function(duration, status) {
        
        hours = Math.floor(duration / 3600);
        minutes = Math.floor((duration - hours * 3600) / 60);
        seconds = duration - (minutes * 60 + hours * 3600);
        
        seconds = seconds.toFixed(0);

        hours = (hours < 10 ? "0" : "") + hours;
        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        $(timeSelector).text(hours + ':' + minutes + ':' + seconds);
        
        switch(status) {
            case 'on air':
                $(titleSelector).text('ON AIR');
                $(divSelector).css('background', '#EF4136');
                break;
            case 'off air':
                $(titleSelector).text('OFF AIR');
                $(divSelector).css('background', '#7e0000');
                break;
        }
    });

}
