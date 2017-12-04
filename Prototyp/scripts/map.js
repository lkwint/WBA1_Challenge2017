
function initMap() {
    var uluru = {lat: 51.0234262, lng: 7.5695483};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });

    // Specify location, radius and place types for your Places API search.
    var request = {
        location: uluru,
        radius: '500000',
        types: ['store', 'airport', 'university']
    };

    // Create the PlaceService and send the request.
    // Handle the callback with an anonymous function.
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                // If the request succeeds, draw the place location on
                // the map as a marker, and register an event to handle a
                // click on the marker.
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
            }
        }
    });
}

window.onload = function() {
    var startPos;
    var geoSuccess = function(position) {
        startPos = position;
        console.log(startPos.coords.latitude);
        console.log(startPos.coords.longitude);
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);
};

