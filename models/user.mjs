import mongoose from "mongoose";
import validator from "validator";
const {Schema}=mongoose

const userSchema= new Schema({
    userName:{type:String, required:true,minLength:[1,"User name Cant't be less than one character"],maxLength:[16,"User name Cant't be more than 16 characters"],unique:true},
    firstName:{type:String, required:true,minLength:[1,"Cant't less than one character"],maxLength:[16,"Cant't more than 16 characters"]},
    lastName:{type:String,required:true,maxLength:[16,"Cant't more than 16 characters"]},
    email:{ 
        type:String,
        validate:[validator.isEmail,'invalid email'],
        unique:true, 
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // isVerified:{type:Boolean,default:false}, 
    resetPasswordToken:String,
    resetPasswordExpires:Date
})

export const User=mongoose.model('User',userSchema)
