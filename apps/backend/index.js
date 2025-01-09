
const { Server } = require('socket.io');
const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (roomId)=>{
        socket.join(roomId)
        console.log(`User joined room: ${roomId}`)
    })

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
console.log(`Server is running on port ${port}`);