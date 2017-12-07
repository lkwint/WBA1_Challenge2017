// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map;
var service;
var infoWindow;
var pos;
var markers = [];
var selectedMarkerPosition;
var placesType;
var directionsDisplay;
var directionsService;

function initMap() {
    //directionsDisplay = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.16569, lng: 10.451526},
        zoom: 14
    });
    //directionsDisplay.setMap(map);
    var marker = new google.maps.Marker({
        map: map,
        title: 'Location found.'
    });
    infoWindow = new google.maps.InfoWindow();

    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    directionsService = new google.maps.DirectionsService()

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker.setPosition(pos);
            //marker.setPosition(pos);
            map.setCenter(pos);

//                getPlaces('gas_station');

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function calcRoute() {
    //var selectedMode = document.getElementById('mode').value;
    var request = {
        origin: pos,
        destination: selectedMarkerPosition,
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}
//radius als parameter übergeben
function getPlaces(type) {

    var pyrmont = new google.maps.LatLng(pos.lat,pos.lng);

    var request = {
        location: pyrmont,
        radius: 2000,
        types: [type]
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}
function clear_and_getPlaces(type) {
    deleteMarkers();
    getPlaces(type);
}
function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }
    console.log(results.length);
    for (var i = 0, result; result = results[i]; i++) {
        addMarker(result);
    }
}

function addMarker(place) {

    var icon = null;
    // types array contains restaurant ?
    if(place.types.indexOf('restaurant') >= 0){
        icon = '<span class="map-icon map-icon-restaurant"></span>';
    }
    if(place.types.indexOf('pharmacy') >= 0){
        icon = '<span class="map-icon map-icon-health"></span>';
    }
    if(place.types.indexOf('gas_station') >= 0){
        icon = '<span class="map-icon map-icon-gas-station"></span>';
    }
    if(place.types.indexOf('atm') >= 0){
        icon = '<span class="map-icon map-icon-atm"></span>';
    }
    if(place.types.indexOf('shopping_mall') >= 0){
        icon = '<span class="map-icon map-icon-shopping-mall"></span>';
    }
    if(place.types.indexOf('post_office') >= 0){
        icon = '<span class="map-icon map-icon-post-office"></span>';
    }




    var marker = new mapIcons.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            //url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
            path: mapIcons.shapes.ROUTE,
            fillColor: '#ff5757',
            fillOpacity: 1,
            strokeColor: '',
            strokeWeight: 0
        },
        map_icon_label: icon

    });


    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
        service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                console.error(status);
                return;
            }

            var open = "Closed";
            if (result.opening_hours.open_now)
                open = "Open";

            var price;
            switch(result.price_level) {
                case 0:
                    price = "Free";
                    break;
                case 1:
                    price = "Inexpensive";
                    break;
                case 2:
                    price = "Moderate";
                    break;
                case 3:
                    price = "Expensive";
                    break;
                case 4:
                    price = "Very Expensive";
                    break;
            }

            var marker_selected = result.geometry.location;

            var datails = 'Name: ' + result.name + '</br>' +
                'Address: ' + result.formatted_address + '</br>' +
                'Phone Number: ' + result.formatted_phone_number + '</br>' + open + '</br>' + price + '</br>' + 
                '<button onclick="calcRoute()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"> Weg zeigen </button>';

            infoWindow.setContent(datails);
            infoWindow.open(map, marker);
            selectedMarkerPosition = result.geometry.location;
        });
    });
}
function clearMarkers() {
    setMapOnAll(null);
}
function deleteMarkers() {
    clearMarkers();
    markers = [];
}
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}