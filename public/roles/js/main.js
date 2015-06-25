$(function() {
    var socket = io();
    var $table = $('table tbody');

    $.get('api/', function(data, status) {
        async.eachSeries(data, function(role, callback) {
            $.get('rowtemplate.mst', function(template) {
                var rendered = Mustache.render(template, role);
                $table.append(rendered);

                $('select[name=roleCategory].' + role._id).find('option[value =' + role.roleCategory + ' ]').attr('selected', true);
                $('select[name=inputNumber].' + role._id).find('option[value =' + role.inputNumber + ' ]').attr('selected', true);
                $('.btn.delete.' + role._id).bind('click', deleteClicked);

                callback();
            });
        });
    });


    $('.addRoleRow').click(function() {
        $('.addRoleRow').prop('disabled', true);

        $.get('rowtemplate.mst', function(template) {
            var rendered = Mustache.render(template, {
                'add': 'add'
            });
            $table.append(rendered);
            rowHasBeenAdded = true;
            $('.btn.add').bind('click', addClicked);
        });
    });

    $('.updateRoles').click(function() {
        $('.updateRoles').prop('disabled', true);
        var $tableRows = $('tr:gt(0)');

        async.eachSeries($tableRows, function($row, callback) {
            var id = $($row).find('input[name=roleName]').attr('class');

            var data = {
                'roleName':     $($row).find('[name=roleName]').val(),
                'shortName':    $($row).find('[name=shortName]').val(),
                'roleCategory': $($row).find('[name=roleCategory] option:selected').val(),
                'location':     $($row).find('[name=location]').val(),
                'inputNumber':  parseInt($($row).find('[name=inputNumber] option:selected').val()),
                'hasTalkBack':  $($row).find('[name=hasTalkBack]').is(':checked')
            };

            console.log(data);

            $.post('api/' + id, JSON.stringify(data), function() {
                $row.remove();
                callback();
            });
        }, function() {
            socket.emit('reset all clients');
            location.reload();
        });

    });

    function addClicked() {
        var data = {
            'roleName': $('input.add[name=roleName]').val(),
            'shortName': $('input.add[name=shortName]').val(),
            'roleCategory': $('select.add[name=roleCategory] option:selected').val(),
            'location': $('input.add[name=location]').val(),
            'inputNumber': parseInt($('select.add[name=inputNumber] option:selected').val()),
            'hasTalkBack': $('input.add[name=hasTalkBack]').is(':checked')
        };

        $.post('api/addRole/', JSON.stringify(data), function() {
            socket.emit('reset all clients');
            location.reload();
        });

    }

    function deleteClicked() {
        var idToDelete = $(this).attr('class').split(' ').pop();

        $.post('api/deleteRole/' + idToDelete, '{}', function() {
            socket.emit('reset all clients');
            location.reload();
        });
    }

    function updateClicked() {
        var configName = $(this).attr('class').split(' ').pop();
        var inputs = $('input.' + configName);

        var updateObject = {};

        inputs.each(function(index) {
            var parameter = $(this).attr('class').split(' ').pop();
            var value = $(this).val();
            updateObject[parameter] = value;
        });

        $.post('api/' + configName, JSON.stringify(updateObject), function() {
            socket.emit('restart', configName);
            socket.on('restarting', function() {
                location.reload();
            });
        });

    }

});
