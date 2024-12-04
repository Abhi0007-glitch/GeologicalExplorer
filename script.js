// script.js

//  geological regions on the map
document.getElementById('map-container').innerHTML = `
  <svg width="100%" height="100%" viewBox="0 0 100 50">
    <rect width="100" height="50" fill="#87ceeb" />
    <circle cx="50" cy="25" r="10" fill="#6a5acd" />
  </svg>
`;

// Rock identification logic
function identifyRock() {
  const color = document.getElementById('color').value.toLowerCase();
  const texture = document.getElementById('texture').value.toLowerCase();

  let result = "Rock not found!";
  if (color === "gray" && texture === "smooth") {
    result = "Possible Match: Slate";
  } else if (color === "white" && texture === "grainy") {
    result = "Possible Match: Quartzite";
  } else if (color === "pink" && texture === "grainy") {
    result = "Possible Match: Granite";
  } else if (color === "dark" && texture === "rough") {
    result = "Possible Match: Basalt";
  } else if (color === "light" && texture === "chalky") {
    result = "Possible Match: Limestone";
  }

  document.getElementById('result').textContent = result;
}
document.querySelector('button').addEventListener('click', identifyRock);

//  Display Earth layers
document.getElementById('earth-view').innerHTML = `
  <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
    <div style="background: #ff7043; width: 30px; height: 30px; border-radius: 50%;"></div>
    <div style="background: #ffa726; width: 50px; height: 50px; border-radius: 50%; margin: -10px;"></div>
    <div style="background: #ffd54f; width: 80px; height: 80px; border-radius: 50%; margin: -15px;"></div>
  </div>
`

const map = L.map('map-container').setView([20, 77], 5); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

//  container dimensions
const earthView = document.getElementById('earth-view');
const width = earthView.offsetWidth || 500; 
const height = earthView.offsetHeight || 500; 

// Initialize Three.js components
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
earthView.appendChild(renderer.domElement);

// rotating sphere (Earth
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x0077be,
  wireframe: false,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Add light to the scene
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Position the camera
camera.position.z = 15;

// Rotation animation
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01; 
  renderer.render(scene, camera);
}



animate();

console.log("Three.js rendering started...");
console.log("Container dimensions:", width, height);



fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(earthquake => {
      const [lon, lat] = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;

      L.circleMarker([lat, lon], {
        radius: magnitude * 2,
        color: magnitude > 5 ? 'red' : 'orange',
        fillOpacity: 0.7,
      })
        .bindPopup(`Magnitude: ${magnitude}`)
        .addTo(map);
    });
  })
  .catch(err => console.error(err));
