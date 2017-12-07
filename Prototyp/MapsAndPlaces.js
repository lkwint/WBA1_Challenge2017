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
var placesType = [];
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
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker.setPosition(pos);
            map.setCenter(pos);

        }, function () {
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
    placesType = [];
    getPlaces(type);
    clearDirections();
}

function clearDirections(){
    directionsDisplay.set('directions', null);
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

function updateMarkerInformation(marker, place) {
    service.getDetails(place, function(result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
        }

        placesType.push({
            marker:marker,
            markerInfo: result
        });

        // update each time the marker array was modified
        fillContainer('list_container');
    });
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

    // TODO update marker information
    updateMarkerInformation(marker, place);

    google.maps.event.addListener(marker, 'click', function () {

        var markerInfo = placesType.find(function (value) {
            return value.marker === marker;
        });

        var result = markerInfo.markerInfo;


            var open = "Closed";
            if (result.opening_hours !== undefined && result.opening_hours.open_now)
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
                default:
                    price = "  "; 
            }

            var marker_selected = result.geometry.location;

            var datails = '<div class="info_container"> <b>' + result.name + '</b></br>' +
                result.formatted_address + '</br>' +
                result.formatted_phone_number + '</br>' + open + '</br>' + price + '</br>' + 
                '<button onclick="calcRoute()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"> Weg zeigen </button></div>';

            infoWindow.setContent(datails);
            infoWindow.open(map, marker);
            selectedMarkerPosition = result.geometry.location;

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

    function listPlacesByType() {
        var total = "<ul>";
        for (var i = 0; i < placesType.length; i++) {
            total +=
                "<li>" + placesType[i].markerInfo.name + " " + placesType[i].markerInfo.formatted_phone_number + "</li>"
        }
        total += "</ul>";
        document.getElementById("list").innerHTML = total;

        fillContainer('list_container');
    }
}

function fillContainer(id) {
    var container = document.getElementById(id);
    if(container === undefined)
        return;

    // clear before fill
    container.innerHTML = "";

    var innerHTML = "";

    for(var i = 0; i < placesType.length; i++)
    {
        var item = placesType[i].markerInfo;

        console.log(item);
        //dynamically create a new row
        innerHTML += '<div class="mdl-grid">\n' +
            '        <div class="mdl-cell mdl-cell--8-col">\n' +
            '            <div id="datalist_left">\n' +
            '                <h6>'+ item.name +'</h6>\n' +
            '                <p>' + item.formatted_phone_number+ '</p>\n' +
            '                <p>' + item.formatted_address + '</p>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="mdl-cell mdl-cell--4-col">\n' +
            '            <div id="datalist_right">\n' +
            '                <img src="" alt="NoImage"></div>\n' +
            '            <div class="datalist"></div>\n' +
            '        </div>\n' +
            '    </div>';
    }

    container.innerHTML = innerHTML;

}

function addBorder(iconId) {
    document.getElementById(iconId).classList.add("border_active");
    console.log(iconId);
    document.getElementById("myDropdown").classList.toggle("show");



}