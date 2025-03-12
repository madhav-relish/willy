//@ts -nocheck
import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function middleware (req: Request, res: Response, next:NextFunction){

    const BearerToken = req.headers["authorization"] ?? ""
    const token = BearerToken.split(" ")[1]

    if(!token){
        res.status(403).json({
            error: "No authorization token was provided"
        })
        return;
    }
    const decoded = jwt.verify(token, JWT_SECRET)

    if(decoded){
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }else{
        res.status(403).json({
            error: "Wrong authorization header!"
        })
    }
}