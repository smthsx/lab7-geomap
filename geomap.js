
// Lab 7: Geomaps
// Activity 1 - Step 1.2: Create the US Map

d3.json("./topo.json").then((data) => {

  // Convert TopoJSON into GeoJSON
  const topo = topojson.feature(data, data.objects.states);

  console.log("Converted GeoJSON:", topo);

  // Create the Albers USA projection
  var projection = d3.geoAlbersUsa()
    .scale(700)
    .translate([487.5, 305]);

  // Create the geographic path generator
  var path = d3.geoPath(projection);

  // Select the SVG and create a group
  const svg = d3.select("#geomap")
    .append("g")
    .attr("transform", "translate(50,50)");

  // Draw the US states
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", path)
    .attr("fill", "whitesmoke")
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

});
