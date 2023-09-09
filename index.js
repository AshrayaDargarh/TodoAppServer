import express, { json } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
dotenv.config()
import { authRouter } from "./routes/auth.mjs"
import { todoRouter } from "./routes/todo.mjs"
import { userRouter } from "./routes/user.mjs"
import jwt from "jsonwebtoken"
const app=express()
   
// db connection
main().catch(err=>console.log(err,'Something went wrong while connecting with the database'))
async function main()
{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("DB Connected")
}
const auth=(req,res,next)=>{
    try{
        const token=req.get('Authorization').split('Bearer ')[1]
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
        if(decoded.userId)
        {
            req.userId=decoded.userId 
            req.userName=decoded.userName
            next()
        }
    }
    catch(error)
    {
        res.sendStatus(401)
    }
}

app.use(json())
app.use(cors())
app.use('/auth',authRouter)
app.use('/todo',auth,todoRouter)
app.use('/user',auth,userRouter)

app.get("/",(req,res)=>{
    res.send("<h1>Inside the home dir</h1>")
})
  
const PORT=process.env.PORT || 4000
app.listen(PORT,()=>{  
    console.log(`Server is listing at http://localhost:${PORT}`)
})