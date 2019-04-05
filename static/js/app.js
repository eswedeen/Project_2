// Default Map Settings
var defaultCenter = [39.74739, -105];
var defaultZoom = 4;

//var bounds = L.latLngBounds([28.70, -127.50],[48.85, -55.90])




// Endpoints for Country and Region JSON Data




// geoJSON data & styling

var myGeoJSONPath = '/countries';

var myCustomStyle = {
    stroke: true,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 0.25    
}

// FUNCTION: To initialize dashboard

function init() {

    //Get Geo JSON Data

    d3.json(myGeoJSONPath, function(data) {

        //Load Geo JSON Data and Build Map
        var Year = data.year;
        var 


        buildMap(data);
        buildCharts();

    }); 
}

// FUNCTION: buildMap

function buildMap(data) {
    // Create the tile layer that will be the background of our map
    var worldMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create baseMaps object to hold the lightmap layer

    baseMaps = {
        "World Map": worldMap
    };
    lightmap.addTo(map);
    // var overlayMaps = {
    //     Countries: countryData
    //     Regions: regionData
    // };

    // Create the map object with options

    var map = L.map("map-id", {
        center: defaultCenter,
        zoom: defaultZoom,
        layers: [worldMap]
    });

    // Create Layer Control

    L.control.layers(baseMaps).addTo(map);

    // Add GeoJSON Data
    L.geoJson(data, {
        clickable: false,
        style: myCustomStyle
    }).addTo(map);



    



};







// FUNCTION: To build charts



function buildCharts() {



    // get year value from dropdown using d3



    var year = 1990;

    d3.json(`/countries/${year}`, function(data) {

        console.log(date[0]);

    });



}


        console.log(year);
        console.log(data);  
        console.log(TEPList);

        d3.json(`/countries`, function(countries) {
            console.log(countries);
            console.log(TEPList);

            var barTrace = {
                x: countries,
                y: TEPList,
                text: countries,
                
                type: "bar",
              };
          
              var barData = [barTrace];
          
              var barLayout = {
                 title: "Total Electric Power Produced"
              }
          
              Plotly.newPlot('country-bar', barData, barLayout);



// Initialize Dashboard



init();
