var po = org.polymaps;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({"lat" : -33.9518, "lon" : 18.4868})
    .zoom(14)
    .add(po.interact())
    .add(po.hash())

var url = "http://spaceclaw.stamen.com/toner/{Z}/{X}/{Y}.png";
map.add(po.image()
    .url(po.url(url)));

map.add(po.geoJson()
    .url("mowbray.json")
    .id("crime")
    .on("load", setFeatures)
)

map.add(po.geoJson() 
    .url("http://tilestache/subplaces/{Z}/{X}/{Y}.geojson")
    .id("subplaces")
    .on("load", loadSubplaces)
);

map.add(po.compass().pan("none"))

function loadSubplaces(e) {
    e.features.map(function(feature) {
        var data = feature.data.properties;
        d3.select(feature.element)
            .data([data])
            .attr("title", data["SP_NAME"])
            .attr("data-content", function(el) {
                console.log(el);
                return "<dl>"
                    + "<dt>Code:</dt><dd>" + el["sp_code"] + "</dd>"
                    + "<dt>Name:</dt><dd>" + el["sp_name"] + "</dd>"
                    + "</dl>"
            })
            .each(function(el) {
                $(this).popover({
                    trigger : "hover"
                })
            });
    });
}

function setFeatures(e){
  for (var i = 0; i < e.features.length; i++) {
    var feature = e.features[i];
    var data = feature.data.properties;

    if (feature.data.properties["Description"].toLowerCase().indexOf("car theft") > -1) {
        d3.select(feature.element).classed("crime_cartheft", true);
    } else if (feature.data.properties["Description"].toLowerCase().indexOf("car break-in") > -1) {
        d3.select(feature.element).classed("crime_carbreakin", true);
    } else if (feature.data.properties["Description"].toLowerCase().indexOf("house break-in") > -1) {
        d3.select(feature.element).classed("crime_housebreakin", true);
    } else if (feature.data.properties["Description"].toLowerCase().indexOf("burglary") > -1) {
        d3.select(feature.element).classed("crime_housebreakin", true);
    } else {
        d3.select(feature.element).classed("crime_other", true);
    }

    d3.select(feature.element)
        .data([data])
        .classed("crime_circle", true)
        .attr("r", "10")
        .attr("title", data["Description"])
        .attr("data-content", function(el) {
            return "<dl>"
                + "<dt>Date</dt><dd>" + data["Date"] + "</dd>"
                + "<dt>Time of Day</dt><dd>" + data["Night/Day"] + "</dd>"
                + "<dt>Address</dt><dd>" + data["Address"] + "</dd>"
                + "<dt>Description</dt><dd>" + data["Details"] + "</dd>"
                + "</dl>";
        })
        .each(function(el) {
            $(this).popover({
                trigger : "hover"
            })
        });
  }
}
