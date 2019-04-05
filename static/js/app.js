// Default Map Settings
var defaultCenter = [45, 0];
var defaultZoom = 2;
//var bounds = L.latLngBounds([28.70, -127.50],[48.85, -55.90])

// FUNCTION: To initialize dashboard
function init() {
    //Get Geo JSON Data
    d3.json("/geojson", function(data) {
        //Load Geo JSON Data and Build Map
    buildMap(data);
    buildPie();
    buildBar();
        
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

    // Create the map object with options
    var map = L.map("map-id", {
        center: defaultCenter,
        zoom: defaultZoom,
        layers: [worldMap]
    });

    // format and load the GeoJSON data
    var myCustomStyle = {
        stroke: true,
        fill: true,
        fillColor: '#0000ff',
        fillOpacity: 0.75    
    }
    var countryMap = L.geoJson(data, {
        clickable: false,
        style: myCustomStyle
    }).addTo(map);

    // Create baseMaps object to hold the lightmap layer
    baseMaps = {
        "World Map": worldMap
        
    };
    // Create overlayMaps object to hold the Country Data
    var overlayMaps = {
        "Production by Country": countryMap
    };
    // Create Layer Control
    L.control.layers(baseMaps, overlayMaps).addTo(map);
};

// FUNCTION: geoData
function geoData() {
    d3.json("/geojson", function(data) {
        // format and load the GeoJSON data
        var myCustomStyle = {
            stroke: true,
            fill: true,
            fillColor: '#0000ff',
            fillOpacity: 0.75    
        }
        var countryMap = L.geoJson(data, {
            clickable: false,
            style: myCustomStyle
        }).addTo(map);
    });
}

// FUNCTION: To build charts
function buildPie() {
    // get year value from dropdown using d3
    var year = 1990;
    d3.json(`/regions/${year}`, function(data) {
        
        var TEPList = data.yearKey[0];
        console.log(year);
        console.log(TEPList);

        d3.json(`/regions`, function(regions) {
            console.log(regions);
            console.log(TEPList);

            var pieTrace = {
                values: TEPList,
                labels: regions,
                hoverinfo: regions,
                type: 'pie'
              };
          
              var pieData = [pieTrace];
          
              var pieLayout = {
                 title: "Total Energy Production (MToE) "
              }
          
              Plotly.newPlot('region-pie', pieData, pieLayout);

        });
        
    });
}

function buildBar() {
    // get year value from dropdown using d3
    var year = 1990;
    d3.json(`/countries/${year}`, function(data) {
        
        var TEPList = data.yearKey[0];

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

        });
        
    });
}

// Initialize Dashboard
init();