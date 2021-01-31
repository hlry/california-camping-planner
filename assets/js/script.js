var parks = [{
        name: "Yosemite",
        latitude: "37.756718",
        longitude: "-119.596848",
        parkCode: 'yose',
        src: "./assets/images/parks/yosemite/yosemite.jpg"
    },

    {
        name: "Sequoia & Kings Canyon",
        latitude: "36.4333166",
        longitude: "-118.6836173",
        parkCode: 'seki',
        src: "./assets/images/parks/sequoia/Kings.jpg"
    },

    {
        name: "Redwood",
        latitude: "41.213181",
        longitude: "-124.004631",
        parkCode: 'redw',
        src: "./assets/images/parks/redwood/redwoods.jpg"
    },

    {
        name: "Joshua Tree",
        latitude: "33.881866",
        longitude: "-115.900650",
        parkCode: 'jotr',
        src: "./assets/images/parks/joshua/joshua.jpg"
    },

    {
        name: "Channel Islands",
        latitude: "33.998028",
        longitude: "-119.772949",
        parkCode: 'chis',
        src: "./assets/images/parks/channel/channelislands.jpg"
    },

    {
        name: "Death Valley",
        latitude: "36.5322649",
        longitude: "-116.9325408",
        parkCode: 'deva',
        src: "./assets/images/parks/death/deathvalley2.jpg"
    },

    {
        name: "Lassen Volcanic",
        latitude: "	40.487777777778",
        longitude: "-121.50388888889",
        parkCode: 'lavo',
        src: "./assets/images/parks/lassen/lassen.jpg"
    },

    {
        name: "Pinnacles",
        latitude: "35.617134",
        longitude: "-117.36836",
        parkCode: 'pinn',
        src: "./assets/images/parks/pinnacles/pinnacles2.jpg"
    }

];

//Pulls NPS API data for clicked card
let nps_loc = [];

function selectPark(parkCode) {
    api_key = 'WnxKQWqSaXwLvadioePDfDNoBEScjRDrJFaYgnhR';

    fetch(
            'https://developer.nps.gov/api/v1/parks?parkCode=' + parkCode + '&api_key=' + api_key
        )
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            //General Park info
            parkName = response.data[0].fullName;
            parkDescr = response.data[0].description;
            parkWeath = response.data[0].weatherInfo;
            parkImg = response.data[0].images[0].url;
            console.log(parkImg);

            //When user clicks on NPS card, modal opens with information
            displayModal(parkCode);

        });
};

function displayModal(parkCode) {
    var modal = document.getElementById("park-modal");
    modal.style.display = "block";

    //Add content to Modal
    var modTitle = $(".modal-card-title");
    modTitle.text(parkName);

    var img = document.getElementById("image");
    img.getElementsByTagName("img")[0].src = parkImg;

    /* var loc = document.getElementById("location");
     loc.innerHTML = 'Location: ' + parkAdd + ', ' + parkState;*/

    var des = document.getElementById("description");
    des.innerHTML = parkDescr;

    var wea = document.getElementById("weather");
    wea.innerHTML = 'Weather: ' + parkWeath;


    var get = parks.find(element => element.parkCode === parkCode);
    initMap(get.latitude, get.longitude);

    //Close Modal
    var button = document.getElementsByClassName("cancel")[0];
    button.onclick = function() {
        modal.style.display = "none";
    }

};

//when the card-header(s) are clicked
$(".is-linkable").on("click", function() {
    var request = $(this).closest(".column").data("parkCode");
    console.log(request);
    selectPark(request);
});

//===============================================XXXXXXXXXXXXXXXXXXXXXXXXXXXX==============================================================
var saved = {};
var liked = [""];

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

    var hasName = (saved.name != null && saved.name != "");
    var hasEmail = (saved.email != null && saved.email != "");

    if (hasName && hasEmail) $(".user-info").css("display", "none");
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
        parks[i].distance = distance;
    }

    parks.sort(function(left, right) { return left.distance - right.distance });
    displayParks();

}


displayParks = () => {

    var closestCards = document.querySelectorAll(".closest-header");
    var closestColumn = document.querySelectorAll(".closest-column");
    var closestImages = document.querySelectorAll(".closest-image");

    for (var i = 0; i < closestCards.length; ++i) {
        closestCards[i].innerHTML = parks[i].name;
        $(closestColumn[i]).data("parkCode", parks[i].parkCode);
        $(closestImages[i]).attr("src", parks[i].src)
    }
    $(".nps-closest").css("display", "block");

    var furthestCards = document.querySelectorAll(".furthest-header");
    var furthestColumn = document.querySelectorAll(".furthest-column");
    var furthestImages = document.querySelectorAll(".furthest-image");

    for (var i = 0; i < furthestCards.length; ++i) {
        furthestCards[i].innerHTML = parks[parks.length - 1 - i].name;
        $(furthestColumn[i]).data("parkCode", parks[parks.length - 1 - i].parkCode)
        $(furthestImages[i]).attr("src", parks[parks.length - 1 - i].src)
    }
    $(".nps-furthest").css("display", "block");
}

var saveData = function() {
    localStorage.setItem("saved", JSON.stringify(saved));
    localStorage.setItem("liked", JSON.stringify(liked));
};

var loadData = function() {
    saved = JSON.parse(localStorage.getItem("saved"));
    liked = JSON.parse(localStorage.getItem("liked"));
    if (liked === null) liked = [];
    if (saved === null) saved = {};
};

//add span clickable icons: heart to save to local storage

//submit button was clicked
$("#submit").on("click", function() {

    let form = document.getElementById('form');
    let formData = new FormData(form);

    saved.name = formData.get('name');
    console.log(formData.get('name'));
    saved.email = formData.get('email');
    saved.travelDate = formData.get('dates');
    saveData();

    $(".user-info").css("display", "none");
});

$("#changeuser").on("click", function() {
    saved.name = null;
    saved.email = null;
    saved.travelDate = null;
    saveData();
    checkModal();
});

//only load modal when the user name doesn't exist or user is changed
var checkModal = function() {
    loadData();

    var hasName = (saved.name != null && saved.name != "");
    var hasEmail = (saved.email != null && saved.email != "");

    if (hasName && hasEmail) {
        $("#name").css("display", "none");
        $("#email").css("display", "none");
        $("#traveldates").css("display", "none");
        $(".modal-card-foot").css("display", "none");

    } else {
        $("#name").css("display", "block");
        $("#email").css("display", "block");
        $("#traveldates").css("display", "block");
        $(".modal-card-foot").css("display", "block");
        $(".user-info").css("display", "flex");
    }
}

$(".delete").on("click", function() {
    $(".modal").css("display", "none");
    document.getElementById("mapContainer").innerHTML = '';
});

$(".heart").on("click", function() {

    var parkCode = $(this).closest(".column").data("parkCode");
    const found = liked.findIndex(element => element === parkCode);

    if (found != -1) {
        $(this).css("opacity", "0.3");
        liked[found] = null;
        saveData();
        //convert liked into an object
    } else {
        $(this).css("opacity", "1");
        var likedHeader = $(this).closest(".column").data("parkCode");
        console.log(likedHeader);
        liked.push(likedHeader);
        saveData();
    }

});



checkModal();