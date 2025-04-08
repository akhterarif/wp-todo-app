import { render } from '@wordpress/element';
import './store'; 
import TodoApp from './TodoApp';


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('wp-todo-app');
    if (container) {
        render(<TodoApp />, container);
    }
});