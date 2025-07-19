import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
// const { JWT_SECRET } = require('@repo/backend-common/config');

import { middleware } from "./middleware";
import {createUserSchema, loginUserSchema, createRoomSchema} from "@repo/common/types";
import {prismaClient }  from "@repo/db/client";
import bcrypt from "bcrypt"
const app  = express();
app.use(express.json());

app.post("/signup", async(req,res) =>{

    const parsedData = createUserSchema.safeParse(req.body);

    if(!parsedData.success){
         res.json({
            message: "Invalid input",
        })
        return;
    }

    try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password,10);
    const user  = await prismaClient.user.create({
    data:{
        email: parsedData.data.username,
        password: hashedPassword,
        name: parsedData.data.name
    }
    });

    res.json({
        userId: user.id,
    });

    
    } catch (e) {
            res.status(500).json({
                message: " Internal server error or user creation failed"
            })
    }
   
})

app.post("/signin", async (req,res) =>{
    
     const parsedData = loginUserSchema.safeParse(req.body);

    if(!parsedData.success){
         res.json({
            message: "Invalid input",
        })
        return;
    }
    const user = await prismaClient.user.findFirst({
        where:{
            email: parsedData.data.username,
            // password: parsedData.data.password
        }
    })

    if(!user){
        res.status(401).json({
            message: "invalid user",
        })
        return;
    }

    const isPasswordCorrect = await bcrypt.compare(parsedData.data.password, user.password);
    if(!isPasswordCorrect){
        res.status(401).json({
            message: " Invalid Password",
        })
        return;
    }


    const token  = jwt.sign({
        userId: user?.id,
    },JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware , async (req,res) =>{
    
     const parsedData = createRoomSchema.safeParse(req.body);

    if(!parsedData.success){
         res.json({
            message: "Invalid input",
        })
        return;
    }
    //@ts-ignore
    try {
        const userId = req.userId;
        if(!userId){
            throw new Error("User id not found ")
        }
    const room  = await prismaClient.room.create({
        data:{
            slug : parsedData.data.name,
            adminId : userId,
        }
    })
    res.json({
        roomId : room.id
    })
    } catch (error) {
        res.status(411).json({
            message: " Room already exist with this name",
        })
    }
    
} )

// creating this end point to fetch previous chats when the user joins the room
app.get("/chats/:roomId", (req,res)=>{
    const roomId  = Number(req.params.roomId);
    const messages = prismaClient.chat.findMany({
        where:{
            roomId: roomId
        },
        orderBy:{
            id : "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
})

app.get("/rooms/:slug", async (req,res) =>{
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    });

        res.json({
        room
})

})
app.listen(3001);
