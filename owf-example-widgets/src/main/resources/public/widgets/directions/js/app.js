// -----------------------------------
// Initialize
// -----------------------------------

$(document).ready(function () {

    function enableDrop() {
        OWF.DragAndDrop.setDropEnabled(true);
    }

    function disableDrop() {
        OWF.DragAndDrop.setDropEnabled(false);
    }

    // -----------------------------------
    // Initialize OWF specific code
    // -----------------------------------

    OWF.ready(function () {

        var startAddress = $('#start-address'),
            endAddress = $('#end-address'),
            dropZones = $('.owf-drop-zone');

        $('#navigate').on('click', function (e) {
            e.preventDefault();


            // -----------------------------------
            // Intents, dispatch navigate intent
            // -----------------------------------

            // dispatch navigate intent
            OWF.Intents.startActivity(
                {
                    action: 'navigate',
                    dataType: 'application/vnd.owf.sample.addresses'
                },
                [
                    startAddress.val(),
                    endAddress.val()
                ],
                function(dest) {
                    //console.log('navigate intent callback', arguments);
                }
            );
        });
        

        // -----------------------------------
        // Drag and Drop
        // -----------------------------------

        // When a drag starts in OWF, highlight
        // all drop zones

        OWF.DragAndDrop.onDragStart(function () {
            dropZones.addClass('highlight-drop-zone');

            dropZones.on('mouseover', enableDrop);
            dropZones.on('mouseout', disableDrop);
        });

        // When a drag stops in OWF, remove highlight
        // from all drop zones

        OWF.DragAndDrop.onDragStop(function () {
            dropZones.removeClass('highlight-drop-zone');

            dropZones.off('mouseover', enableDrop);
            dropZones.off('mouseout', disableDrop);
        });





        // Add handler for starting address

        OWF.DragAndDrop.addDropZoneHandler({
            dropZone: startAddress[0],
            handler: function (msg) {
                startAddress.val(msg.dragDropData.address);
            }
        });

        // Add handler for ending address

        OWF.DragAndDrop.addDropZoneHandler({
            dropZone: endAddress[0],
            handler: function (msg) {
                endAddress.val(msg.dragDropData.address);   
            }
        });

    });
        
});


