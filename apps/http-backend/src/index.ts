import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"
import express from "express"
import jwt from "jsonwebtoken"
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from '@repo/common/types'
import { middleware } from "./middleware"
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();
app.use(cookieParser())
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
))
app.use(express.json());

app.post('/signup', async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the password
                password: parsedData.data.password,
                name: parsedData.data.name,
            }
        })
        const token = jwt.sign({ userId: user?.id }, JWT_SECRET)
        res.cookie("authToken", token, { 
            httpOnly: true, 
            sameSite: "strict",
        });
    
        res.json({ message: "Signed up successfully" });
    } catch (e) {
        console.log("Error while signin up::", e)
        res.status(411).json({
            message: "User already exists with this username!!"
        })
    }
})

app.get("/me", middleware,async (req, res) => {
//     const token = req.cookies.authToken;
//     if (!token) { res.status(401).json({ message: "Not authenticated" });
//     return
// }

    try {
        // const decoded = jwt.verify(token, JWT_SECRET);
        //@ts-ignore
        const userId = req.userId
        const user = await prismaClient.user.findUnique({ where: { id: userId }, select: {rooms: true, id: true, name: true, email: true} });
        res.json({user});
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
});

//@ts-ignore
app.post('/signin', async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {

        // Search for the user in DB and get the user ID
        const user = await prismaClient.user.findUnique({
            where: {
                email: parsedData.data.username,
                password: parsedData.data.password
            }
        })

        if (!user) {
            res.status(403).json({
                message: "Not authorized"
            })
            return;
        }

        // Sign the token
        const token = jwt.sign({ userId: user?.id }, JWT_SECRET)
        // Return the token and appropriate info
          res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "none",  // Required for cross-origin cookies
            secure: process.env.NODE_ENV !== "development", // Must be true in production
        });
        res.json({ message: "Logged in successfully", token });
    } catch (error) {
        console.log("Error while sign in::", error)
        res.status(411).json({ error })
    }
})

//create room
app.post('/create-room',middleware, async (req, res) => {

    // create the room
    // Return roomID

    const parsedData = CreateRoomSchema.safeParse(req.body)

    if (!parsedData.success) {
        console.log("Error while parsing create room data::", parsedData.error)
        res.json({
            message: "Incorrect inputs"
        })
        return
    }

    //@ts-ignore
    const userId = req.userId

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            room
        })

    } catch (error) {
        // TODO:: Add proper error handling
        console.error("Error while creating the room::", error)
        res.status(411).json({
            error: "Error while creating room"
        })
    }
})

app.post('/join-room', middleware, async(req, res) => {
    try {
        const { roomId } = req.body;

       if(!roomId){
        res.status(400).json({message: "RoomId is required!"})
        return 
       }

       const numberedRoomId = Number(roomId)
       //Check if the user is already in the room
       //@ts-ignore
       const userId = req.userId
       const existingUserInRoom = await prismaClient.user.findFirst({
        where:{
            id: userId,
            rooms:{some: {id: numberedRoomId}}
        }
       })
       if (existingUserInRoom) {
         res.status(400).json({ message: "User already in the room" });
         return
    }

    //Add user to the group
  const room =  await prismaClient.user.update({
        where:{id: userId},
        data:{
            rooms: {connect:{ id: numberedRoomId}}
        }
    })

    res.json({ message: "Joined room successfully", roomId });
    } catch (error) {
        console.error("Error while joining room::", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get('/all-rooms', middleware, async(req, res)=>{
    try{
        //@ts-ignore
        const userId = req.userId
        const userWithRooms = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { rooms: true }, 
          });
        
          if (!userWithRooms) {
             res.status(404).json({ message: "User not found" });
             return
          }
        
          res.status(200).json({ rooms: userWithRooms.rooms });
    }catch(error){
        console.log("Error while fetching all rooms of the user::", error)
        res.status(500).json({message: "Error while fetching all rooms"})
    }
})

app.listen(3002, () => {
    console.log("Server running on http://localhost:3002");
});