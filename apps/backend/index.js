
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', async(roomId)=>{
        const roomId = await prisma.room.findUnique({where: {roomId}})
        if(!roomId){
            await prisma.room.create({data: {roomId}})
        }
        socket.join(roomId)
        console.log(`User joined room: ${roomId}`)
    })

    socket.on('drawing', async(data) => {
        const { roomId, ...drawingData } = data;
        await prisma.drawing.create({
            data:{
                roomId,
                data: JSON.stringify(drawingData)
            }
        })
        socket.to(roomId).emit('drawing', drawingData);
      });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const port = 5000;
io.listen(port);
console.log(`Server is running on port ${port}`);