// Initialize chat-related variables
let currentChatUser = null;

// Function to open a chat with a user
function openChat(user) {
    currentChatUser = user;
    document.getElementById("chatHeader").innerText = `Chatting with ${user}`;
    document.getElementById("messages").innerText = "";  // Clear chat when switching users
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
    const chatHeader = document.querySelector('.chat-header');  // Use the header for dragging
    
    chatHeader.addEventListener("mousedown", function(event) {
        isDragging = true;
        offsetX = event.clientX - chatPanel.getBoundingClientRect().left;
        offsetY = event.clientY - chatPanel.getBoundingClientRect().top;
    });
    
    document.addEventListener("mouseup", function() {
        isDragging = false;
    });
    
    document.addEventListener("mousemove", function(event) {
        if (isDragging) {
            requestAnimationFrame(() => {  // Smoother dragging
                const x = event.clientX - offsetX;
                const y = event.clientY - offsetY;
                chatPanel.style.left = x + "px";
                chatPanel.style.top = y + "px";
                chatPanel.style.position = "fixed";  // Changed from "absolute" to "fixed"
            });
        }
    });
}

// Call the setupChatDrag function
setupChatDrag();

document.getElementById("hamburgerMenu").addEventListener("click", function() {
    const sidePanel = document.querySelector(".side-panel");
    sidePanel.classList.toggle("closed");
});

const msgBtn = document.querySelector(".message-button"); // Set up the listener only once
msgBtn.addEventListener("click", function() {
    sendMessage();
});

$(function () {
    var socket = io();
    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
});

// Adding event listener to send message on pressing Enter key
document.getElementById("messageInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Prevent default behavior
        sendMessage();  // Call the sendMessage function
    }
});
