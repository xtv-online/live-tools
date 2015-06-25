function tally_module(inputID, tallyElementSelector) {
    if (tallyElementSelector !== undefined) {
        socket.on('camera tally', function(inputNumber, state) {
            if (inputNumber === parseInt(inId)) {
                if (state.program) {
                    $(tallyElementSelector).css("background", "#EF4136"); // Program
                } else if (state.preview) {
                    $(tallyElementSelector).css("background", "#71BF4B"); // Preview
                } else {
                    $(tallyElementSelector).css("background", "#2a001b"); // Idle
                }
            }
        });
    }
}
