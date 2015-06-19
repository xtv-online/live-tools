$(function() {
    var socket = io();
    
    socket.on("who are you", function(roles){
        console.log(roles);
        roles.forEach(function(role) {
            $('<option value=' + role._id + '>' + role.roleName + '</select>').appendTo('#roles');
            console.log("adding", role.roleName);
        });
    });
    
    
    // unnecessary unless want to build interface all on one page w// jquery
    /*     
    socket.on("build interface", function(rows){ // rows = [["rowId": "row1", "height": "11", "divs":[["divId": "tally", "title": "Input", "rowId": "row1", "columns": "4"]]]]
        rows.forEach(function(row) {
            addRow(row.rowId, row.height);
            row.divs.forEach(function(div) {
                buildDiv(row.rowId, row.height);
            });
        });
    }); */
 
    $( ".confirmRole" ).click(function() {
        console.log("selected", $( "#roles option:selected" ).val());
        socket.emit("i am", $( "#roles option:selected" ).val());
    });
});


// unnecessary unless want to build interface all on one page w// jquery
/* function buildDiv(divId, title, rowId, columns) {
    $('<div id="' + divId + '" class=" modulebox col-xs-' + columns + '"><boxtitle><p>' + title + '</p></boxtitle><span></span></div>').appendTo('#' + rowId + ''');
}

function addRow(rowId, height) {
    $('<div id="' + rowId + '" style="height:' + height + 'em;"class="row"></div>').appendTo('#view');
} */