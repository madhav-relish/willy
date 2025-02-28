import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8, {message: "Password should be minimum 8 characters long"}),
    name: z.string().min(2, {message: "Name should be minimum 2 characters long"}),
    avatar: z.string().optional()
})

export const SigninSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8, {message: "Password should be minimum 8 characters long"}),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(30),
})