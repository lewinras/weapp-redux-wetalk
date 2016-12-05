import {combineReducers} from '../libs/redux'
import merge from '../libs/lodash.merge';
import {defaultEntities} from '../schemas/schema';
import talks from './talksReducers'
import banners from './bannerReducers.js'
import profile from './profileReducers';
import posters from './posterReducers.js';
import systemInfo from './systemInfoReducers'

function entities(state = defaultEntities, action) {
    if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities);
    }
    return state;
}

export default combineReducers({
    talks,
    banners,
    entities,
    profile,
    posters,
    systemInfo
})

