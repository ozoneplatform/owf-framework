if(OWF.Util.isRunningInOWF()) {

    // -----------------------------------
    // Add behaviour if widget is in OWF
    // -----------------------------------
    Map.save = function () {
        OWF.Preferences.setUserPreference({
            namespace: OWF.getInstanceId(),
            name: 'widgetstate',
            value: OWF.Util.toString( this.state ),
            onSuccess: function () {
                //console.log(arguments) 
            },
            onFailure: function () {}
        });
    };

    Map.setPrintEnabled = function (enabled) {
        OWF.Chrome.updateHeaderButtons({
            items: [{
                itemId:'print',
                type: 'print',
                disabled: !enabled
            }]
        }); 
    };




    // -----------------------------------
    // Initialize
    // -----------------------------------

    OWF.ready(function () {


        // -----------------------------------
        // Check for launch data
        // -----------------------------------

        var launchData = OWF.Launcher.getLaunchData();
        if(launchData && launchData.address) {
            Map.placeMarker(launchData);
        }




        // -----------------------------------
        // Retrive saved state
        // -----------------------------------

        OWF.Preferences.getUserPreference({
            namespace: OWF.getInstanceId(),
            name: 'widgetstate',
            onSuccess: function (response) {
                
                if(response.value) {
                    Map.setState( OWF.Util.parseJson(response.value) );
                }

            }
        });




        // -----------------------------------
        // Subscribe to channel
        // -----------------------------------

        OWF.Eventing.subscribe('org.owfgoss.owf.examples.GoogleMapsExample.plotAddress', function (sender, msg, channel) {
            Map.placeMarker(msg);
        });




        // -----------------------------------
        // Setup receive intents
        // -----------------------------------

        // Registering for plot intent, and place marker when intent is received.

        OWF.Intents.receive({
            action: 'plot',
            dataType: 'application/vnd.owf.sample.address'
        },function (sender, intent, msg) {

            Map.placeMarker(msg);

        });


        // Registering for navigate intent, and getting directions when intent is received.

        OWF.Intents.receive({
            action: 'navigate',
            dataType: 'application/vnd.owf.sample.addresses'
        },function (sender, intent, msg) {

            Map.getDirections(msg[0], msg[1]);

        });





        // -----------------------------------
        // Add print button to widget chrome
        // -----------------------------------

        OWF.Chrome.insertHeaderButtons({
            items: [
                {
                    xtype: 'widgettool',
                    type: 'print',
                    itemId:'print',
                    tooltip:  {
                      text: 'Print Directions!'
                    },
                    handler: function(sender, data) {
                        Map.toggleMapPrintView();
                    }
                }
            ]
        });




        // -----------------------------------
        // Toggle chrome button state 
        // -----------------------------------

        $.subscribe('marker:pan', function () {
            //console.log('disabling print button', OWF.getInstanceId());
            Map.setPrintEnabled(false);
        });

        $.subscribe('navigate', function() {
            //console.log('enabling print button', OWF.getInstanceId());
            Map.setPrintEnabled(true);
        });



        // -----------------------------------
        // Clean up when widget closes
        // -----------------------------------

        var widgetState = Ozone.state.WidgetState.getInstance({
            onStateEventReceived: function(sender, msg) {
                var event = msg.eventName;

                if(event === 'beforeclose') {

                    widgetState.removeStateEventOverrides({
                        event: [event],
                        callback: function() {

                            OWF.Preferences.deleteUserPreference({
                                namespace: OWF.getInstanceId(),
                                name: 'widgetstate',
                                onSuccess: function (response) {
                                    widgetState.closeWidget();
                                }
                            });

                        }
                    });

                }
                else if(event === 'activate' || event === 'show') {
                    Map.el.style.display = 'block';
                }
                else if(event === 'hide') {
                    Map.el.style.display = 'none';
                }
            }
        });

        // override beforeclose event so that we can clean up
        // widget state data
        widgetState.addStateEventOverrides({
            events: ['beforeclose']
        });

        // listen for  activate and hide events so that we can
        // hide map object to fix a bug in Google Maps
        widgetState.addStateEventListeners({
            events: ['activate', 'hide', 'show']
        });
        
        OWF.notifyWidgetReady();

    });
}

