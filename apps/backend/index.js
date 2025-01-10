const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const roomsRouter = require('./routes/rooms');
const drawingsRouter = require('./routes/drawings');

const app = express();
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    }
});


app.use(express.json());
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/rooms', roomsRouter);
app.use('/api/drawings', drawingsRouter);

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

const httpPort = 5000;
const socketPort = 5001;
io.listen(socketPort);
app.listen(httpPort, () => {
    console.log(`Server is running on port ${httpPort}`);
});