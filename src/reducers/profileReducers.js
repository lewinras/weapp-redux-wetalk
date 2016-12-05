import merge from '../libs/lodash.merge';
import uniq from '../libs/lodash.uniq';
import pick from '../libs/lodash.pick';
import {
    REQUEST_PROFILE,
    RECEIVE_PROFILE,
    REQUEST_EDIT,
    RECEIVE_EDIT,
    RECEIVE_USERHISTORY,
    SELECT_TABBAR,
    REQUEST_USERHISTORY,
    REQUEST_SUBSCRIBED,
    RECEIVE_SUBSCRIBED,
    FAILED_SUBSCRIBED
} from '../actions/profileActionCreators';
import {
    POST_QUESTION_RESPONSE
} from '../actions/consultantActionCreators';
import scrollReducersCreator from './scrollReducersCreator';
// import {
//   RECEIVE_GLANCE
// } from '../actions/consultationActionCreators';
import {
    RESPONSE_SELF_ASKING_QUESTION
} from '../actions/discoveryActionCreators';

function selectedTabBar(state = 'glances', action) {
    switch (action.type) {
        case SELECT_TABBAR:
            return action.selectedTabBar;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case REQUEST_PROFILE:
            return true;
        case RECEIVE_PROFILE:
            return false;
        default:
            return state;
    }
}

function profileState(state = {
    serviceable: false
}, action) {
    switch (action.type) {
        case RECEIVE_PROFILE:
            return merge({}, state, {
                id: action.response.result
            });
        default:
            return state;
    }
}

function isOpening(state = false, action) {
    switch (action.type) {
        case REQUEST_EDIT:
            return true;
        case RECEIVE_EDIT:
            return false;
        default:
            return state;
    }
}

function history(name) {
    return (state = {
        isFetching: false,
        isEnd: false,
        page: 1,
        items: []
    }, action) => {
        switch (action.type) {
            case RECEIVE_USERHISTORY:
                if (action.name !== name) {
                    return state;
                }
                const scrollState = pick(state, ['isEnd', 'page', 'items']);
                return merge({}, state, {
                    isFetching: false,
                    ...(scrollReducersCreator(RECEIVE_USERHISTORY)(scrollState, action))
                });
                return false;
            case REQUEST_USERHISTORY:
                if (action.name !== name) {
                    return state;
                }
                return merge({}, state, {
                    isFetching: true
                });
            case POST_QUESTION_RESPONSE:
                if (name !== 'questions') return state;

                if (!action.response || !action.response.result) {
                    return state;
                }
                const items = state.items || [];
                return merge({}, state, {
                    items: uniq([action.response.result].concat(items))
                });
            /*
             case RECEIVE_GLANCE:
             if(name !== 'glances') return state;

             if(!action.response ||
             !action.response.result){
             return state;
             }
             const itemsGlances = state.items || [];
             return merge({}, state,{
             items: uniq([action.response.result].concat(itemsGlances))
             });
             */
            case RESPONSE_SELF_ASKING_QUESTION:
                if (name !== 'answers') return state;

                if (!action.response || !action.response.result) {
                    return state;
                }
                const itemsAnswers = state.items || []
                return merge({}, state, {
                    items: uniq([action.response.result].concat(itemsAnswers))
                })
            default:
                return state;
        }
    }
}

function isFetchingSubscribed(state = false, action) {
    switch (action.type) {
        case REQUEST_SUBSCRIBED:
            return true;
        case RECEIVE_SUBSCRIBED:
        case FAILED_SUBSCRIBED:
            return false;
        default:
            return state;
    }
}

export default function profile(state = {}, action) {
    return {
        selectedTabBar: selectedTabBar(state.selectedTabBar, action),
        isOpening: isOpening(state.isOpening, action),
        isFetching: isFetching(state.isFetching, action),
        ...(profileState(pick(state, ['id']), action)),
        answers: history('answers')(state.answers, action),
        questions: history('questions')(state.questions, action),
        glances: history('glances')(state.glances, action),
        isFetchingSubscribed: isFetchingSubscribed(state.isFetchingSubscribed, action)
    }
}
