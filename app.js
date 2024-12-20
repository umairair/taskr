import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import { myself } from './scratch.js';

const app = express()
const prisma = new PrismaClient();
app.use(express.json())
app.use(morgan("dev"))

const port = 3000

//iffe = immediately invoked function exression 
app.listen(port, () => {
    console.log(`Express is on port ${port}`)
})

app.get("/", (req, res) => {
    res.send(`${myself.name} can't put down the cup 👅😋`)
})

app.get("/umair", (req, res) => {
    //res.send(JSON.stringify(myself)) OR
    res.json(myself)
})

app.post("/users", async (req, res) => {
    const saltRounds = 10
    let {email, password} = req.body
    password = await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create(
        {
            data: {
                email: email,
                password: password
            }
        }
    )
    
    
    res.status(201).json({
        message: "User created successfully",
        user: {
            email: user.email
        }
    })
    
})