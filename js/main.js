// Standard SVG drawing area variables
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var col6Width = 500 - margin.left - margin.right,
    col6Height = 500 - margin.top - margin.bottom;

var col12Width = 1000 - margin.left - margin.right,
    col12Height = 500 - margin.top - margin.bottom;


// Define SVG Sizes
var worldLineWidth = col6Width;
var worldLineHeight = col6Height*0.67;

var worldAreaWidth = col6Width;
var worldAreaHeight = col6Height*0.67;

var worldMapWidth = col6Width*1.25;
var worldMapHeight = col6Height*1.67;


// Other common variables
var formatDate = d3.time.format("%Y"); // Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var commaFormat = d3.format(",");
var g;



// Append SVGs
var worldLineSvg = d3.select("#lineChart").append("svg")
    .attr("width", worldLineWidth + margin.left + margin.right)
    .attr("height", worldLineHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var worldAreaSvg = d3.select("#areaChart").append("svg")
    .attr("width", worldAreaWidth + margin.left + margin.right)
    .attr("height", worldAreaHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var worldMapSvg = d3.select("#worldMap").append("svg")
    .attr("width", worldMapWidth)
    .attr("height", worldMapHeight)
    .style("margin", "10px auto");



// Define Scales
//var worldLineXScale = d3.scale.ordinal()
//    .range([0, worldLineWidth/2, worldLineWidth]);
var worldLineXScale = d3.scale.ordinal()
    .rangeRoundBands([0, worldLineWidth], .1);
var worldLineYDollarScale = d3.scale.linear()
    .range([worldLineHeight, 0]);
var worldLineYTonScale = d3.scale.linear()
    .range([worldLineHeight, 0]);

var worldAreaXScale = d3.scale.linear()
    .range([0, worldAreaWidth]);
var worldAreaYScale = d3.scale.linear()
    .domain([0,500000000])
    .range([worldAreaHeight, 0]);
var worldAreaCategoryScale = d3.scale.ordinal()
    .range(["#4d0000", "#7f0000", "#b30000", "#d7301f", "#ef6548", "#fc8d59", "#fdbb84", "#fdd49e", "#fee8c8", "#fff7ec"]);
var worldAreaCategoryScaleFull = d3.scale.ordinal()
    .range(["#4d0000", "#7f0000", "#b30000", "#d7301f", "#ef6548", "#fc8d59", "#fdbb84", "#fdd49e", "#fee8c8", "#fff7ec"]);
    var worldAreaCategoryScaleFullDomain;

var worldMapColorScale = d3.scale.threshold()
    .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);



// Initial chart path descriptions
//var worldLineLine = d3.svg.line();
//var worldLinePath = worldLineSvg.append("path")
//    .attr("class", "line");

var worldAreaArea = d3.svg.area()
    .x(function(d) {
        return worldAreaXScale(d.date);
    })
    .y0(function(d) {
        return worldAreaYScale(d.y0);
    })
    .y1(function(d) {
        return worldAreaYScale(d.y0 + d.y);
    });
var worldAreaStack = d3.layout.stack()
    .values(function(d) { return d.values; });

var worldMapProjection = d3.geo.mercator()
    .center([0,0])
    .scale(80)
    .rotate([0,0])
    .translate([250,250]);

var worldMapPath = d3.geo.path()
    .projection(worldMapProjection);

var worldMapZoom = d3.behavior.zoom()
    .translate(worldMapProjection.translate())
    .scale(worldMapProjection.scale())
    .on("zoom", zoomed);
worldMapSvg.call(worldMapZoom);




// Define Axes
var worldLineXAxis = d3.svg.axis()
    .orient("bottom");
var worldLineYAxis = d3.svg.axis()
    .orient("left");
var worldLineYTonAxis = d3.svg.axis()
    .orient("right");

var worldAreaXAxis = d3.svg.axis()
    .tickFormat(d3.format("d"))
    .orient("bottom");
var worldAreaYAxis = d3.svg.axis()
    .tickFormat(d3.format(","))
    .orient("left");




// Append Axes
var worldLineXAxisGroup = worldLineSvg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + worldLineHeight + ")");
var worldLineYAxisGroup = worldLineSvg.append("g")
    .attr("class", "axis y-axis");
var worldLineYTonAxisGroup = worldLineSvg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + (worldLineWidth - 5) + ", 0)");

var worldAreaXAxisGroup = worldAreaSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + worldAreaHeight + ")");
var worldAreaYAxisGroup = worldAreaSvg.append("g")
    .attr("class", "y axis");




