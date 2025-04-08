import * as actionTypes from './actionTypes';

const DEFAULT_STATE = {
    todoIds: [],
    todoMapper: {},
    loading: false,
    error: null,
};

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.FETCH_TODOS_START:
            return { ...state, loading: true, error: null };

        case actionTypes.FETCH_TODOS_SUCCESS: {
            console.log("action.todos", action.todos);
            const todoIds = action.todos.map(todo => todo.id);
            const todoMapper = action.todos.reduce((acc, todo) => {
                acc[todo.id] = todo;
                return acc;
            }, {});
            const updatedState = { ...state, loading: false, todoIds, todoMapper };
            console.log("updatedState", updatedState);
            return updatedState;
        }
        case actionTypes.FETCH_TODOS_FAILURE:
            return { ...state, loading: false, error: action.error };

        case actionTypes.ADD_TODO_OPTIMISTIC: {
            return {
                ...state,
                todoIds: [...state.todoIds, action.todo.id],
                todoMapper: {
                    ...state.todoMapper,
                    [action.todo.id]: action.todo,
                },
            };
        }

        case actionTypes.ADD_TODO_SUCCESS: {
            const updatedMapper = { ...state.todoMapper };
            delete updatedMapper[action.tempId];

            return {
                ...state,
                todoIds: state.todoIds.map(id => id === action.tempId ? action.savedTodo.id : id),
                todoMapper: {
                    ...updatedMapper,
                    [action.savedTodo.id]: { ...action.savedTodo, isOptimistic: false },
                },
            };
        }

        case actionTypes.ADD_TODO_FAILURE: {
            const updatedIds = state.todoIds.filter(id => id !== action.tempId);
            const updatedMapper = { ...state.todoMapper };
            delete updatedMapper[action.tempId];

            return { ...state, todoIds: updatedIds, todoMapper: updatedMapper, error: action.error };
        }

        case actionTypes.UPDATE_TODO_OPTIMISTIC: {
            return {
                ...state,
                todoMapper: {
                    ...state.todoMapper,
                    [action.id]: {
                        ...state.todoMapper[action.id],
                        ...action.updates,
                        isSaving: true,
                    },
                },
            };
        }

        case actionTypes.UPDATE_TODO_SUCCESS: {
            return {
                ...state,
                todoMapper: {
                    ...state.todoMapper,
                    [action.id]: { ...action.updatedTodo, isSaving: false },
                },
            };
        }

        case actionTypes.UPDATE_TODO_FAILURE:
        case actionTypes.DELETE_TODO_FAILURE: {
            return {
                ...state,
                todoMapper: {
                    ...state.todoMapper,
                    [action.id]: {
                        ...state.todoMapper[action.id],
                        isSaving: false,
                        error: action.error,
                    },
                },
                error: action.error,
            };
        }

        case actionTypes.DELETE_TODO_OPTIMISTIC: {
            const updatedIds = state.todoIds.filter(id => id !== action.id);
            const updatedMapper = { ...state.todoMapper };
            delete updatedMapper[action.id];

            return {
                ...state,
                todoIds: updatedIds,
                todoMapper: updatedMapper,
            };
        }

        default:
            return state;
    }
};

export default reducer;
