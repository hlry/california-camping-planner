var initMap = function() {
    // Initialize the platform object:
    var platform = new H.service.Platform({
        'apikey': '5Wf_4ZeIM5yGxOeX9QUzVkjlssVoMHD57e6fvYKbDgQ'
    });

    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map, {
            zoom: 12,
            center: { lat: 37.7, lng: -119.6 }
        });
}

//initMap();