// Append Axes Labels
worldLineYAxisGroup.append("text")
    .attr("x", -165)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .text("US Dollars (Avg. per Country)");
worldLineYTonAxisGroup.append("text")
    .attr("x", -155)
    .attr("y", -10)
    .attr("transform", "rotate(-90)")
    .text("100 Tons (Avg. per Country)");

worldAreaYAxisGroup.append("text")
    .attr("x", -75)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .text("1,000 Tons");




// Define Tooltips
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
var worldAreaTip = d3.tip().attr("class", "tooltip").html(function(d){ return d.name; });
worldAreaSvg.call(worldAreaTip);




// Declare data variables
var worldLineData;
var worldAreaData;
var worldAreaProductMax;
var worldMapData;
var worldMapColorDomain;
var selectedCountries = [];




// Begin initial data processing and visualization rendering
loadData();




// Load Data
function loadData() {
    initializeWorldYearSlider();

    loadWorldLineData();
}


// Load CSV file
function loadWorldLineData() {
    //d3.csv("data/worldLineData.csv", function(error, csv) {
    d3.csv("data/worldChartData.csv", function(error, csv) {
        csv.forEach(function(d){
            // Convert numeric values to 'numbers'
            d.Year = +d.Year;
            d.Value = +d.Value;
        });

        worldLineData = csv;


        worldAreaData = csv.filter(function(d){
            return d.Category == "Waste";
        });
        worldAreaCategoryScale.domain(["Cereals - Excluding Beer", "Starchy Roots", "Vegetables", "Fruits - Excluding Wine", "Sugar Crops", "Oilcrops", "Vegetable Oils", "Pulses", "Treenuts", "Alcoholic Beverages"]);
        worldAreaCategoryScaleFullDomain = worldAreaCategoryScale.domain();
        worldAreaCategoryScaleFull.domain(worldAreaCategoryScaleFullDomain);

        worldMapData = csv.filter(function(d){
            return d.Category == "Waste";
        });


        // Daisy Chain loading of next data set
        loadWorldMapData()
    });
}

function loadWorldMapData() {
    queue()
        .defer(d3.json, "data/countries.topo.json")
        .await(function(error, map){
            // Store Geo Data
            geodata = map;


            // End of chain; Draw the visualizations for the first time
            updateVisualization();
        });
}



