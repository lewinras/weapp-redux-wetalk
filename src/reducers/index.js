import {combineReducers} from '../libs/redux'
import talks from './talksReducers';

const todos = require('./todos.js')
const visibilityFilter = require('./visibilityFilter.js')

export default combineReducers({
    todos,
    visibilityFilter,
    talks
})

