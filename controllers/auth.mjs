import { User } from "../models/user.mjs";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import nodemailer from "nodemailer"

export const signUp=async(req,res)=>{
    const user=await User(req.body)
    const saltRounds = 10;
    const hash=await bcrypt.hash(req.body.password,saltRounds)    
    user.password=hash
   
    try{
        const token=crypto.randomBytes(20).toString('hex')
        user.resetPasswordToken=token
        user.resetPasswordExpires=Date.now()+3600000 // 1hr    
        const doc=await user.save()
        if(doc)
        { 
           
            // sendVerifyMail(doc.userName,doc.email,token)
            res.status(201).json(doc);
        }
    }
    catch(err)
    {
        res.status(401).json(err)
    }
}

export const login=async(req,res)=>{
    const {emailOrUsername}=req.body
    try{
        const doc=await User.findOne({
            $or:[
                {userName:emailOrUsername},
                {email:emailOrUsername}
            ]
        });
        // console.log('Doc is',doc)
        const isAuth=await bcrypt.compare(req.body.password,doc.password)
        // console.log(doc.isVerified)
        if(isAuth)
        {

            const token=jwt.sign({userId:doc._id,userName:doc.userName},process.env.SECRET_KEY,{expiresIn:'1d'})
            await doc.save()
            // console.log('token=',token)
            res.json({token,doc})
        }
        else
        {
        res.status(400).json({message:"Invalid Email Or password"}) 
        }
    }
    catch(error)
    {
        res.status(400).json(error)
    }    
}

export const forgotPassword=async(req,res)=>{

    try{
        const user=await User.findOne({email:req.body.email})
        if(!user)
        {
            return res.status(400).json({message:'User Not found'})
        }
        const token=crypto.randomBytes(20).toString('hex')
        user.resetPasswordToken=token
        user.resetPasswordExpires=Date.now()+3600000 // 1hr
        await user.save()
        // Nodemailer
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });
        const mailOptions={
            from:process.env.EMAIL,
            to:req.body.email,
            subject:'Password Reset Request',
            text:`You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${process.env.HOST_URL}/auth/reset-password/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        }
        transporter.sendMail(mailOptions,(error,response)=>{
            if(error)
            {
                return res.status(500).json({message:'Error sending email'})
            }
            else
            {
                return res.status(200).json({message:'Email Sent'})
            }
        })
    }
    catch(error)
    {
        res.status(500).json({message:'Server Error',error})
    } 
}
export const resetPassword=async(req,res)=>{
    const {token}=req.params
    const {password}=req.body
    try {
        const user=await User.findOne({resetPasswordToken:token,resetPasswordExpires:{$gt:Date.now()}})

        if(!user)
        {
            return res.status(400).json({message:'Invalid or expired token'})
        }
        const hash=await bcrypt.hash(password,10)
        user.password=hash
        user.resetPasswordToken=undefined
        user.resetPasswordExpires=undefined
        await user.save()
        return res.status(200).json({message:"Password Updated"})
    } 
    catch (error) {
        res.status(500).json({message:'Server error'})
    }
}