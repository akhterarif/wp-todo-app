import apiFetch from '@wordpress/api-fetch';
import * as actionTypes from './actionTypes';

// Utility to send nonce
const apiFetchWithNonce = (options) => {
    return apiFetch({
        ...options,
        headers: {
            ...options.headers,
            'X-WP-Nonce': window.wpTodoApp.nonce,
        },
    });
};

export const fetchTodos = () => async ({ dispatch }) => {
    dispatch({ type: actionTypes.FETCH_TODOS_START });

    try {
        const todos = await apiFetchWithNonce({ path: '/wp-todo-app/v1/todos' });
        
        dispatch({ type: actionTypes.FETCH_TODOS_SUCCESS, todos: todos });
    } catch (error) {
        dispatch({ type: actionTypes.FETCH_TODOS_FAILURE, error, todos: [] });
    }
};

export const addTodo = (title) => async ({ dispatch }) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo = {
        id: tempId,
        title,
        completed: false,
        isOptimistic: true,
    };

    dispatch({
        type: actionTypes.ADD_TODO_OPTIMISTIC,
        todo: optimisticTodo,
    });

    try {
        const savedTodo = await apiFetchWithNonce({
            path: '/wp-todo-app/v1/todos',
            method: 'POST',
            data: { title },
        });
        
        dispatch({
            type: actionTypes.ADD_TODO_SUCCESS,
            tempId,
            savedTodo,
        });
    } catch (error) {
        dispatch({
            type: actionTypes.ADD_TODO_FAILURE,
            tempId,
            error,
        });
    }
};

export const updateTodo = (id, updates) => async ({ dispatch }) => {
    dispatch({
        type: actionTypes.UPDATE_TODO_OPTIMISTIC,
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
            type: actionTypes.UPDATE_TODO_SUCCESS,
            id,
            updatedTodo,
        });
    } catch (error) {
        dispatch({
            type: actionTypes.UPDATE_TODO_FAILURE,
            id,
            error,
        });
    }
};

export const deleteTodo = (id) => async ({ dispatch }) => {
    dispatch({ type: actionTypes.DELETE_TODO_OPTIMISTIC, id });

    try {
        await apiFetchWithNonce({
            path: `/wp-todo-app/v1/todos/${id}`,
            method: 'DELETE',
        });

        dispatch({ type: actionTypes.DELETE_TODO_SUCCESS, id });
    } catch (error) {
        dispatch({
            type: actionTypes.DELETE_TODO_FAILURE,
            id,
            error,
        });
    }
};
