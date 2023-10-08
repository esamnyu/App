const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// SQLite database setup
const db = new sqlite3.Database('./app.db');

// Initialize database tables
db.serialize(() => {
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE
    )`);

    // Create messages table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER,
        receiver_id INTEGER,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id)
    )`);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg, sender, receiver) => {
        // Save message to database
        db.run(`INSERT INTO messages(sender_id, receiver_id, content) VALUES (?, ?, ?)`, [sender, receiver, msg], function(err) {
            if (err) {
                return console.error(err.message);
            }
            // Broadcast the message (or emit to a specific user)
            io.emit('chat message', msg);
        });
    });
});

app.get('/message-history/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;

    // Fetch message history between user1 and user2
    db.all(`SELECT content, timestamp FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC`, [user1, user2, user2, user1], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    // Here you would clear the user session. The exact method depends on how sessions are handled.
    // For this example, we'll just send a success message.
    res.json({ success: true });
});

// Check login status endpoint
app.get('/check-login', (req, res) => {
    // For demonstration purposes, we'll return a hardcoded value.
    // In a real application, you'd check if a user session or token exists.
    res.json({ loggedIn: false });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            res.status(500).json({ error: 'Failed to retrieve user' });
            return;
        }

        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        // Check if the hashed password matches
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                res.status(500).json({ error: 'Failed to compare passwords' });
                return;
            }

            if (!isMatch) {
                res.status(400).json({ error: 'Invalid credentials' });
                return;
            }

            // Set user session
            req.session.userId = user.id;
            res.json({ success: true });
        });
    });
});

const bcrypt = require('bcrypt');  // Make sure you've already installed bcrypt using npm

// ... other code ...

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).json({ success: false, error: 'Failed to hash password' });
            return;
        }

        db.run(`INSERT INTO users(username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
            if (err) {
                res.status(500).json({ success: false, error: 'Failed to register user' });
                return;
            }
            res.json({ success: true });
        });
    });
});
