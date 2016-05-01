/*
 * *******************************************************************************************************
 *
 * GLOBAL OPERATIONS
 *
 * *******************************************************************************************************
 * */

/*
 * #######################################################################################################

 1) Create SVG drawing area

 * #######################################################################################################
 * */

var margin = {top: 20, right: 170, bottom: 20, left: 0},
    width = 800 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;


var svg = d3.select("#massMapm").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin", "10px auto");

/*
 * #######################################################################################################

 2) Create tooltip

 * #######################################################################################################
 * */

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/*
 * #######################################################################################################

 3) Set color domains for legend

 * #######################################################################################################
 * */

var color = d3.scale.threshold()
    .range(["#edf8e9","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]);



/*
 * #######################################################################################################

 4) Create geo projection and geo path

 * #######################################################################################################
 * */

var projection = d3.geo.mercator()
    .center([-69.7,42])
    .scale(7500)
    .rotate([0,0]);

var path = d3.geo.path()
    .projection(projection);

/*
 * #######################################################################################################

 5) Create global arrays and variables for data and maxima of data. Set maxima to zero.

 * #######################################################################################################
 * */


// --> GLOBAL ARRAYS

var WasteByCode = {};
var WasteByZipCode = {};
var F_WasteByZip= {};
var W_WasteByZip= {};
var IH_WasteByZip= {};
var IS_WasteByZip= {};
var IC_WasteByZip= {};
var IP_WasteByZip= {};
var C_WasteByZip= {};
var G_WasteByZip= {};
var R_WasteByZip= {};

// --> GLOBAL VARIABLES

var dataCollection;
var maxCollection;
var colorDomainCollection;
var labelCollection;
var massGeodata;

// --> SET GLOBAL MAXIMA VARIABLES TO ZERO

var maxWaste=0;
var F_maxWaste=0;
var W_maxWaste=0;
var IH_maxWaste=0;
var IS_maxWaste=0;
var IC_maxWaste=0;
var IP_maxWaste=0;
var C_maxWaste=0;
var G_maxWaste=0;
var R_maxWaste=0;

/*
 * #######################################################################################################

 6) Load data

 * #######################################################################################################
 * */

loadData();



/*
* *******************************************************************************************************
*
* LOADING + PROCESSING OF DATA
*
*
* *******************************************************************************************************
* */




function loadData() {

/*
* #######################################################################################################

1) Load Data

* #######################################################################################################
* */

    queue()
        .defer(d3.json, "data/ma.topo.json")
        .defer(d3.csv, "data/Mass_Waste_Data.csv")
        .defer(d3.csv, "data/zipcode.csv")
        .await(function(error, map, data1, data2){

/*
 * #######################################################################################################

2) Store Waste Data

* #######################################################################################################
* */


            data2.forEach(function(d2){

                WasteByZipCode[d2.zip]=0;
                F_WasteByZip[d2.zip]=0;
                W_WasteByZip[d2.zip]=0;
                IH_WasteByZip[d2.zip]=0;
                IS_WasteByZip[d2.zip]=0;
                IC_WasteByZip[d2.zip]=0;
                IP_WasteByZip[d2.zip]=0;
                C_WasteByZip[d2.zip]=0;
                G_WasteByZip[d2.zip]=0;
                R_WasteByZip[d2.zip]=0;


            data1.forEach(function(d1) {

                WasteByCode[d1.Code]= +d1.Waste;

                if(d2.zip==d1.ZipCode)
                {
                    WasteByZipCode[d2.zip]+=WasteByCode[d1.Code];
                };

                if ((d1.Type=="F")&&(d2.zip == d1.ZipCode)) {
                    F_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="W")&&(d2.zip == d1.ZipCode)) {
                    W_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="IH")&&(d2.zip == d1.ZipCode)) {
                    IH_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="IS")&&(d2.zip == d1.ZipCode)) {
                    IS_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="IC")&&(d2.zip == d1.ZipCode)) {
                    IC_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="IP")&&(d2.zip == d1.ZipCode)) {
                    IP_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="C")&&(d2.zip == d1.ZipCode)) {
                    C_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="G")&&(d2.zip == d1.ZipCode)) {
                    G_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };

                if ((d1.Type=="R")&&(d2.zip == d1.ZipCode)) {
                    R_WasteByZip[d2.zip] += WasteByCode[d1.Code];
                };




 /*
 * #######################################################################################################

3) Find maxima

* #######################################################################################################
* */


            });


                if((WasteByZipCode[d2.zip]>maxWaste)&&(isNaN(WasteByZipCode[d2.zip])==false))
                {
                    maxWaste=WasteByZipCode[d2.zip];
                };


                if((F_WasteByZip[d2.zip]>F_maxWaste)&&(isNaN(F_WasteByZip[d2.zip])==false))
                {
                    F_maxWaste=F_WasteByZip[d2.zip];
                };

                if((W_WasteByZip[d2.zip]>W_maxWaste)&&(isNaN(W_WasteByZip[d2.zip])==false))
                {
                    W_maxWaste=W_WasteByZip[d2.zip];
                };

                if((IH_WasteByZip[d2.zip]>IH_maxWaste)&&(isNaN(IH_WasteByZip[d2.zip])==false))
                {
                    IH_maxWaste=IH_WasteByZip[d2.zip];
                };

                if((IS_WasteByZip[d2.zip]>IS_maxWaste)&&(isNaN(IS_WasteByZip[d2.zip])==false))
                {
                    IS_maxWaste=IS_WasteByZip[d2.zip];
                };

                if((IC_WasteByZip[d2.zip]>IC_maxWaste)&&(isNaN(IC_WasteByZip[d2.zip])==false))
                {
                    IC_maxWaste=IC_WasteByZip[d2.zip];
                };

                if((IP_WasteByZip[d2.zip]>IP_maxWaste)&&(isNaN(IP_WasteByZip[d2.zip])==false))
                {
                    IP_maxWaste=IP_WasteByZip[d2.zip];
                };

                if((C_WasteByZip[d2.zip]>C_maxWaste)&&(isNaN(C_WasteByZip[d2.zip])==false))
                {
                    C_maxWaste=C_WasteByZip[d2.zip];
                };

                if((G_WasteByZip[d2.zip]>G_maxWaste)&&(isNaN(G_WasteByZip[d2.zip])==false))
                {
                    G_maxWaste=G_WasteByZip[d2.zip];
                };

                if((R_WasteByZip[d2.zip]>R_maxWaste)&&(isNaN(R_WasteByZip[d2.zip])==false))
                {
                    R_maxWaste=R_WasteByZip[d2.zip];
                };



            });






