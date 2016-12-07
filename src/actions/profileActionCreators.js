import {normalize} from '../libs/normalizr.min';
import {CALL_API} from '../middlewares/api';
import Schemas from '../schemas/schema';

export const REQUEST_PROFILE = "REQUEST_PROFILE";
export const RECEIVE_PROFILE = "RECEIVE_PROFILE";

export const REQUEST_OPENING = "REQUEST_OPENING";
export const RECEIVE_OPENING = "RECEIVE_OPENING";
export const SELECT_TABBAR = "SELECT_TABBAR";

export const REQUEST_USERHISTORY = "REQUEST_USERHISTORY";
export const RECEIVE_USERHISTORY = "RECEIVE_USERHISTORY";

export const REQUEST_EDIT = "REQUEST_EDIT";
export const RECEIVE_EDIT = "RECEIVE_EDIT";

export const REQUEST_SUBSCRIBED = 'REQUEST_SUBSCRIBED';
export const RECEIVE_SUBSCRIBED = 'RECEIVE_SUBSCRIBED';
export const FAILED_SUBSCRIBED = 'FAILED_SUBSCRIBED';

function requestProfile() {
    return {
        [CALL_API]: {
            types: [REQUEST_PROFILE, RECEIVE_PROFILE],
            endpoint: 'consultation/profile.json',
            schema: Schemas.USER
        }
    };
}

function shouldFetchProfile(state) {
    const profile = state.profile;
    if (profile.isFetching) {
        return false;
    }
    return true;
}

export function fetchProfileIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchProfile(getState())) {
            return dispatch(requestProfile());
        }
    };
}

function requestProfileHistory(page, name) {
    let url = name === 'glances' ? 'paid_talks' : name;
    return {
        [CALL_API]: {
            types: [REQUEST_USERHISTORY, RECEIVE_USERHISTORY],
            endpoint: 'consultation/' + url + '?page=' + page,
            schema: Schemas.CONSULTATION_ARRAY,
            payload: {name}
        }
    };
}

function shouldFetchProfileHistory(state, scope, isInitial) {
    const {profile} = state;

    if (!profile) return false;
    if (!profile[scope]) return true;

    const history = profile[scope] || {};
    if (history.isEnd || history.isFetching) return false;
    if (history.page && history.page > 1 && isInitial) return false;
    return true;
}

export function fetchProfileHistoryIfNeeded(page = 1, scope, isInitial = false) {
    return (dispatch, getState) => {
        if (shouldFetchProfileHistory(getState(), scope, isInitial)) {
            return dispatch(requestProfileHistory(page, scope));
        }
    }
}

export function editProfile(info) {
    return (dispatch, getState) => {
        return dispatch({
            [CALL_API]: {
                types: [REQUEST_EDIT, RECEIVE_EDIT],
                endpoint: 'consultation/profile.json',
                schema: Schemas.USER,
                options: {
                    method: 'put',
                    body: JSON.stringify({
                        description: info.description
                    })
                }
            }
        });
    };
}

export function selectTabBar(name) {
    return (dispatch) => {
        return dispatch({
            selectedTabBar: name,
            type: SELECT_TABBAR,
        });
    };
}

export function requestSubscribedIfNeeded() {
    return (dispatch, getState) => {
        const state = getState();
        const profile = state.profile || {};
        if (!profile.isFetchingSubscribed) {
            return dispatch({
                [CALL_API]: {
                    types: [REQUEST_SUBSCRIBED, RECEIVE_SUBSCRIBED, FAILED_SUBSCRIBED],
                    endpoint: 'consultation/profile/subscribed.json',
                    schema: Schemas.USER
                }
            })
        }
    }
}
