const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();  

// Middleware
app.use(cors());  
app.use(bodyParser.json());  

// MySQL Database connection
const db = mysql.createConnection({        
    host: 'localhost',
    user: 'root', 
    password: 'pranav',
    database: 'todolist_db', 
});

// Test DB connection
db.connect((err) => {                              
if (err) throw err;                                
    console.log('Connected to MySQL Database!');
});

// CRUD APIs

// Get all tasks
app.get('/api/todos', (req, res) => {                              //app.get('/api/todos'): This is a route handler for fetching all tasks from the database.
                                                                    //db.query():Executes a SQL query to get all tasks from the tasks table.
                                                                     //res.json(results): Sends back the tasks from the database as a JSON response
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new task
app.post('/api/todos', (req, res) => {       

    const { text, checked } = req.body;
    db.query('INSERT INTO tasks (text, checked) VALUES (?, ?)', [text, checked], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, text, checked });
    });
});

// Update a task
app.put('/api/todos/:id', (req, res) => {   

    const { text, checked } = req.body;
    const taskId = req.params.id;
    db.query(
        'UPDATE tasks SET text = ?, checked = ? WHERE id = ?',
        [text, checked, taskId],
        (err, result) => {
            if (err) throw err;
            res.json({ id: taskId, text, checked });
        }
    );
});

// Delete a task 
app.delete('/api/todos/:id', (req, res) => {   
    const taskId = req.params.id;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Task deleted' });
    });
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


