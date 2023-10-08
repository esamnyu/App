document.addEventListener("DOMContentLoaded", function() {
        // Map Initialization
        initializeMap();
    
        // Set up the chat drag functionality
        setupChatDrag();
    
        // Initially, no chat user is selected
        let currentChatUser = null;
        const messagingPanel = document.querySelector(".messaging-panel");
        document.getElementById("openMessagingBtn").addEventListener("click", function() {
           //const messagingPanel = document.querySelector(".messaging-panel");
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
    
    // Function to open a chat with a user
    function openChat(user) {
        currentChatUser = user;
        document.getElementById("chatHeader").innerText = `Chatting with ${user}`;
        document.getElementById("messages").innerText = "";  // Clear chat when switching users
    
        const msgBtn = document.querySelector(".message-button");
        msgBtn.addEventListener("click", function() {
            sendMessage();
        });
    }
    
    // Function to send a message
    function sendMessage() {
        if (!currentChatUser) {
            alert("Please select a contact to send a message.");
            return;
        }
        const messageInput = document.getElementById("messageInput");
        const messagesDiv = document.getElementById("messages");
        if (messageInput.value.trim()) {  // Check if the message isn't just whitespace
            messagesDiv.innerHTML += `<div>You: ${messageInput.value}</div>`;
            messageInput.value = "";
        }
    }

    // Set up the chat panel to be draggable
function setupChatDrag() {
        let isDragging = false;
        let offsetX, offsetY;
        const chatPanel = document.querySelector(".messaging-panel");
    
        chatPanel.addEventListener("mousedown", function(event) {
            isDragging = true;
            offsetX = event.clientX - this.getBoundingClientRect().left;
            offsetY = event.clientY - this.getBoundingClientRect().top;
        });
    
        document.addEventListener("mouseup", function() {
            isDragging = false;
        });
    
        document.addEventListener("mousemove", function(event) {
            if (isDragging) {
                const x = event.clientX - offsetX;
                const y = event.clientY - offsetY;
                chatPanel.style.left = x + "px";
                chatPanel.style.top = y + "px";
                chatPanel.style.position = "absolute";
            }
        });
    }
    
    // Call the setupChatDrag function once to initialize the dragging functionality
    setupChatDrag();
    
    document.getElementById("hamburgerMenu").addEventListener("click", function() {
        const sidePanel = document.querySelector(".side-panel");
        sidePanel.classList.toggle("closed");
    });
    