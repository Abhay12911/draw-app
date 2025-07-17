import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {creeateUserSchema, loginUserSchema, createRoomSchema} from "@repo/common/types";
const app  = express();

app.post("/signup", (req,res) =>{

    const data = creeateUserSchema.safeParse(req.body);

    if(!data.success){
         res.json({
            message: "Invalid input",
        })
        return;
    }
})

app.post("/signin", (req,res) =>{
    
     const data = loginUserSchema.safeParse(req.body);

    if(!data.success){
         res.json({
            message: "Invalid input",
        })
        return;
    }
    const userId = 1;
    const token  = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware , (req,res) =>{
    
     const data = createRoomSchema.safeParse(req.body);

    if(!data.success){
         res.json({
            message: "Invalid input",
        })
        return;
    }
} )
app.listen(3001);
