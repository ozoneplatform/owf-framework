
var Map = {
    
    defaults: { 
        center: new google.maps.LatLng(38.901721, -77.035841),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    },

    el: null,
    directionsEl: null,

    instance: null,

    directionsService: null,
    directionsDisplay: null,
    directionResponse: null,

    directionTemplate: Handlebars.compile($('#directions-template').html()),
    infoTemplate: Handlebars.compile($('#info-template').html()),

    isPrinting: false,

    markers: [],

    state: {
        addresses: null,
        markers: null,
        bounds: null
    },

    initialize: function(el, directionsEl) {
        var me = this;
        this.el = el;
        this.directionsEl = directionsEl;

        this.state.addresses = [];
        this.state.markers = [];
        this.state.bounds = {};

        this.instance = new google.maps.Map(el, this.defaults);

        this.directionsService = new google.maps.DirectionsService();

        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.instance);

        this.geocoder = new google.maps.Geocoder();

        var timeoutId;
        google.maps.event.addListener(this.instance, 'bounds_changed', function(event) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout( function() {
                
                var bounds = me.instance.getBounds();

                // update state's bound object
                me.state.bounds =  {
                    ne: {
                        lat: bounds.getNorthEast().lat(),
                        lng: bounds.getNorthEast().lng()
                    },
                    sw: {
                        lat: bounds.getSouthWest().lat(),
                        lng: bounds.getSouthWest().lng()
                    }
                }

                me.save();

            }, 500 );
        });

        $.subscribe( 'marker:add', $.proxy(me.onMarkerAdded, me) );

        $.subscribe( 'navigate', function(e, start, end) {
            me.clearMarkers();

            me.state.addresses = [start, end];
            me.state.markers = [];
        });
    },

    setState: function (state) {
        this.clear();
        this.state = $.extend(true, {}, state);

        if(state.addresses && state.addresses.length > 0) {
            Map.getDirections(state.addresses[0], state.addresses[1]);
        }
        else if(state.markers) {
            for (var i = 0, len = state.markers.length; i < len; i++) {
                Map.placeMarker(state.markers[i]);
            }
        }

        if(state.bounds) {
            var sw = state.bounds.sw,
                ne = state.bounds.ne;

            if(state.bounds.ne && state.bounds.sw) {
                this.instance.panToBounds(new google.maps.LatLngBounds(
                    new google.maps.LatLng( sw.lat, sw.lng ),
                    new google.maps.LatLng( ne.lat, ne.lng )
                ));
            }
        }
    },

    codeAddress: function(address) {
        //console.log('codinng address', address);
        var deferred = jQuery.Deferred();

        this.geocoder.geocode({
            'address': address
            // , bounds: this.instance.getBounds()
        }, function(response, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                deferred.resolve(response)
            }
            else {  
                alert("Geocode was not successful for the following reason: " + status);
            }
        });

        return deferred.promise();
    },

    placeMarker: function(obj) {
        var me = this,
            address = obj.address;

        me.directionsDisplay.setMap(null);

        me.codeAddress(address).then(function(response) {
            var location = response[0].geometry.location,
                markerFound = false,
                marker;

            for (var i = 0, len = me.markers.length; i < len; i++) {
                marker = me.markers[i];
                if(marker.getPosition().equals(location)) {
                    markerFound = true;
                    break;
                }
            }

            if(markerFound !== true) {
                var newMarker = new google.maps.Marker({
                    map: me.instance,
                    position: location
                });

                $.publish('marker:add', [newMarker, obj]);
            }
            
            //me.instance.setZoom(15);
            me.instance.panTo(location);

            $.publish('marker:pan', obj);
        });
    },

    onMarkerAdded: function (e, marker, obj) {
        var me = this;
        this.state.addresses = [];
        this.state.markers.push(obj);

        this.markers.push(marker);

        marker.InfoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
            marker.InfoWindow.setContent( me.infoTemplate(obj) );
            marker.InfoWindow.setPosition(marker.getPosition());
            marker.InfoWindow.open(me.instance);
        });
    },

    getDirections: function(start, end) {
        var me = this,
            request = {
                origin:start,
                destination:end,
                travelMode: google.maps.TravelMode.DRIVING
            };

        me.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                me.directionsDisplay.setMap(me.instance);
                me.directionsDisplay.setDirections(response);

                me.directionResponse = response;
                
                $.publish('navigate', [start, end]);
            }
        });
    },

    clear: function() {
        this.clearMarkers().clearDirections();
    },

    clearMarkers: function() {
        for (var i = 0, len = this.markers.length; i < len; i++) {
            var marker = this.markers[i];
            marker.setMap(null);
        }

        this.markers = this.state.markers = [];

        return this;
    },

    clearDirections: function() {
        this.directionsDisplay.setMap(null);
        this.addresses = this.state.addresses = [];

        return this;
    },

    toggleMapPrintView: function() {
        if(this.isPrinting === false) {
            var steps = this.directionResponse.routes[0].legs[0];

            $(this.el).css('display', 'none');
            $(this.directionsEl).css('display', 'block').html( this.directionTemplate(steps) );

            // call browser's print method
            window.print();
        }
        else {
            $(this.el).css('display', '');
            $(this.directionsEl).css('display', 'none').empty();
        }

        this.isPrinting = !this.isPrinting;
    },

    save: function () {}

};


$(document).ready(function() {

    // initialize map
    Map.initialize( document.getElementById('map'), document.getElementById('directions') );

});