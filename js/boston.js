// Define SVG Sizes
var bostonMapWidth = col12Width;
var bostonMapHeight = col12Height;

// Append SVGs
var bostonMapSvg = d3.select("#bostonMap").append("svg")
    .attr("width", bostonMapWidth)
    .attr("height", bostonMapHeight)
    .style("margin", "10px auto");

// Define Scales
var bostonMapColorScale = d3.scale.threshold()
    .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);

// Initial chart path descriptions
var bostonMapProjection = d3.geo.mercator()
    .center([0,0])
    .scale(120)
    .rotate([0,0]);

var bostonMapPath = d3.geo.path()
    .projection(bostonMapProjection);

// Declare data variables
var bostonMapColorDomain;
var bostonGeodata;




// Begin initial data processing and visualization rendering
loadBostonMapData();




// Load CSV file
function loadBostonMapData() {
    queue()
        .defer(d3.json, "data/boston.topo.json")
        .await(function(error, map){
            // Store Geo Data
            bostonGeodata = map;


            // Draw the visualizations for the first time
            updateBostonVisualization();
        });
}




// Render visualization
function updateBostonVisualization() {
    //Update Data

    // Declare temp variables to hold filtered data
    var tempWorldMapData;

    var bostonGroup = bostonMapSvg.append("g");
    bostonMapSvg.selectAll("path").remove();
    bostonGroup.selectAll("path")
        .data(topojson.feature(bostonGeodata,bostonGeodata.objects.Bos_neighborhoods_new).features)
        .enter()
        .append("path")
        .attr("d", bostonMapPath)
        .style("fill", function(d) {

            // --> CHECK IF DATA IS A VALID NUMBER
            //if(isNaN(tempWorldMapDataArray[d.id])==true) {
                return "#ccc";
            //} else {
            //    return worldMapColorScale(tempWorldMapDataArray[d.id]);
            //}
        })
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", 0.8);
            div.transition().duration(300)
                .style("opacity", 1);

            // --> CHECK IF DATA IS AVAILABLE
           // if(isNaN(tempWorldMapDataArray[d.id])==true) {
           //     div.text("No Data")
            //}
            //else{
            //    div.text(d.properties.name + " : " + tempWorldMapDataArray[d.id])
            //}

            //div.style("left", (d3.event.pageX) + "px")
             //   .style("top", (d3.event.pageY -30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 1);
            div.transition().duration(300)
                .style("opacity", 0);
        })
    ;
}