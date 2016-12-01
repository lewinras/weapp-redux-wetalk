import {combineReducers} from '../libs/redux'
import talks from './talksReducers'
import banners from './bannerReducers.js'
import merge from '../libs/lodash.merge';
import { defaultEntities } from '../schemas/schema';


function entities(state = defaultEntities, action) {
    if(action.response && action.response.entities) {
        return merge({}, state, action.response.entities);
    }
    return state;
}

export default combineReducers({
    talks,
    banners,
    entities
})

