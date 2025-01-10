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
    console.log('A user connected');

    socket.on('joinRoom', async (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('drawing', (data) => {
        const { roomId, ...drawingData } = data;
        socket.to(roomId).emit('drawing', drawingData);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const port = 5000;
io.listen(port);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});