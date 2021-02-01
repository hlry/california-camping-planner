//Pulling Web APIs for all CA National Parks; 
// information for each park populates when user clicks on park's card

//Channel Islands
var chan = document.getElementById("channel");
chan.onclick = function(){
    parkCode ='chis';
    selectPark(parkCode);
};

//Death Valley
var death = document.getElementById("deathvalley");
death.onclick = function(){
    parkCode ='deva';
    selectPark(parkCode);
};

//Joshua Tree
var jos = document.getElementById("joshua");
jos.onclick = function(){
    parkCode ='jotr';
    selectPark(parkCode);
};

//Lassen Volcanic
var las = document.getElementById("lassen");
las.onclick = function(){
    parkCode ='lavo';
    selectPark(parkCode);
};

//Pinnacles
var pinn = document.getElementById("pinnacles");
 pinn.onclick = function(){
     parkCode ='pinn';
     selectPark(parkCode);
 };

 //Redwood
var redw = document.getElementById("redwood");
 redw.onclick = function(){
     parkCode ='redw';
     selectPark(parkCode);
 };

//Sequoia 
var seq = document.getElementById("sequoia");
seq.onclick = function(){
    parkCode ='seki';
     selectPark(parkCode);

};

//Yosemite
var yose = document.getElementById("yosemite");
 yose.onclick = function(){
     parkCode ='yose';
     selectPark(parkCode);
 };


 //Pulls NPS API data for clicked card
let nps_loc=[];
function selectPark(parkCode){ 
    api_key='WnxKQWqSaXwLvadioePDfDNoBEScjRDrJFaYgnhR';

    fetch(
        'https://developer.nps.gov/api/v1/parks?parkCode=' + parkCode + '&api_key=' + api_key
    )
    .then(function(response){ 
    return response.json();
    })
    .then(function(response){
    //General Park info
    parkName = response.data[0].fullName;
    parkDescr = response.data[0].description;
    parkWeath = response.data[0].weatherInfo;
    parkImg = response.data[0].images[0].url;
    console.log(parkImg);

    //Location info
    parkAdd = response.data[0].addresses[0].city;
    parkState = response.data[0].states ;
    lat = response.data[0].latitude;
    long = response.data[0].longitude;

    //Create array with NP locations
    let parkCode={};
    parkCode.name = parkName;
    parkCode.latitude = lat;
    parkCode.longitude = long;

    nps_loc.push(parkCode);
    console.log(nps_loc);


    //When user clicks on NPS card, modal opens with information
    displayModal();

    });
};

function displayModal(){
    var modal = document.getElementById("modal");
    modal.style.display = "block";

    //Add content to Modal
    var modTitle = document.getElementById("modal-card-head");
    modTitle.innerHTML = parkName;  

    var img = document.getElementById("image");
    img.getElementsByTagName("img")[0].src = parkImg;

    var loc = document.getElementById("location");
    loc.innerHTML = 'Location: ' + parkAdd + ', ' + parkState;  

    var des = document.getElementById("description");
    des.innerHTML = parkDescr;  

    var wea = document.getElementById("weather");
    wea.innerHTML = 'Weather: ' + parkWeath;  

    
    //Close Modal
    var button = document.getElementsByClassName("cancel")[0];
        button.onclick = function() {
        modal.style.display = "none";
        }

};
