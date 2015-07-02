function tally_module(inputID, tallyElementSelector) {    
    var tallyState = 'idle';
    var activeAuxNumber = 0;

    if (tallyElementSelector !== undefined) {
        socket.on('camera tally', function(inputNumber, state) {
            if (inputNumber === parseInt(inputID)) {
                if (state.program) {
                    tallyState = 'pgm';
                } else if (state.preview) {
                    tallyState = 'pvw';
                } else if (activeAuxNumber > 0){
                    tallyState = 'aux';
                } else {
                    tallyState = 'idle';
                };
                changeBackground(tallyState);
            };
        });
        
        socket.on('aux tally', function(inputNumber, auxNumber) {
            if (inputNumber === parseInt(inputID)) {
                if (tallyState === 'idle') {
                    tallyState = 'aux';
                };
                activeAuxNumber = auxNumber;
            } else if (auxNumber === activeAuxNumber){
                if (tallyState === 'aux') {
                    tallyState = 'idle';
                };
                activeAuxNumber = 0;
            };
            changeBackground(tallyState);
        });
    }
    
    function changeBackground(tallyState){
        switch (tallyState){
            case 'idle':
                $(tallyElementSelector).css("background", "#2A001B"); // Idle
                break;
            case 'pgm':
                $(tallyElementSelector).css("background", "#EF4136"); // Program
                break;
            case 'pvw':
                $(tallyElementSelector).css("background", "#71BF4B"); // Preview
                break;
            case 'aux':
                $(tallyElementSelector).css("background", "#F68B28"); // Aux
                break;
        };
            
    };
};

