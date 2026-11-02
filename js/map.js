// js/map.js
// Builds an interactive Leaflet map with one marker per warehouse.

// Warehouse details: name, address and [latitude, longitude]
const warehouses = [
  { name: "Cape Town Warehouse", address: "12 Marconi Road, Montague Gardens, Cape Town", coords: [-33.853, 18.526] },
  { name: "Johannesburg Warehouse", address: "8 Steel Road, Chloorkop, Johannesburg", coords: [-26.014, 28.220] }
];

// Create the map inside the <div id="map"> element
const map = L.map("map");

// Add the OpenStreetMap tiles (the visible map image)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker with a popup for each warehouse
const allCoords = [];
warehouses.forEach(function (w) {
  L.marker(w.coords)
    .addTo(map)
    .bindPopup("<strong>" + w.name + "</strong><br>" + w.address);
  allCoords.push(w.coords);
});

// Zoom the map so both markers are visible
map.fitBounds(allCoords, { padding: [50, 50] });