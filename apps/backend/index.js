const express = require('express');
const cors = require('cors');
const http = require('http'); // Import HTTP to create a server
const { Server } = require('socket.io');
const roomsRouter = require('./routes/rooms');
const drawingsRouter = require('./routes/drawings');

const app = express();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/rooms', roomsRouter);
app.use('/api/drawings', drawingsRouter);

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Create an HTTP server
const httpServer = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Listen for drawing data and broadcast to the room
    socket.on('drawing', (drawingData) => {
        const { roomId } = drawingData;

        // Broadcast to everyone in the room except the sender
        socket.to(roomId).emit('drawing', drawingData);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server on a single port
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
