
// Lab 7: Geomaps
// Activity 2 - Step 2.2: Color States by Population

Promise.all([
  d3.json("./topo.json"),
  d3.csv("./cities.csv"),
  d3.csv("./states.csv")
]).then((data) => {

  // Extract the three datasets
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

  // Get the minimum and maximum populations
  const populationExtent = d3.extent(
    Array.from(stateDictionary.values())
      .filter(Number.isFinite)
  );

  console.log("Population Extent:", populationExtent);

  // Create the sequential blue color scale
  var blues = d3.scaleSequential()
    .domain(populationExtent)
    .range(["white", "steelblue"]);

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

  // Draw and color the US states
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => {
      const population = stateDictionary.get(
        d.properties.name
      );

      return Number.isFinite(population)
        ? blues(population)
        : "whitesmoke";
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

}).catch((error) => {
  console.error("Error loading data:", error);
});
