import { Socket } from "socket.io";

const { Server } = require('socket.io');
const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    }
})
io.on('connection', (socket: Socket) => {
    socket.on('canvasImage', (data: unknown) => {
        socket.broadcast.emit('canvasImage', data);
    });
});

io.listen(5000);