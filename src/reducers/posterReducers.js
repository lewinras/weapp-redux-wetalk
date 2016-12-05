import {
    REQUEST_POSTERS,
    RECEIVE_POSTERS
} from '../actions/talksActionCreators.js';

export default function posters(state = {}, action) {
    return {
        isFetching: isFetching(state.isFetching, action),
        posters: getPosters(state.posters, action)
    };
}

function isFetching(state = false, action) {
    switch (action.type) {
        case REQUEST_POSTERS:
            return true;
        case RECEIVE_POSTERS:
            return false;
        default:
            return state;
    }
}

function getPosters(state = [], action) {
    switch (action.type) {
        case RECEIVE_POSTERS:
            return action.response.result.map(item => item);
        default:
            return state;
    }
}
