const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// CORS middleware 
app.use(cors());

// express.json() to parse JSON request body
app.use(express.json());

// ROUTES

// CREATE TODO
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});

// get all todos
app.get('/todos' , async(req,res) =>{
   try{

       const allTodos = await pool.query("SELECT * FROM todo");
       res.json(allTodos.rows)
   } catch(err){
       console.log(err.message);
   }
})

// get a todo 
app.get("/todos/:id" , async(req,res) =>{
    try{
        const { id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1",[id]);
        res.json(todo.rows[0]);
    } catch(err){
        console.log(err.message);
    }
})

// update a todo 

app.put("/todos/:id" , async(req,res) =>{
    try{
        const { id} =  req.params;
        const { description} = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id=$2",
            [description,id]
        );
        res.json("TODO WAS UPDATES");

    }catch(err){
        console.log(err.message);
    }
})


// delete a todo
app.delete("/todos/:id", async(req,res) =>{
    try{
        const { id} = req.params;
        const deleteTodd =  await  pool.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Todo was deleted!");
    }catch(err){
        console.log(err.message)
    }
})


app.listen(5000, () => {
    console.log("Application is running on port number 5000");
});
