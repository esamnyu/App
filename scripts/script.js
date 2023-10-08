document.addEventListener("DOMContentLoaded", function() {
        // Initialize the map
        var map = L.map('map').setView([51.505, -0.09], 13);
    
        // Add a tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        // Add a marker to the map
        var marker = L.marker([51.5, -0.09]).addTo(map);
    
        // Add a popup to the marker
        marker.bindPopup("<b>Hello, this is a Leaflet map!</b>").openPopup();
    });
    