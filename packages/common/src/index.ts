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

export const IntegrationsSchema = z.object({
    type: z.enum(["GITHUB", "DISCORD", "SLACK"]),
    accessToken: z.string(),
    refreshToken: z.string().optional(),
    tokenExpiresAt: z.date().optional(),
    scope: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    isActive: z.boolean().optional(),
    userId: z.string(),
})

