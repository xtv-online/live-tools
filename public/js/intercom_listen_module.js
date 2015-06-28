function intercom_listen_module(localPlaybackButton, localPlaybackAudio, localTxButton) {

    $(localPlaybackButton).click(function() {
        if ($(localPlaybackButton).hasClass( 'btn-danger' )) {
            // unmute
            $(localPlaybackAudio).prop("muted", false);
            socket.emit('tell director that client is listening to director', identity.role[0]._id);        
            $(localPlaybackButton).toggleClass( 'btn-success' );
            $(localPlaybackButton).toggleClass( 'btn-danger' );
        } else {
            // mute
            $(localPlaybackAudio).prop("muted", true);
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
            $(localPlaybackButton).toggleClass( 'btn-success' );
            $(localPlaybackButton).toggleClass( 'btn-danger' );
        };
    });
     
    $(localTxButton).click(function() {
        if ($(localTxButton).hasClass( 'btn-danger' )) {
            socket.emit('tell director to listen to client', identity.role[0]._id);
           // toggle class on director confirm
        } else {
           socket.emit('tell director to stop listening to client', identity.role[0]._id);
           // toggle class on director confirm
       };
    });
     
    socket.on('tell client that director is not listening', function(roleId) {
        if (roleId == identity.role[0]._id){
            if ($(localTxButton).hasClass( 'btn-success' )) {
                // mute
                $(localTxButton).toggleClass( 'btn-success' );
                $(localTxButton).toggleClass( 'btn-danger' );
            };
        };
    });    
    
    socket.on('tell client that director is listening', function(roleId) {
        if (roleId == identity.role[0]._id){
            if ($(localTxButton).hasClass( 'btn-danger' )) {
                // mute
                $(localTxButton).toggleClass( 'btn-success' );
                $(localTxButton).toggleClass( 'btn-danger' );
            }; 
        };
    });   
    
    socket.on('tell client to not listen to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            $(localPlaybackAudio).prop("muted", true);
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
            if ($(localPlaybackButton).hasClass( 'btn-success' )) {
                // mute
                $(localPlaybackButton).toggleClass( 'btn-success' );
                $(localPlaybackButton).toggleClass( 'btn-danger' );
            };
        };
    });    
    
    socket.on('tell client to listen to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            $(localPlaybackAudio).prop("muted", false);
            socket.emit('tell director that client is listening to director', identity.role[0]._id);
            if ($(localPlaybackButton).hasClass( 'btn-danger' )) {
                // mute
                $(localPlaybackButton).toggleClass( 'btn-success' );
                $(localPlaybackButton).toggleClass( 'btn-danger' );
            };
        };
    });
};