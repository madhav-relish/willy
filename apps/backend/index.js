
const { Server } = require('socket.io');
const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    }
})
io.on('connection', (socket) => {
    socket.on('canvasImage', (data) => {
        socket.broadcast.emit('canvasImage', data);
    });
});

io.listen(5000);