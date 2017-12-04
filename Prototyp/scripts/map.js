
function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
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

