import merge from '../libs/lodash.merge'
import {
    RECEIVE_SYSTEM_INFOS
} from '../actions/systemInfoActionCreators'
export default function system(state = {}, action) {
    switch (action.type) {
        case RECEIVE_SYSTEM_INFOS:
            console.log(action.result)
            return merge({}, state, action.result)
        default:
            return state;

    }
}