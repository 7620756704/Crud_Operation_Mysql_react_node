import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Todolist = () => {
    const [name, setname] = useState('');
    const [todo, settodo] = useState([]);
    const [editmode, seteditedmode] = useState(false);
    const [editedtask, seteditedtask] = useState({ index: null, text: '' });

    // Fetch tasks from the backend
    useEffect(() => {                  
        axios.get('http://localhost:5000/api/todos')
            .then(response => {
                settodo(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tasks!', error);
            });
    }, []);

    
    const handleaddtask = () => {    //Conditional logic:
       if (editmode) {
            const updatedTask = {
                text: editedtask.text.trim(),
                checked: false,
            };
            axios.put(`http://localhost:5000/api/todos/${todo[editedtask.index].id}`, updatedTask)
                .then(response => {
                    const newTodo = [...todo];
                    newTodo[editedtask.index] = response.data;
                    settodo(newTodo);
                    seteditedmode(false);
                    seteditedtask({ index: null, text: '' });
                })
                .catch(error => console.error('There was an error updating the task!', error));
        } else {
            if (name.trim() !== '') {
                axios.post('http://localhost:5000/api/todos', { text: name.trim(), checked: false })
                    .then(response => {
                        settodo([...todo, response.data]);
                        setname('');
                    })
                    .catch(error => console.error('There was an error adding the task!', error));
            } else {
                alert('Please Add Your Task');
            }
        }
    };

    
    const deletetodo = (index) => {    //Axios DELETE request: Sends a DELETE request to the backend API to delete the task with the specified id.
                                           //Updating local state: After the task is successfully deleted, the todo array is updated to remove the task. The filter method creates a new array excluding the task that was deleted.
                                                  //Error handling: If the request fails, an error is logged to the console.
        axios.delete(`http://localhost:5000/api/todos/${todo[index].id}`)
            .then(() => {
                const newTodo = todo.filter((task, ind) => index !== ind);
                settodo(newTodo);
            })
            .catch(error => console.error('There was an error deleting the task!', error));
    };

    
    const completetodo = (index) => {    const updatedTask = { ...todo[index], checked: !todo[index].checked };
        axios.put(`http://localhost:5000/api/todos/${todo[index].id}`, updatedTask)
            .then(response => {
                const newTodo = [...todo];
                newTodo[index] = response.data;
                settodo(newTodo);
            })
            .catch(error => console.error('There was an error updating the task status!', error));
    };

    
    const handledittask = (index) => {  
        seteditedmode(true);
        seteditedtask({ index: index, text: todo[index].text.trim() });
    };

    return (
        <>
           <div className='overlay'></div>
           <div className='main-body'>
               <div className='sub-body'>
                  <div className='main-section'>
                      <input
                          type="text"
                          className='main-input'
                          placeholder="Add The Text Here"
                          value={editmode ? editedtask.text : name}
                          onChange={(e) => editmode ? seteditedtask({ ...editedtask, text: e.target.value }) : setname(e.target.value)}
                      />
                      <button onClick={handleaddtask} className='sub-btn'>{editmode ? 'Update' : 'Submit'}</button>
                  </div>
                  <div className='sub-section'>
                           <ul>
                              {todo.map((task, index) => (
                              <li key={task.id} style={{ backgroundColor: task.checked ? "hwb(143 5% 15%)" : "white" }}>
                               <div className='added-text'>
                              {task.text}

                               </div>
                               <div className='added-btns'>
                                <button onClick={() => deletetodo(index)} className='del-btn'>Delete</button>
                                <button onClick={() => completetodo(index)} className='comp-btn'>{task.checked ? 'Undo' : 'Complete'}</button>
                                 <button onClick={() => handledittask(index)} className='edit-btn'>Edit</button>
    
                               </div>                        
                              </li>
                              ))}
                          </ul>
                  </div>

           
               </div>
           </div>
        </>
    );
};

export default Todolist;


