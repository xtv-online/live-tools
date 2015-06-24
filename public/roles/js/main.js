$(function() {
    var socket = io();

    $.get("api/", function(data, status) {
        console.log(data);
        data.forEach(function(config) {

        });
    });



    function updateClicked(argument) {
        var configName = $(this).attr('class').split(' ').pop();
        var inputs = $('input.' + configName);

        var updateObject = {};

        inputs.each(function(index) {
            var parameter = $(this).attr('class').split(' ').pop();
            var value = $(this).val();
            updateObject[parameter] = value;
        });

        $.post('api/' + configName, JSON.stringify(updateObject), function () {
            socket.emit('restart', configName);
            socket.on('restarting', function () {
                location.reload();
            });
        });

    }

});
