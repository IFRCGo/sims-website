
//IMPORTING DATA from CSV

d3.csv("data/SIMS Activation Log.csv", function (error, rawData) {
    console.log(rawData);
    //cleaning data

    rawData.forEach(function (a) {
        a.Year = new Date(a.Year);
        a.Significance = +a["Significance (1-5; 5 as most significant activations)"];
        delete a["Significance (1-5; 5 as most significant activations)"];
    });

    var data = crossfilter(rawData);
    var countryDim = data.dimension(function (a) { return a.Country});
    var countryGroup = countryDim.group().reduceCount();

    var maxValue = 3;  /// To DO: NEED TO AUTOMATE THIS VALUE
    var minValue = 1;

    // create color palette function
    var paletteScale = d3.scale.linear()
            .domain([minValue, maxValue])
            .range(["#ff4d4d", "#000000"]); // blue color

	// importing map data
    d3.json("data/world-map.json", function (error2, mapData) {
        
        var centre = d3.geo.centroid(mapData);
        var projection = d3.geo.mercator().center(centre).scale(150).translate([500,200]);
        console.log("mapData = ", mapData);
        try{
            var worldMap = dc.geoChoroplethChart("#map")
                .width(1100)
                .height(500)
                .dimension(countryDim)
                .projection(projection)
                .group(countryGroup)
                .colors(paletteScale)
                .colorCalculator(function (a) { return a ? worldMap.colors()(a) : "#d9d9d9" })
                .overlayGeoJson(mapData.features, "state", function (a) { return a.properties.NAME; });
        } catch(e) {console.log(e.message);}
        dc.renderAll();

        //clearing filters
        var resetButton = document.getElementById("reset-map");
        resetButton.onclick = function () { worldMap.filterAll(); dc.redrawAll(); };
        console.log(resetButton);
    });
    //-------------------------------------- Table -------------------------------

    try {
        var dataTable = dc.dataTable("#table")
        .width(1200)
        .height(400)
        .dimension(countryDim)
        .showGroups(false)
        .group(function (a) {
            return a;
        })
        .columns([{ label: 'Year', format: function (a) { return a["Year"].getFullYear(); } },
            "Code", "Country", "Support", "Significance", "Response", "Start Date", "End Date"
        ])
        .sortBy(function (a) { return a["Year"] })
        .order(d3.descending);
    } catch (e) { console.log("error dataTable:", e.message) }

    dc.renderAll();
   
}); //END of D3.csv import