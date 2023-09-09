import express from "express"
import { createTodo,getTodos,updateTodo,deleteTodo,getTodo,getCatTodos } from "../controllers/todo.mjs"

export const todoRouter=express.Router()

todoRouter
.post('/',createTodo)
.get('/',getTodos)
.get('/:id',getTodo)
.get('/taskStatus/:category',getCatTodos)
.patch('/:id',updateTodo)
.delete('/:id',deleteTodo) 