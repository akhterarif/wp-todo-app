import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

const TodoApp = () => {
    const dispatch = useDispatch('wp-todo-app');
    const { fetchTodos, updateTodo, deleteTodo } = dispatch;
    
    const todos = useSelect((select) => {
        const state = select('wp-todo-app');
        return state.getTodos();  // Ensure todos is an array
    }, []);
    
    const loading = useSelect((select) => select('wp-todo-app').isLoading(), []);
    const error = useSelect((select) => select('wp-todo-app').getError(), []);
    
    
    useEffect(() => {
        fetchTodos();
    }, []);
    

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Todo App</h2>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error.message}
                </div>
            )}
            <AddTodo />
            
            {loading && todos.length === 0 ? (
                <div className="text-center">Loading...</div>
            ) : (
                <TodoList todos={todos} />
            )}
        </div>
    );
};

export default TodoApp;
