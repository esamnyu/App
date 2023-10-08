window.onload = function() {
        fetch('/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // If the user is logged in, hide the registration form
                document.querySelector('.registration-form').style.display = 'none';
            } else {
                // If the user is not logged in, show the registration form
                document.querySelector('.registration-form').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
       

document.addEventListener("DOMContentLoaded", function() {
        // Map Initialization
        initializeMap();
        
        const messagingPanel = document.querySelector(".messaging-panel");
        document.getElementById("openMessagingBtn").addEventListener("click", function() {
            messagingPanel.classList.toggle("hidden");
        });
        // Other event listeners and DOMContentLoaded related code can go here
    });
    
    // Initialize the Leaflet map
    function initializeMap() {
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://s.tile.openstreetmap.org/z/x/y.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        const marker = L.marker([51.5, -0.09]).addTo(map);
        marker.bindPopup("<b>Hello, this is a Leaflet map!</b>").openPopup();
    }
    
    function submitLoginForm() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle successful login, e.g., redirect or hide the login form
                alert('Login successful!');
            } else {
                // Display error message
                document.getElementById('loginError').textContent = data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function submitRegistrationForm() {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
    
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful!');
            } else {
                document.getElementById('registrationError').textContent = data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    function handleLogout() {
        fetch('/logout', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Logout successful!');
                // Here you can also redirect the user to the login page or handle UI changes for the logged-out state
            } else {
                alert('Logout failed!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    