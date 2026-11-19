
// Lab 7: Geomaps
// Activity 2 - Step 2.3: Population Map and State Capitals

Promise.all([
  d3.json("./topo.json"),
  d3.csv("./cities.csv"),
  d3.csv("./states.csv")
]).then(([topology, cities, states]) => {

  // Convert TopoJSON into GeoJSON
  const topo = topojson.feature(
    topology,
    topology.objects.states
  );

  // Normalize state names
  function normalizeName(name) {
    return String(name ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  // Create a dictionary of 2018 state populations
  const stateDictionary = new Map();

  states.forEach((state) => {
    const stateName = normalizeName(state.State);

    const population = Number(
      String(state["2018 Population"])
        .replace(/,/g, "")
        .trim()
    );

    if (stateName && Number.isFinite(population)) {
      stateDictionary.set(stateName, population);
    }
  });

  // Display loaded datasets
  console.log("GeoJSON:", topo);
  console.log("Cities:", cities);
  console.log("States:", states);
  console.log("Population Dictionary:", stateDictionary);

  // Find minimum and maximum populations
  const populationExtent = d3.extent(
    Array.from(stateDictionary.values())
  );

  console.log("Population Extent:", populationExtent);

  // Use a square-root scale to improve color visibility
  // while preserving population order
  const minPopulation = populationExtent[0];
  const maxPopulation = populationExtent[1];

  const blues = d3.scaleSequential()
    .domain([
      Math.sqrt(minPopulation),
      Math.sqrt(maxPopulation)
    ])
    .interpolator(
      d3.interpolateRgb("#D5E8F7", "#175A9E")
    );

  // Get the color for a population value
  function populationColor(population) {
    return blues(Math.sqrt(population));
  }

  // Create the Albers USA projection
  const projection = d3.geoAlbersUsa()
    .scale(700)
    .translate([487.5, 305]);

  // Create the geographic path generator
  const path = d3.geoPath(projection);

  // Select the SVG
  const svg = d3.select("#geomap");

  // Clear previous map elements
  svg.selectAll("*").remove();

  // Create the map group
  const mapGroup = svg.append("g")
    .attr("transform", "translate(50,50)");

  // Track population matches
  const missingStates = [];

  // Draw the states with population-based colors
  mapGroup.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => {

      const stateName = normalizeName(
        d.properties.name
      );

      const population = stateDictionary.get(stateName);

      if (Number.isFinite(population)) {
        return populationColor(population);
      }

      missingStates.push(d.properties.name);

      return "whitesmoke";
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

  // Report missing population records
  console.log(
    "Features without population:",
    missingStates
  );

  // Convert state capital coordinates to map positions
  const capitals = cities
    .map((city) => {

      const longitude = Number(
        city.longitude ?? city.Longitude
      );

      const latitude = Number(
        city.latitude ?? city.Latitude
      );

      if (
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude)
      ) {
        return null;
      }

      const coordinates = projection([
        longitude,
        latitude
      ]);

      if (coordinates === null) {
        return null;
      }

      return {
        ...city,
        coordinates
      };

    })
    .filter((city) => city !== null);

  // Add red circles for state capitals
  mapGroup.append("g")
    .selectAll("circle")
    .data(capitals)
    .join("circle")
    .attr("cx", (d) => d.coordinates[0])
    .attr("cy", (d) => d.coordinates[1])
    .attr("r", 4)
    .attr("fill", "crimson")
    .attr("stroke", "white")
    .attr("stroke-width", 0.7);

  // Display number of capital circles
  console.log("Capital circles:", capitals.length);

  // Display final verification
  console.log(
    "Population records:",
    stateDictionary.size
  );

  console.log(
    "Map features:",
    topo.features.length
  );

}).catch((error) => {
  console.error("Error loading map data:", error);
});
