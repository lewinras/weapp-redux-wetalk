import {combineReducers} from '../libs/redux'
import merge from '../libs/lodash.merge';
import {defaultEntities} from '../schemas/schema';
import talks from './talksReducers'
import global from './globalReducers';
import banners from './bannerReducers.js'
import profile from './profileReducers';
import posters from './posterReducers.js';
import systemInfo from './systemInfoReducers'
import visitedTalks from './visitedTalksReducers';


function entities(state = defaultEntities, action) {
    if (action.response && action.response.entities) {
        if (action.isForce) {
            return Object.assign({}, state, action.response.entities)
        } else {
            return merge({}, state, action.response.entities);
        }
    }
    return state;
}

export default combineReducers({
    talks,
    global,
    banners,
    entities,
    profile,
    posters,
    systemInfo,
    visitedTalks
})

