export const getTodos = (state) =>{
    const todos = state.todoIds.map((id) => {
        let todo = state.todoMapper[id]; 
        return todo || {};
    });
    console.log('Todos:', todos);
    return todos || [];
};

export const getTodoById = (state, id) =>
    state.todoMapper[id] || null;

export const isLoading = (state) =>
    state.loading;

export const getError = (state) =>
    state.error;