/*
* #######################################################################################################

4) Arrange in Collections

* #######################################################################################################
* */






            dataCollection = {
                Waste: WasteByZipCode,
                F: F_WasteByZip,
                W: W_WasteByZip,
                IH: IH_WasteByZip,
                IS: IS_WasteByZip,
                IC: IC_WasteByZip,
                IP: IP_WasteByZip,
                C: C_WasteByZip,
                G: G_WasteByZip,
                R: R_WasteByZip
            };


            maxCollection = {
                MaxWaste: maxWaste,
                FMaxWaste: F_maxWaste,
                WMaxWaste: W_maxWaste,
                IHMaxWaste: IH_maxWaste,
                ISMaxWaste: IS_maxWaste,
                ICMaxWaste: IC_maxWaste,
                IPMaxWaste: IP_maxWaste,
                CMaxWaste: C_maxWaste,
                GMaxWaste: G_maxWaste,
                RMaxWaste: R_maxWaste,
            };

            colorDomainCollection = {
                Waste: [0,(maxCollection['MaxWaste']/4),(maxCollection['MaxWaste']/2),(3*maxCollection['MaxWaste']/4),maxCollection['MaxWaste']],
                F: [0,(maxCollection['FMaxWaste']/4),(maxCollection['FMaxWaste']/2),(3*maxCollection['FMaxWaste']/4),maxCollection['FMaxWaste']],
                W: [0,(maxCollection['WMaxWaste']/4),(maxCollection['WMaxWaste']/2),(3*maxCollection['WMaxWaste']/4),maxCollection['WMaxWaste']],
                IH: [0,(maxCollection['IHMaxWaste']/4),(maxCollection['IHMaxWaste']/2),(3*maxCollection['IHMaxWaste']/4),maxCollection['IHMaxWaste']],
                IS: [0,(maxCollection['ISMaxWaste']/4),(maxCollection['ISMaxWaste']/2),(3*maxCollection['ISMaxWaste']/4),maxCollection['ISMaxWaste']],
                IC: [0,(maxCollection['ICMaxWaste']/4),(maxCollection['ICMaxWaste']/2),(3*maxCollection['ICMaxWaste']/4),maxCollection['ICMaxWaste']],
                IP: [0,(maxCollection['IPMaxWaste']/4),(maxCollection['IPMaxWaste']/2),(3*maxCollection['IPMaxWaste']/4),maxCollection['IPMaxWaste']],
                C: [0,(maxCollection['CMaxWaste']/4),(maxCollection['CMaxWaste']/2),(3*maxCollection['CMaxWaste']/4),maxCollection['CMaxWaste']],
                G: [0,(maxCollection['GMaxWaste']/4),(maxCollection['GMaxWaste']/2),(3*maxCollection['GMaxWaste']/4),maxCollection['GMaxWaste']],
                R: [0,(maxCollection['RMaxWaste']/4),(maxCollection['RMaxWaste']/2),(3*maxCollection['RMaxWaste']/4),maxCollection['RMaxWaste']]

            };

            labelCollection = {
                Waste: [0,(maxCollection['MaxWaste']/4).toPrecision(4),(maxCollection['MaxWaste']/2).toPrecision(4),(3*maxCollection['MaxWaste']/4).toPrecision(4),maxCollection['MaxWaste'].toPrecision(4)],
                F: [0,(maxCollection['FMaxWaste']/4).toPrecision(4),(maxCollection['FMaxWaste']/2).toPrecision(4),(3*maxCollection['FMaxWaste']/4).toPrecision(4),maxCollection['FMaxWaste'].toPrecision(4)],
                W: [0,(maxCollection['WMaxWaste']/4).toPrecision(4),(maxCollection['WMaxWaste']/2).toPrecision(4),(3*maxCollection['WMaxWaste']/4).toPrecision(4),maxCollection['WMaxWaste'].toPrecision(4)],
                IH: [0,(maxCollection['IHMaxWaste']/4).toPrecision(4),(maxCollection['IHMaxWaste']/2).toPrecision(4),(3*maxCollection['IHMaxWaste']/4).toPrecision(4),maxCollection['IHMaxWaste'].toPrecision(4)],
                IS: [0,(maxCollection['ISMaxWaste']/4).toPrecision(4),(maxCollection['ISMaxWaste']/2).toPrecision(4),(3*maxCollection['ISMaxWaste']/4).toPrecision(4),maxCollection['ISMaxWaste'].toPrecision(4)],
                IC: [0,(maxCollection['ICMaxWaste']/4).toPrecision(4),(maxCollection['ICMaxWaste']/2).toPrecision(4),(3*maxCollection['ICMaxWaste']/4).toPrecision(4),maxCollection['ICMaxWaste'].toPrecision(4)],
                IP: [0,(maxCollection['IPMaxWaste']/4).toPrecision(4),(maxCollection['IPMaxWaste']/2).toPrecision(4),(3*maxCollection['IPMaxWaste']/4).toPrecision(4),maxCollection['IPMaxWaste'].toPrecision(4)],
                C: [0,(maxCollection['CMaxWaste']/4).toPrecision(4),(maxCollection['CMaxWaste']/2).toPrecision(4),(3*maxCollection['CMaxWaste']/4).toPrecision(4),maxCollection['CMaxWaste'].toPrecision(4)],
                G: [0,(maxCollection['GMaxWaste']/4).toPrecision(4),(maxCollection['GMaxWaste']/2).toPrecision(4),(3*maxCollection['GMaxWaste']/4).toPrecision(4),maxCollection['GMaxWaste'].toPrecision(4)],
                R: [0,(maxCollection['RMaxWaste']/4).toPrecision(4),(maxCollection['RMaxWaste']/2).toPrecision(4),(3*maxCollection['RMaxWaste']/4).toPrecision(4),maxCollection['RMaxWaste'].toPrecision(4)]
            };


 /*
* #######################################################################################################

5) Store Geo Data

* #######################################################################################################
 * */


            massGeodata = map;

