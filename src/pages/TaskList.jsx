import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './TaskList.css';

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });
  const [editingTask, setEditingTask] = useState(null);

  const addTask = () => {
    if (!newTask.title) return;
    
    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      userId: user.username
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setNewTask(task);
  };

  const updateTask = () => {
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? { ...newTask, id: task.id } : task
    ));
    setEditingTask(null);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
  };

  return (
    <div className="task-list-container">
      <h1 className="task-list-title">Task List</h1>
      
      <div className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="task-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="task-input"
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="task-input"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className="task-input"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button 
          className="task-button"
          onClick={editingTask ? updateTask : addTask}
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <div className="tasks-grid">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`task-card ${task.completed ? 'completed' : ''} priority-${task.priority}`}
          >
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-actions">
                <button onClick={() => toggleComplete(task.id)} className="action-button">
                  <FaCheck />
                </button>
                <button onClick={() => startEdit(task)} className="action-button">
                  <FaEdit />
                </button>
                <button onClick={() => deleteTask(task.id)} className="action-button">
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="task-description">{task.description}</p>
            <p className="task-due-date">Due: {task.dueDate}</p>
            <span className="task-priority">Priority: {task.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}