import mongoose from "mongoose";
const {Schema}=mongoose

const todoSchema=new Schema({
    title:{type:String,required:true,default:'Untitled'},
    data:{type:String,required:true},
    daysToExpire:{type:Number},
    taskStatus:{
        type:String,
        default:'Not Started'
    },
    userName:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    } 
}) 

export const Todo=mongoose.model('Todo',todoSchema)
