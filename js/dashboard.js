var googleUrl = 'https://docs.google.com/spreadsheets/d/1u2ZH4VBOjH-Rk3p4g8yel1TsBvBuyzUfwAr9le36V_A/pubhtml';
var csvLocation = "https://docs.google.com/spreadsheets/d/1u2ZH4VBOjH-Rk3p4g8yel1TsBvBuyzUfwAr9le36V_A/pub?output=csv";
var jsonLocation = "data/world-map.json";
var rawData; // a global

function init() {
    Tabletop.init({
        key: googleUrl,
        callback: function (mydata, tabletop) {
            rawData = mydata;

            // cleaning data

            rawData.forEach(function (a) {
                a.Year = +a.Year;
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
                var projection = d3.geo.mercator().center(centre).scale(140).translate([500, 220]);

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
                .columns(["Year", "Response", "Country", "Support", "Start Date", "End Date"])
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
                        //document.getElementById('interactive');
                        //document.getElementById('loading').style.display = "none";
                        document.getElementById('map').style.visibility = "visible";
                    }, 1000);
                }
            };

        },
        simpleSheet: true
    })
}
window.addEventListener('DOMContentLoaded', init)
 //END of .csv import