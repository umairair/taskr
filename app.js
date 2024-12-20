import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import { myself } from './scratch.js';
import cors from "cors";
import req from "express/lib/request.js";

const app = express()
const prisma = new PrismaClient();
const corsOptions = {
    origin: "http://localhost:5500"
}
app.use(cors(corsOptions))
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

app.post("/users", async(req, res) => {
    const saltRounds = 10
    let { email, password } = req.body
    password = await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create({
        data: {
            email: email,
            password: password
        }
    })

    res.status(201).json({
        message: "User created successfully",
    
        user: {
            email: user.email
        }
    })

})

app.get("/users/:id", async(req, res) => {
    const { id } = req.params
    let user;
    try {
        user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        })
    } catch (error) {
        console.log(error)
    }
    if(user) {
        res.status(200).json(user)
    }
    else {
        res.status(404).json({message: 'User not found'})
    }
    console.log("id: " + id)
})

app.post("/login", async(req, res) => {
    let {email, password} = req.body
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(user) {
            const isValid = await bcrypt.compare(password, user.password)
            if(isValid) {
                res.json(user)
            }
            else{
                res.status(401).json({message: 'Incorrect password'})
            }
        }
        else {
            res.status(404).json({message: ""})
        }

    }
    catch(error) {
        res.status(500).json({message: error})
        console.log(error)
    }
})

