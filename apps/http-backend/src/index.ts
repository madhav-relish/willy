import { JWT_SECRET } from "@repo/backend-common/config"
import express from "express"
import jwt from "jsonwebtoken"

const app = express()

// Add zod validation
//@ts-ignore
app.post('/signup', (req, res) => {
    const userInfo = req.body
    if (!userInfo) {
        console.log("No user data recieved in body")
        return res.json({ message: "No data was sent in body" })
    }
    //Create the user
    const userId = "123123"
    // Sign the jwt
    const token = jwt.sign(userId, JWT_SECRET)

    // Return the jwt to the user
    return res.json({ token: token, message: "User created Successfully!" })
})

//@ts-ignore
app.post('/signin', (req, res) => {

    const userInfo = req.body
    if (!userInfo) {
        console.log("No user data recieved in body")
        return res.json({ message: "No data was sent in body" })
    }
    // Search for the user in DB and get the user ID
    const userId = "123123"
    // Sign the token
    const token = jwt.sign(userId, JWT_SECRET)
    // Return the token and appropriate info
    res.json({
        token
    })
})

//create room
app.post('/create-room', (req, res, middleware) => {

// create the room
// Return roomID

})

app.listen(3002)