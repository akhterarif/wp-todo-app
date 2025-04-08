import React, { useState } from 'react';
import { useDispatch } from '@wordpress/data';


export default function TodoList({ todos }) {

    const dispatch = useDispatch('wp-todo-app');
    const { updateTodo, deleteTodo } = dispatch;


    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const startEditing = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    };

    const handleEdit = (id) => {
        if (editText.trim()) {
            updateTodo(id, { text: editText });
            setEditingId(null);
        }
    };

    const toggleComplete = (id, completed) => {
        updateTodo(id, { completed: !completed });
    };

    return (
        <ul className="space-y-2">
            {todos?.map((todo) => (
                <li key={todo.id} className={`flex items-center justify-between p-3 border rounded ${todo.completed ? 'bg-gray-200' : 'bg-white'}`}>
                    {editingId === todo.id ? (
                        <div className="flex w-full gap-2">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                disabled={todo.isSaving}
                            />
                            <button
                                onClick={() => handleEdit(todo.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                disabled={todo.isSaving}
                            >
                                {todo.isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                disabled={todo.isSaving}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo.id, todo.completed)}
                                className="h-5 w-5"
                                disabled={todo.isOptimistic || todo.isSaving}
                            />
                            <span className={`flex-1 ml-2 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{todo.text}</span>
                            {(todo.isOptimistic || todo.isSaving) && <span className="text-sm text-gray-500">Saving...</span>}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEditing(todo)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    disabled={todo.isOptimistic || todo.isSaving}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    disabled={todo.isOptimistic || todo.isSaving}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    )
};