import { registerStore } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

// Ensure the nonce is included in every request
const apiFetchWithNonce = (options) => {
    return apiFetch({
        ...options,
        headers: {
            ...options.headers,
            'X-WP-Nonce': window.wpTodoApp.nonce,
        },
    });
};

const DEFAULT_STATE = {
    todos: [],
    loading: false,
    error: null,
};

const actions = {
    fetchTodos: () => async ({ dispatch }) => {
        dispatch({ type: 'FETCH_TODOS_START' });

        try {
            const todos = await apiFetchWithNonce({ path: '/wp-todo-app/v1/todos' });
            dispatch({ type: 'FETCH_TODOS_SUCCESS', todos });
        } catch (error) {
            dispatch({ type: 'FETCH_TODOS_FAILURE', error });
        }
    },

    addTodo: (text) => async ({ dispatch }) => {
        const tempId = `temp-${Date.now()}`;

        // Optimistic update
        dispatch({
            type: 'ADD_TODO_OPTIMISTIC',
            todo: {
                id: tempId,
                text,
                completed: false,
                isOptimistic: true,
            },
        });

        try {
            const savedTodo = await apiFetchWithNonce({
                path: '/wp-todo-app/v1/todos',
                method: 'POST',
                data: { text },
            });

            dispatch({
                type: 'ADD_TODO_SUCCESS',
                tempId,
                savedTodo,
            });
        } catch (error) {
            dispatch({
                type: 'ADD_TODO_FAILURE',
                tempId,
                error,
            });
        }
    },

    updateTodo: (id, updates) => async ({ dispatch }) => {
        // Optimistic update
        dispatch({
            type: 'UPDATE_TODO_OPTIMISTIC',
            id,
            updates: { ...updates, isSaving: true },
        });

        try {
            const updatedTodo = await apiFetchWithNonce({
                path: `/wp-todo-app/v1/todos/${id}`,
                method: 'POST',
                data: updates,
            });

            dispatch({
                type: 'UPDATE_TODO_SUCCESS',
                id,
                updatedTodo,
            });
        } catch (error) {
            dispatch({
                type: 'UPDATE_TODO_FAILURE',
                id,
                error,
            });
        }
    },

    deleteTodo: (id) => async ({ dispatch }) => {
        // Optimistic update
        dispatch({ type: 'DELETE_TODO_OPTIMISTIC', id });

        try {
            await apiFetchWithNonce({
                path: `/wp-todo-app/v1/todos/${id}`,
                method: 'DELETE',
            });

            dispatch({ type: 'DELETE_TODO_SUCCESS', id });
        } catch (error) {
            dispatch({ type: 'DELETE_TODO_FAILURE', id, error });
        }
    },
};

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'FETCH_TODOS_START':
            return { ...state, loading: true, error: null };

        case 'FETCH_TODOS_SUCCESS':
            return { ...state, loading: false, todos: action.todos };

        case 'FETCH_TODOS_FAILURE':
            return { ...state, loading: false, error: action.error };

        case 'ADD_TODO_OPTIMISTIC':
            return {
                ...state,
                todos: [...state.todos, action.todo],
            };

        case 'ADD_TODO_SUCCESS':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.tempId ? { ...action.savedTodo, isOptimistic: false } : todo
                ),
            };

        case 'ADD_TODO_FAILURE':
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.tempId),
                error: action.error,
            };

        case 'UPDATE_TODO_OPTIMISTIC':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.id ? { ...todo, ...action.updates } : todo
                ),
            };

        case 'UPDATE_TODO_SUCCESS':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.id ? { ...action.updatedTodo, isSaving: false } : todo
                ),
            };

        case 'UPDATE_TODO_FAILURE':
        case 'DELETE_TODO_FAILURE':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.id ? { ...todo, isSaving: false, error: action.error } : todo
                ),
                error: action.error,
            };

        case 'DELETE_TODO_OPTIMISTIC':
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.id),
            };

        default:
            return state;
    }
};

const selectors = {
    getTodos: (state) => state.todos,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
};

registerStore('wp-todo-app', {
    reducer,
    actions,
    selectors,
});
