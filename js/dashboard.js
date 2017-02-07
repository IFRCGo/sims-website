
//IMPORTING DATA from CSV
var csvLocation = "data/SIMS Activation Log.csv";
var jsonLocation = "data/world-map.json";

d3.csv(csvLocation, function (error, rawData) {

    // cleaning data

    rawData.forEach(function (a) {
        a.Year = +a.Year;
        a.Significance = +a["Significance (1-5; 5 as most significant activations)"];
        delete a["Significance (1-5; 5 as most significant activations)"];
    });

    var data = crossfilter(rawData);
    var countryDim = data.dimension(function (a) { return a.Country });
    var countryGroup = countryDim.group().reduceCount();

    var maxValue = countryGroup.top(1)[0].value + 1;
    var minValue = 1;

    // create color palette function for map colours

    var paletteScale = d3.scale.linear()
            .domain([minValue, maxValue])
            .range(["#ff4d4d", "#000000"]); // blue colour

    var width = document.getElementById("table").offsetWidth;

    //-------------------------------------- Map -------------------------------

    d3.json(jsonLocation, function (error2, mapData) {

        var centre = d3.geo.centroid(mapData);
        var projection = d3.geo.mercator().center(centre).scale(160).translate([500, 200]);

        try {

            var worldMap = dc.geoChoroplethChart("#map")
                .width(900)
                .height(500)
                .dimension(countryDim)
                .projection(projection)
                .group(countryGroup)
                .colors(paletteScale)
                .transitionDelay([1500])
                .colorCalculator(function (a) { return a ? worldMap.colors()(a) : "#d9d9d9" })
                .overlayGeoJson(mapData.features, "state", function (a) { return a.properties.NAME; });
        } catch (e) { console.log("Error creating the map: ", e.message); }
        dc.renderAll();

        //clearing filters

        var resetButton = document.getElementById("reset-map");
        resetButton.onclick = function redraw() { worldMap.filterAll(); dc.redrawAll(); };

    }); // end of d3.json import
    

    //-------------------------------------- Table -----------------------------------------------------------

    try {
        var dataTable = dc.dataTable("#table")
        .width(1700)
        .height(400)
        .dimension(countryDim)
        .showGroups(false)
        .size(100) //change me if there are more than 100 lines in the table!!
        .group(function (a) {
            return a;
        })
        .columns(["Year", "Response", "Country", "Support", "Start Date", "End Date", "Significance"])
        .sortBy(function (a) { return [a["Year"], a["Response"]].join(); })
        .order(d3.descending)
        .transitionDelay([1000]);
    } catch (e) { console.log("Error creating the table: ", e.message) }

    dc.renderAll();

    //--------------------------------- map loading management (to improve UX)----------------------

    document.onreadystatechange = function () {
        var state = document.readyState
        if (state == 'interactive') {
            document.getElementById('map').style.visibility = "hidden";
        } else if (state == 'complete') {
            setTimeout(function () {
                document.getElementById('interactive');
                //document.getElementById('loading').style.display = "none";
                document.getElementById('map').style.visibility = "visible";
            }, 1000);
        }
    };

    //--------------------------------- download dialog box ----------------------

    function readTextFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true); //true = asynchronous request
        var allText = "";
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    allText = rawFile.responseText;
                }
            }
        }
        rawFile.send(null);
        return allText || "Error loading csv, please contact the website administrator";
    }

    var test = readTextFile(csvLocation);
    var downloadButton = document.getElementById("download-data");
    downloadButton.onclick = function () {
        var blob = new Blob([test], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "SIMS_activation_log.csv");
    };


}); //END of D3.csv import
