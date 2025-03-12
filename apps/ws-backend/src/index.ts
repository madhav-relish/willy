import WebSocket, { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'
import {prismaClient } from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = []

const verifyUser = (token: string): string | null => {
  try {

    const decoded = jwt.verify(token, JWT_SECRET)

    if (typeof decoded == 'string') {
      return null
    }

    if (!decoded || !decoded.userId) {
      return null
    }

    return decoded.userId
  } catch (error) {
    console.log("Error while decode jwt in ws::", error)
    return null
  }
}

wss.on('connection', function connection(ws, req) {
  ws.on('error', console.error);

  const url = req.url
  console.log("Full URL:", req.url);

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1])
  const token = queryParams.get('token') || ""
  console.log("TOKEN::", token)
  //verify the token
  const userId = verifyUser(token)
  if (!userId || userId === null) {
    wss.close()
    return null
  }

  users.push({
    userId,
    rooms: [],
    ws
  })


  ws.on('message', async function message(data) {
    
    try{
      let parsedData

      if (typeof data !== 'string') {
        parsedData = JSON.parse(data.toString())
      } else {
        parsedData = JSON.parse(data)
      }
      
      
      if (parsedData.type === "join_room") {
        const user = users.find(user=> user.ws === ws)
        user?.rooms.push(parsedData.roomId)
      }
      
      if(parsedData.type === "leave_room"){
        const user = users.find(user => user.ws === ws)
        if(!user) return 
        user.rooms = user.rooms.filter(room => room === parsedData.room)
      }
      
      if(parsedData.type === "chat"){
        const { roomId, message, gifUrl } = parsedData;

        // Update the db with the latest message or GIF to that roomId
        const chat = await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            gifUrl,
            userId,
          },
        });

        users.forEach(user => {
          user.ws.send(JSON.stringify({
            id: chat.id,
            roomId: chat.roomId,
            message: chat.message,
            gifUrl: chat.gifUrl,
            userId: chat.userId,
            type: "chat",
          }));
        });
      }
    }catch(error){
      console.log("Error while parsing the ws data::", error)
    }
    

  });
});