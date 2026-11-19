// Lab 7: Geomaps
// Activity 2 - Step 2.1: Download and Prepare Data

Promise.all([
  d3.json("./topo.json"),
  d3.csv("./cities.csv"),
  d3.csv("./states.csv")
]).then((data) => {

  // Extract the datasets
  const topology = data[0];
  const cities = data[1];
  const states = data[2];

  // Convert TopoJSON into GeoJSON
  const topo = topojson.feature(
    topology,
    topology.objects.states
  );

  // Create a dictionary of state populations
  const stateDictionary = new Map();

  states.forEach((state) => {
    stateDictionary.set(
      state.State,
      +String(state["2018 Population"]).replace(/,/g, "")
    );
  });

  // Display the loaded data
  console.log("GeoJSON:", topo);
  console.log("Cities:", cities);
  console.log("States:", states);
  console.log("State Population Dictionary:", stateDictionary);

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

}).catch((error) => {
  console.error("Error loading data:", error);
});
