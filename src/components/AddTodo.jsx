import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

const AddTodo = () => {
    const dispatch = useDispatch('wp-todo-app');
    const { addTodo } = dispatch;
    const [newTodo, setNewTodo] = useState('');

    const loading = useSelect((select) => select('wp-todo-app').isLoading(), []);
    const error = useSelect((select) => select('wp-todo-app').getError(), []);

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            addTodo(newTodo);
            setNewTodo('');
        }
    };

    return (
        <div>
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new todo..."
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={!newTodo.trim() || loading}
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </form>
        </div>
    );
};

export default AddTodo;
