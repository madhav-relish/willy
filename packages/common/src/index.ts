import { z } from "zod";

 const CreateUserSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8, {message: "Password should be minimum 8 characters long"}),
    name: z.string().min(2, {message: "Name should be minimum 2 characters long"}),
    avatar: z.string().optional()
})

 const SigninSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8, {message: "Password should be minimum 8 characters long"}),
})

 const CreateRoomSchema = z.object({
    name: z.string().min(3).max(30),
})

 const IntegrationsSchema = z.object({
    type: z.enum(["GITHUB", "DISCORD", "SLACK"]),
    accessToken: z.string(),
    refreshToken: z.string().optional(),
    tokenExpiresAt: z.date().optional(),
    scope: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    isActive: z.boolean().optional(),
    userId: z.string(),
})

// Add type exports
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type SigninInput = z.infer<typeof SigninSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type IntegrationsInput = z.infer<typeof IntegrationsSchema>;

// Export all schemas
export {
    CreateUserSchema,
    SigninSchema,
    CreateRoomSchema,
    IntegrationsSchema
};



