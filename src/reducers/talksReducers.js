import merge from '../libs/lodash.merge'
import pick from '../libs/lodash.pick';
import uniq from '../libs/lodash.uniq';
import {
    REQUEST_TALKS,
    RECEIVE_TALKS,
    SET_REFS,
    RECEIVE_POSTERS,
} from '../actions/talksActionCreators';
import scrollReducersCreator from './scrollReducersCreator';


function isFetching(state = false, action) {
    switch (action.type) {
        case REQUEST_TALKS:
            return true;
        case RECEIVE_TALKS:
            return false;
        default:
            return state;
    }
}

export default function talks(state = {}, action) {
    switch (action.type) {
        case REQUEST_TALKS:
        case RECEIVE_TALKS:
        case SET_REFS:
            return merge({}, state, {
                ...(talksByCategory(state[action.id], action))
            });
        case RECEIVE_POSTERS:
            let talk0 = state[0] || {};
            talk0 = setPosters(talk0, action);
            return merge({}, state, {
                [0]: talk0
            });
        default:
            return state;
    }
}


function setPosters(state = {}, action) {
    return merge({}, state, {
        posters: action.response.result.slice(0)
    });
}

function getPosters(state = [], action) {
    switch (action.type) {
        case RECEIVE_TALKS:
            if (action.response.result.banners)
                return uniq(state.concat(action.response.result.banners));
            else
                return state;
        default:
            return state;
    }
}
function totalCount(state = 0, action) {
    switch (action.type) {
        case RECEIVE_TALKS:
            return action.response.result.total_count;
        default:
            return state;
    }
}

function talksState(state = {
    isEnd: false,
    page: 1,
    items: []
}, action) {
    return NAME => scrollReducersCreator(NAME)(state, action);
}

function talksByCategory(state = {}, action) {
    return {
        [action.id]: {
            posters: getPosters(state.posters, action),
            isFetching: isFetching(state.isFetching, action),
            totalCount: totalCount(state.totalCount, action),
            // refs: refs(state.refs, action),
            ...(
                talksState(pick(state, ['isEnd', 'page', 'items']), action)(RECEIVE_TALKS)
            )
        }
    }
}