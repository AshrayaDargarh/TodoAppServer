import { Todo } from "../models/todo.mjs";

export const createTodo=async(req,res)=>{
    const {title,data,taskStatus,userName}=req.body
   
    try {
        const todo=new Todo({title,data,taskStatus,user:req.userId,userName:userName})
        const doc=await todo.save() 
        // console.log(doc)       
        res.status(200).json(doc)
    } catch (error) {
        res.status(400).json(error)
    }
} 

export const getTodos=async(req,res)=>{
    
    try {
        const todos=await Todo.find({user:req.userId})
        res.json(todos)
    } catch (error) {
        res.json(error)
    }
}
export const getCatTodos=async(req,res)=>{
    const {category}=req.params
    try {
        const todos=await Todo.find({user:req.userId,taskStatus:category})
        res.json(todos)
    } catch (error) {
        res.json(error)
    }
}

export const getTodo=async(req,res)=>{
   
    const id=req.params.id
    
     try{
         const todo=await Todo.findById({_id:id})
         res.status(200).json(todo)
     }
     catch(err)
     {
         res.json(err)
     }
 }

export const updateTodo=async(req,res)=>{
    const {title,data,userName,taskStatus}=req.body

    try {
        const id=req.params.id
        const updatedTodo=await Todo.findOneAndUpdate({_id:id,user:req.userId},{title,data,userName,taskStatus},{new:true})
            res.json(updatedTodo)        
    } catch (error) {
        res.json(error)
    }
}

export const deleteTodo=async(req,res)=>{
    const id=req.params.id
    try {
        const doc=await Todo.findOneAndDelete({_id:id})
        res.json({message:"Todo deleted Successfully"})
    } catch (error) {
        res.json(error)
    }
}