// Render visualization
function updateVisualization() {
    //Update Data

    // Declare temp variables to hold filtered data
    var tempWorldLineData;
    var tempWorldAreaData;
    var tempWorldMapData;
    var tempWorldMapDataArray = [];
    var tempWorldMapMaxWaste = 0;




    // Country Filtering
    //selectedCountries = [];

    console.log(selectedCountries);
    if(selectedCountries.length > 0){
        tempWorldLineData = worldLineData.filter(function(d){
            return selectedCountries.indexOf(d.CountryCode) >= 0;
        });
        tempWorldAreaData = worldAreaData.filter(function(d){
            return selectedCountries.indexOf(d.CountryCode) >= 0;
        });
    } else {
        tempWorldLineData = worldLineData;
        tempWorldAreaData = worldAreaData;
    }



    // Year Filtering
    var yearSelectionMin = $("#yearRangeSelector").slider( "values", 0 );
    var yearSelectionMax = $("#yearRangeSelector").slider( "values", 1 );


    tempWorldLineData = tempWorldLineData.filter(function(d){
        return d.Year >= yearSelectionMin && d.Year <= yearSelectionMax;
    });

    tempWorldAreaData = tempWorldAreaData.filter(function(d){
        return d.Year >= yearSelectionMin && d.Year <= yearSelectionMax;
    });

    tempWorldMapData = worldMapData.filter(function(d){
        return d.Year >= yearSelectionMin && d.Year <= yearSelectionMax;
    });




    // Product Filtering
    var productSelection = d3.select("#productValues").property("value");
    var productSelectionClass = productSelection.replace(/\s+/g, '');

    // Reset Area data
    worldAreaSvg.selectAll(".worldAreaProduct:not(."+productSelectionClass+")").remove();
    worldAreaCategoryScale.domain(worldAreaCategoryScaleFullDomain);
    worldAreaProductMax = 0;

    // Filter by user selection if necessary
    if(productSelection != "All"){
        tempWorldLineData = tempWorldLineData.filter(function(d){
            return d.Type == productSelection || d.Type == "Total";
        });

        tempWorldAreaData = tempWorldAreaData.filter(function(d){
            return d.Type == productSelection;
        });
        worldAreaCategoryScale.domain(worldAreaCategoryScale.domain().filter(function(d) {if(d == productSelection){return d;}}));

        tempWorldMapData = tempWorldMapData.filter(function(d){
            return d.Type == productSelection;
        });
    }




    // Aggregation
    tempWorldLineData = d3.nest()
        .key(function(d){
            return d.Category;
        })
        .rollup(function(d){
            return d3.mean(d, function(g){
                if(g.Value > -1) {
                    return g.Value;
                }
            });
        }).entries(tempWorldLineData);
    tempWorldLineData.forEach(function(d) {
        d.Country = "World";
        d.Category = d.key;
        if(d.key == "Waste"){
            d.Value = d.values/100;
        } else {
            d.Value = d.values;
        }
    });

    tempWorldAreaData = d3.nest()
        .key(function(d){
            return d.Year;
        })
        .key(function(d){
            return d.Type;
        })
        .rollup(function(d){
            return d3.sum(d, function(g){
                if(g.Value > -1) {
                    return g.Value;
                }
            });
        }).entries(tempWorldAreaData);


    tempWorldMapData = d3.nest()
        .key(function(d){
            return d.CountryCode;
        })
        .rollup(function(d){
            return d3.mean(d, function(g){
                if(g.Value > -1) {
                    return g.Value;
                }
            });
        }).entries(tempWorldMapData);
    tempWorldMapData.forEach(function(d) {
        tempWorldMapDataArray[d.key] = d.values;
        if(d.values > tempWorldMapMaxWaste){
            tempWorldMapMaxWaste = d.values;
        }
    });



    // Update Visualization

    // Update scales
    worldLineXScale.domain(["Expense", "Income", "Waste"]);
    worldLineYDollarScale.domain([0 ,d3.max(tempWorldLineData, function(d) {
        return d.Value;
    })]);
    worldLineYTonScale.domain([0 ,d3.max(tempWorldLineData, function(d) {
        return d.Value;
    })]);

    worldAreaXScale.domain(d3.extent(tempWorldAreaData, function(d) { return d.key; }));

    worldMapColorDomain = [0,(tempWorldMapMaxWaste/4),(tempWorldMapMaxWaste/2),(3*tempWorldMapMaxWaste/4),tempWorldMapMaxWaste];
    worldMapColorScale.domain(worldMapColorDomain);




    // Update Visualization Proper
    /*
    worldLineLine
        .defined(function(d){return d.Value;})
        .x(function(d) {
            return worldLineXScale(d.Category);
        })
        .y(function(d) {
            return worldLineYDollarScale(d.Value);
        });

    worldLinePath
        .datum(tempWorldLineData)
        .transition()
        .duration(800)
        .attr("d", worldLineLine);
    */

    var worldLineLine = worldLineSvg.selectAll("rect")
        .data(tempWorldLineData);

    // Enter (initialize the newly added elements)
    worldLineLine.enter().append("rect")
        .attr("class", "bar")
        .style("fill", function(d){
            if(d.Category == "Waste"){
                return "#4d0000";
            } else {
                return "#de2d26";
            }
        });

    // Update (set the dynamic properties of the elements)
    worldLineLine
        .transition()
        .duration(1000)
        .attr("x", function(d){
            return worldLineXScale(d.Category);
        })
        .attr("y", function(d){
            return worldLineYDollarScale(d.Value);
        })
        .attr("width", worldLineXScale.rangeBand())
        .attr("height", function(d)
        {
            return worldLineHeight - worldLineYDollarScale(d.Value);
        });

    // Exit
    worldLineLine.exit().remove();

    tempWorldAreaData = worldAreaStack(worldAreaCategoryScale.domain().map(function(name) {

        return {
            name: name,
            values: tempWorldAreaData.map(function(d) {
                return {date: d.key, y: d.values[d.values.map(function(f){ return f.key; }).indexOf(name)].values/1000};
            })
        };
    }));
    tempWorldAreaData[tempWorldAreaData.length - 1].values.forEach(function(d) {
        if(d.y0 + d.y > worldAreaProductMax) {
            worldAreaProductMax = d.y0 + d.y;
        }
    });
    worldAreaYScale.domain([0,worldAreaProductMax]);
    var worldAreaProduct = worldAreaSvg.selectAll(".worldAreaProduct")
        .data(tempWorldAreaData)
        .enter().append("g")
        .attr("class", "worldAreaProduct")
        .on("mouseover", worldAreaTip.show)
        .on("mouseout", worldAreaTip.hide);

    worldAreaProduct.append("path")
        .attr("class", function(d) {
            var nameClass = d.name.replace(/\s+/g, '');
            return "area " + nameClass;
        })
        .style("fill", function(d) { return worldAreaCategoryScaleFull(d.name); })
        .transition()
        .duration(800)
        .attr("d", function(d) {
            return worldAreaArea(d.values);
        });


    g = worldMapSvg.append("g");
    worldMapSvg.selectAll("path").remove();
    g.selectAll("path")
        .data(topojson.feature(geodata,geodata.objects.subunits).features)
        .enter()
        .append("path")
        .attr("d", worldMapPath)
        .attr("countrycode", function(d){
            return d.id;
        })
        .style("fill", function(d) {

            // --> CHECK IF DATA IS A VALID NUMBER
            if(isNaN(tempWorldMapDataArray[d.id])==true) {
                return "#ccc";
            } else {
                return worldMapColorScale(tempWorldMapDataArray[d.id]);
            }
        })
        .style("stroke-width", function(d){
            if(selectedCountries.indexOf(d.id) >= 0){
                return "2px";
            } else {
                return "0.5px";
            }
        })
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", 0.8);
            div.transition().duration(300)
                .style("opacity", 1);

            // --> CHECK IF DATA IS AVAILABLE
            if(isNaN(tempWorldMapDataArray[d.id])==true) {
                div.text("No Data")
            }
            else{
                div.text(d.properties.name + " : " + commaFormat(Math.round(tempWorldMapDataArray[d.id])) + " tons")
            }

            div.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 1);
            div.transition().duration(300)
                .style("opacity", 0);
        })
        .on("click", function() {
            d3.select(this).transition().duration(300).style("stroke-width", "2px");

            var tempCountry = d3.select(this);


            var selectedCountry = selectedCountries.indexOf(tempCountry.attr("countrycode"));
            console.log(selectedCountry);
            if(selectedCountry >= 0){
                selectedCountries.splice(selectedCountry, 1);
                console.log("Remove");
                console.log(tempCountry);
            } else {
                selectedCountries.push(tempCountry.attr("countrycode"));
                console.log("Add");
                console.log(tempCountry);
            }

            updateVisualization();
        })
    ;




    // Update Axes Scales
    worldLineXAxis.scale(worldLineXScale);
    worldLineYAxis.scale(worldLineYDollarScale);
    worldLineYTonAxis.scale(worldLineYTonScale);

    worldAreaXAxis.scale(worldAreaXScale);
    worldAreaYAxis.scale(worldAreaYScale);




    // Update Axes/Legends
    worldLineXAxisGroup.transition().duration(800).call(worldLineXAxis);
    worldLineYAxisGroup.transition().duration(800).call(worldLineYAxis);
    worldLineYTonAxisGroup.transition().duration(800).call(worldLineYTonAxis);

    worldAreaXAxisGroup.transition().duration(800).call(worldAreaXAxis);
    worldAreaYAxisGroup.transition().duration(800).call(worldAreaYAxis);

    worldMapSvg.selectAll("g.legend").remove();
    var worldMaplegend = worldMapSvg.selectAll("g.legend")
        .data(worldMapColorDomain)
        .enter().append("g")
        .attr("class", "legend");
    var width2 = 25, height2 = 25;
    worldMaplegend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return worldMapHeight - (i*height2) - 2*height2;})
        .attr("width", width2)
        .attr("height", height2)
        .style("fill", function(d, i) { return worldMapColorScale(d);
        })
        .style("opacity", 0.8);
    worldMaplegend.append("text")
        .attr("x", 55)
        .attr("y", function(d, i){ return worldMapHeight - (i*height2) - height2 - 8;})
        .text(function(d, i){ return commaFormat(Math.round(worldMapColorDomain[i])) + " tons"; });
}







// Enable Year Selector
function initializeWorldYearSlider() {
    $( "#yearRangeSelector" ).slider({
        range: true,
        min: 2000,
        max: 2011,
        values: [ 2000, 2011 ],
        slide: function( event, ui ) {
            $( "#yearRangeValues" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            updateVisualization();
        }
    });
    $( "#yearRangeValues" ).val( $( "#yearRangeSelector" ).slider( "values", 0 ) +
        " - " + $( "#yearRangeSelector" ).slider( "values", 1 ) );
}




function zoomed() {
    worldMapProjection.translate(d3.event.translate).scale(d3.event.scale);
    g.selectAll("path").attr("d", worldMapPath);
}