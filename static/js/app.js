// Default Map Settings
var defaultCenter = [45, 0];
var defaultZoom = 2;

// FUNCTION: Initialize Dashboard
function init() {
    
    // Reference to Dropdown "year" Selection
    var selector = d3.select("#year");
  
    // Use "/years" Route to Populate Dropdown
    d3.json("/years", function(yearValues) {
      yearValues.forEach((year) => {
        selector
          .append("option")
          .text(year)
          .property("value", year);
      });
  
    // Load geoJSON Data into Leaflet Map
    d3.json("/geojson", function(data) {
        buildMap(data);
    });
        // Use the First Year from Dropdown for Initial Plots
        const firstYear = yearValues[0];
        buildPie(firstYear);
        buildBar(firstYear);
    });
  }

  // When Year Selection Changes -> Rebuild Plots
  function optionChanged(newYear) {
      buildPie(newYear);
      buildBar(newYear);
      buildMap(newYear);
          
    
  }

// FUNCTION: Build Leaflet Map
function buildMap(data) {

    // Create the Tile Layer that Will be the Background of the Map
    var worldMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create the Map Object with Options
    var map = L.map("map-id", {
        center: defaultCenter,
        zoom: defaultZoom,
        layers: [worldMap]
    });

    // Format and Load the GeoJSON Data
    var myCustomStyle = {
        stroke: true,
        fill: true,
        fillColor: chooseColor(year),
        fillOpacity: 0.75    
    }
    
    var countryMap = L.geoJson(data, {
        clickable: false,
        style: myCustomStyle
    }).addTo(map);

    // Create baseMaps to Hold the "Lightmap" Layer
    baseMaps = {
        "World Map": worldMap
        
    };
    // Create OverlayMaps to Add GeoJSON Layer
    var overlayMaps = {
        "Production by Country": countryMap
    };
    // Create Layer Control
    L.control.layers(baseMaps, overlayMaps).addTo(map);
};


// FUNCTION: Build Pie Chart from Region Data
function buildPie(year) {
    
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

// FUNCTION: Build Bar Chart from Country Data
function buildBar(year) {
        
    d3.json(`/countries/${year}`, function(data) {
        
        var TEPList = data.yearKey[0];

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

// FUNCTION: Coloring for country geojson fill
function chooseColor(year) {
    
    var countryList = [];
    var geoNameList = [];
    var TEPList = [];
    
    var year = d3.select("#year");
    console.log(year);

    d3.json("/countries", function(countries) {
        console.log(countries);

    });

    // d3.json("/geojson", function(geoNameList, geoData) {
    //     geoData.features.forEach(function(geoNameList, feature) {
            
    //         var geoName = feature.properties.name;
    //         geoNameList.push(geoName);
    //         console.log(geoNameList);       
    //     });
    // });

    d3.json(`/countries/${year}`, function(data) {
        var TEPValues = data.yearKey[0];
        console.log(TEPValues);     
    });

    switch (name) {
        case "Bahamas":
            return "yellow";
        case "China":
            return "red";
    }
        
    // // list of country names from TEP data
    // console.log(countryList);

    // // list of country names from geojson data
    // console.log(geoNameList);

    // // list of TEP values for each country
    // console.log(TEPList);
    

    // // get TEPList max

    // var TEPMax
    // var colorList = ['#ffffe0', '#ffe3af', '#ffc58a', '#ffa474', '#fa8266', '#ed645c', '#db4551', '#c52940', '#aa0e27', '#8b0000'];
    
    // for (var i = 0; i++; 9) {
    //     // case TEPMax*i/10 < TEPList[i] < TEPMax*(i+1)/10:
    //     case TEPList[i] > (TEPMax*i/10) && TEPList[i] < (TEPMax*(i+1)/10):
    //         return colorList[i];
    // }
}


// Initialize Dashboard
init()