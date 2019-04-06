// Default Map Settings
var defaultCenter = [45, 0];
var defaultZoom = 2;
//var bounds = L.latLngBounds([28.70, -127.50],[48.85, -55.90])

// Year Drop Down Menu 
var myselect = document.getElementById("year"),
    startYear = new Date('1991').getFullYear()
    count = 28;

(function(select, val, count) {
  do {
    select.add(new Option(val++, count--), null);
  } while (count);
})(myselect, startYear, count);

// function init() {
//     // Grab a reference to the dropdown select element
//     var selector = d3.select("#year");
  
//     // Use the list of years to populate the select options
//     d3.json("/years").then((yearValues) => {
//       yearValues.forEach((year) => {
//         selector
//           .append("option")
//           .text(year)
//           .property("value", year);
//       });
  
//       // Use the first years from the list to build the initial plots
//       const firstYear = yearValues[0];
//       buildMap(firstYear);
//       buildPie(firstYear);
//       buildBar(firstYear);
//       chooseColor();
//     });
//   }



// FUNCTION: To initialize dashboard
function init() {
    //Get Geo JSON Data
    d3.json("/geojson", function(data) {
        //Load Geo JSON Data and Build Map
    buildMap(data);
    buildPie();
    buildBar();
    //chooseColor(); 
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


// FUNCTION: Coloring for country geojson fill
// function chooseColor() {

//     var countryList = [];
//     var geoNameList = [];
//     var TEPList = [];
//     var year = 1990;

//     d3.json("/countries", function(countries) {
//         console.log(countries);

//     });

//     d3.json("/geojson", function(geoNameList, geoData) {
//         geoData.features.forEach(function(geoNameList, feature) {
            
//             var geoName = feature.properties.name;
//             geoNameList.push(geoName);
//             console.log(geoNameList);       
//         });
//     });

//     d3.json(`/countries/${year}`, function(data) {
//        console.log(data);    
//         var TEPValues = data.yearKey[0];
                
//     });
        
//     // list of country names from TEP data
//     console.log(countryList);

//     // list of country names from geojson data
//     console.log(geoNameList);

//     // list of TEP values for each country
//     console.log(TEPList);
    
// }
//     // get TEPList max

//     var TEPMax
//     var colorList = ['#ffffe0', '#ffe3af', '#ffc58a', '#ffa474', '#fa8266', '#ed645c', '#db4551', '#c52940', '#aa0e27', '#8b0000'];
    
//     for (var i = 0; i++; 9) {
//         // case TEPMax*i/10 < TEPList[i] < TEPMax*(i+1)/10:
//         case TEPList[i] > (TEPMax*i/10) && TEPList[i] < (TEPMax*(i+1)/10):
//             return colorList[i];
//     }
// }

// FUNCTION: To build charts
function buildPie() {
    // get year value from dropdown using d3

    // var year = d3.select("#year").value;
    var year = 1990;
    
    d3.json(`/regions/${year}`, function(data) {
        
        var TEPList = data.yearKey[0];
        // console.log(year);
        // console.log(TEPList);

        d3.json(`/regions`, function(regions) {
            // console.log(regions);
            // console.log(TEPList);

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
    // var year = d3.select("#year").node().value;
    var year = 1990;
    
    d3.json(`/countries/${year}`, function(data) {
        
        var TEPList = data.yearKey[0];

        // console.log(year);
        // console.log(data);  
        // console.log(TEPList);

        d3.json(`/countries`, function(countries) {
            // console.log(countries);
            // console.log(TEPList);

            var barTrace = {
                x: countries,
                y: TEPList,
                text: countries,
                
                type: "bar",
              };
          
              var barData = [barTrace];
          
              var barLayout = {
                 title: "Total Energy Production (MToE) "
              }
          
              Plotly.newPlot('country-bar', barData, barLayout);

        });
        
    });
}


// Initialize Dashboard
init()