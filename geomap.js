// Lab 7: Geomaps
// Activity 1 - Step 1.1: Load and Prepare the Data

d3.json("./topo.json").then((data) => {

  // Display the original TopoJSON data
  console.log("Original TopoJSON:", data);

  // Convert TopoJSON into GeoJSON features
  const topo = topojson.feature(data, data.objects.states);

  // Display the converted GeoJSON data
  console.log("Converted GeoJSON:", topo);

})