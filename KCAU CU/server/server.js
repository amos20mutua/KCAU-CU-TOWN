const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const teamsRoutes = require('./routes/teams');
const fundraisingRoutes = require('./routes/fundraising');
const messagesRoutes = require('./routes/messages');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
mongoose.connect('mongodb://localhost/kca_cu', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/fundraising', fundraisingRoutes);
app.use('/api/messages', messagesRoutes);

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Broadcast updates to all clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 