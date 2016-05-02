// Define SVG Sizes
var bostonMapWidth = col12Width;
var bostonMapHeight = col12Height;

// Append SVGs
var bostonMapSvg = d3.select("#bostonMap").append("svg")
    .attr("width", bostonMapWidth)
    .attr("height", bostonMapHeight)
    .style("margin", "10px auto");

// Define Scales
var bostonMapColorScale = d3.scale.ordinal()
    .domain([0,1,2,3,4,5])
    .range(["#016450", "#02818a", "#3690c0", "#67a9cf", "#a6bddb", "#d0d1e6"]);

// Initial chart path descriptions
var bostonMapProjection = d3.geo.mercator()
    .center([-70.9,42.27])
    .scale(76000)
    .rotate([0,0]);

var bostonMapPath = d3.geo.path()
    .projection(bostonMapProjection);


// Initialize tooltip
var bostonTip = d3.tip().attr("class", "tooltip").html(function(d){ return d[8]; });
bostonMapSvg.call(bostonTip);


// Declare data variables
var bostonMapColorDomain;
var bostonGeodata;
var bostonFoodSites;




// Begin initial data processing and visualization rendering
loadBostonMapData();




// Load CSV file
function loadBostonMapData() {
    queue()
        .defer(d3.json, "data/boston.topo.json")
        .defer(d3.json, "data/foodSites.json")
        .await(function(error, map, sites){
            // Store Geo Data
            bostonGeodata = map;
            bostonFoodSites = sites.data;

            // Draw the visualizations for the first time
            updateBostonVisualization();
        });
}




// Render visualization
function updateBostonVisualization() {

    var bostonGroup = bostonMapSvg.append("g");
    bostonMapSvg.selectAll("path").remove();
    bostonGroup.selectAll("path")
        .data(topojson.feature(bostonGeodata,bostonGeodata.objects.ma).features)
        .enter()
        .append("path")
        .attr("d", bostonMapPath)
        .style("fill", function(d) {
            //return bostonMapColorScale(0);
            return "#f5f5d0"
        })
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", 0.8);
            div.transition().duration(300)
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 1);
            div.transition().duration(300)
                .style("opacity", 0);
        })
    ;


    // Highlight locations
    bostonMapSvg.selectAll("circle")
        .data(bostonFoodSites)
        .enter().append("circle")
        .attr("class", "foodSite")
        .attr("cx", function(d){
            return bostonMapProjection([d[9][2], d[9][1]])[0];
        })
        .attr("cy", function(d){
            return bostonMapProjection([d[9][2], d[9][1]])[1];
        })
        .attr("r", "3")
        .style("fill", function(d){
            return bostonMapColorScale(d[0]%6);
        })
        .style("stroke", "black")
        .on("mouseover", function(d) {
            d3.select(this)
                .transition().duration(300).attr("r", "6");
            bostonTip.show(d);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition().duration(300)
                .attr("r", "3");
            bostonTip.hide(d);
        });
}