/*
 * #######################################################################################################

6) Draw Visualization for the first time

 * #######################################################################################################
* */






            // --> UPDATE VISUALIZATION

            updateLocalVisualization("Waste");



            // --> UPDATE VISUALIZATION ACCORDING TO CHOICE OF THE USER


            d3.select("#selector").on("change",
                function() {
                    var Choice = d3.select("#selector").property("value");
                    updateLocalVisualization(Choice);
                }
            );


        });


}

/*
 * *******************************************************************************************************
 *
 * UPDATING THE VISUALIZATION
 *
 * 1) Define color domain for selected option (i.e. the chosen year)
 * 2) Define group for the world map
 * 3) Remove old world map before drawing a new one
 * 4) Draw world map
 * 5) Add Tooltips on mouseover
 * 6) Remove old legend before drawing a new one
 * 7) Draw legend
 *
 *
 * *******************************************************************************************************
 * */

    

function updateLocalVisualization(option) {

/*
 * #######################################################################################################

1) Define color domain for selected option (i.e. the chosen year)

* #######################################################################################################
* */


    color.domain(colorDomainCollection[option]);

 /*
* #######################################################################################################

2) Define group for the world map

* #######################################################################################################
* */

    var g = svg.append("g");

/*
* #######################################################################################################

3) Remove old world map before drawing a new one

* #######################################################################################################
* */


    svg.selectAll("path").remove();

/*
* #######################################################################################################

4) Draw world map

* #######################################################################################################
* */




    g.selectAll("path")
        .data(topojson.feature(massGeodata, massGeodata.objects.ma).features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {

          // --> CHECK IF DATA IS A VALID NUMBER

            if(dataCollection[option][d.properties.zip]==0)
            {
                return "#ccc";

            }

            else{

            return color(WasteByZipCode[d.properties.zip]);

            }
        })

/*
* #######################################################################################################

5) Add tooltips on mouseover

* #######################################################################################################
* */

        .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", 1);
            div.transition().duration(300)
                .style("opacity", 1);

            // --> CHECK IF DATA IS AVAILABLE

            if(dataCollection[option][d.properties.zip]==0) {
                div.text("No Data")
            }
            else{
                div.text(commaFormat(dataCollection[option][d.properties.zip].toPrecision(4)) + " tons")
            }

             div.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(300)
                .style("opacity", 0.8);
            div.transition().duration(300)
                .style("opacity", 0);
        })
    ;


/*
* #######################################################################################################

6) Remove old legend before drawing a new one

* #######################################################################################################
 * */

    svg.selectAll("g.legend").remove();


/*
* #######################################################################################################

7) Draw legend

* #######################################################################################################
* */


    var legend = svg.selectAll("g.legend")
        .data(colorDomainCollection[option])
        .enter().append("g")
        .attr("class", "legend");

    var width2 = 25, height2 = 25;

    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return height - (i*height2) - 2*height2-20;})
        .attr("width", width2)
        .attr("height", height2)
        .style("fill", function(d, i) { return color(d);
        })
        .style("opacity", 0.8);

    legend.append("text")
        .attr("x", 55)
        .attr("y", function(d, i){ return height - (i*height2) - height2-28;})
        .text(function(d, i){ return commaFormat(labelCollection[option][i])+ " tons";
        });
}
