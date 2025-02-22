import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"
import express from "express"
import jwt from "jsonwebtoken"
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from '@repo/common/types'

const app = express()
app.use(express.json())

//@ts-ignore
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
        res.json({
            userId: user.id
        })
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

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
        res.json({
            token
        })
    } catch (error) {
        console.log("Error while sign in::", error)
        res.status(411).json({ error })
    }
})

//create room
app.post('/create-room', async (req, res, middleware) => {

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

app.listen(3002)