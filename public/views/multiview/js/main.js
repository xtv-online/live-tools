$(function() {
    var date = new Date(); updateClock(date);
    // update text clock
    var update = setInterval(function(){ date = new Date(); updateClock(date); }, 1000);


    $('.segment').textfill({});
});



function updateClock(date) {
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    // update text
    $( "#hm" ).text( ((hours < 10) ? "0" + hours : hours) + ":" + ((minutes < 10) ? "0" + minutes : minutes) );
    $( "#s" ).text( ((seconds < 10) ? "0" + seconds : seconds));

    // light up seconds
    for (i = 0; i < (seconds + 1); i++) {
        $( ".p" + i ).css( "background", "#EF4136" );
    }
    // clear remaining seconds
    for (i = (seconds + 1); i < 60; i++) {
        $( ".p" + i ).css( "background", "gray" );
    }
}
