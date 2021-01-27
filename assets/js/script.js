var parks = [{
        name: "Yosemite",
        latitude: "37.756718",
        longitude: "-119.596848",
    },

    {
        name: "Sequoia",
        latitude: "36.4333166",
        longitude: "-118.6836173",
    },

    {
        name: "Redwood",
        latitude: "41.213181",
        longitude: "-124.004631",
    },

    {
        name: "Joshua Tree",
        latitude: "33.881866",
        longitude: "-115.900650",
    }
];

initMap = function(latitude, longitude) {
    // Initialize the platform object:
    var platform = new H.service.Platform({
        'apikey': '_BCwX30hmPE4hQN1IqeMQiZHzROF5jS42dBwLFyD004'
    });

    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map, {
            zoom: 12,
            center: { lat: latitude, lng: longitude }
        });
}

//get user location : city name
//use location api tgoo find lat and long for user's location
//compare the location coordinates with stored coordinates(in an array)

function geoFindMe() {

    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        compareLocations(latitude, longitude);
    }

    function error() {
        status.textContent = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }

}

document.querySelector('#find-me').addEventListener('click', geoFindMe);

findDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
}

compareLocations = (latitude, longitude) => {

    for (var i = 0; i < parks.length; ++i) {
        var distance = findDistance(latitude, longitude, parks[i].latitude, parks[i].longitude)
        console.log(distance);
        parks[i].distance = distance;
    }

    parks.sort(function(left, right) { return right.distance - left.distance });
    displayParks();

}


displayParks = () => {
    var closestCards = document.querySelectorAll(".closest-cards");
    for (var i = 0; i < closestCards.length; ++i) {
        closestCards[i].innerHTML = parks[i].name;
    }
    $(".nps-closest").css("display", "block");
}

//add span clickable icons: heart to save to local storage