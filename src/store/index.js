import { registerStore } from '@wordpress/data';
import reducer from './reducers';
import * as actions from './actions';
import * as selectors from './selectors';

const store = registerStore('wp-todo-app', {
    reducer,
    actions,
    selectors,
});

export default store;