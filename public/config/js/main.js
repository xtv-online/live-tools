$(function() {
    $.get("api/", function(data, status) {
        data.forEach(function(config) {
            addForm(config);
            $(".btn." + config.name).bind("click", updateClicked);
        });
    });

    function addForm(config) {
        var toAppend = '<div class="panel panel-primary"><div class="panel-heading">';
        toAppend += config.name;
        toAppend += '</div><div class="panel-body"><form role="form">';

        var value = config.value;
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                toAppend += '<div class="form-group"><label for="' + key + '">' + key + '</label>';
                toAppend += '<input type="text" class="form-control ' + config.name + ' ' + key + '" value="' + value[key] + '">';
                toAppend += '</div>';
            }
        }

        toAppend += '<div class="btn btn-default ' + config.name + '">Update</div></form></div></div>';

        $('.forms').append(toAppend);
    }

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
            location.reload();
        });

    }

});
