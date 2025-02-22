import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"
import express from "express"
import jwt from "jsonwebtoken"
import {CreateUserSchema} from '@repo/common/types'

const app = express()
app.use(express.json())

// Add zod validation
//@ts-ignore
app.post('/signup', async(req, res) => {
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
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name,
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

//@ts-ignore
app.post('/signin', async(req, res) => {

    const userInfo = signInSchemareq.body
    if (!userInfo) {
        console.log("No user data recieved in body")
        return res.json({ message: "No data was sent in body" })
    }
    // Search for the user in DB and get the user ID
    // const userId = "123123"
    const user = await prismaClient.user.findUnique({
        where: {
            email: userInfo.email,
            password: userInfo.password
        }
    })
    // Sign the token
    const token = jwt.sign(user?.id, JWT_SECRET)
    // Return the token and appropriate info
    res.json({
        token
    })
})

//create room
app.post('/create-room', async(req, res, middleware) => {

// create the room
// Return roomID

    const roomId = await prismaClient.room.create({
        data: {
             slug: req
        }
    })

})

app.listen(3002)