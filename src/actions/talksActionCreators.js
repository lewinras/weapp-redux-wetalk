/**
 * Created by luqingchuan on 2016/12/1.
 */
export const REQUEST_TALKS = 'REQUEST_TALKS';
export const RECEIVE_TALKS = 'RECEIVE_TALKS';
export const SET_REFS = 'SET_REFS';
import {CALL_API} from '../middlewares/api';
import Schemas from '../schemas/schema';

function fetchTalks(page = 1, refs = '', id) {
    refs = encodeURIComponent(refs);
    let category_id = id === 0 ? '' : 'category_id=' + id;
    const endpoint = `consultation/talks.json?${category_id}&page=${page}&refs=${refs}`;
    const types = [REQUEST_TALKS, RECEIVE_TALKS];
    const isForce = page === 1;
    return {
        [CALL_API]: {
            types: types,
            endpoint: endpoint,
            schema: {talks: Schemas.TALK_ARRAY, banners: Schemas.POSTER_ARRAY},
            payload: {
                isForce: isForce,
                id: id
            }
        }
    };
}

export function fetchTalksIfNeeded(page = 1, refs = '', id = 0) {
    return (dispatch, getState) => {
        if (shouldFetchTalks(getState(), refs, id))
            return dispatch(fetchTalks(page, refs, id));
    };
}

function shouldFetchTalks(state, refs = '', id) {
    const currentState = state.talks[id] || {};
    const {isFetching, isEnd, items, totalCount} = currentState;
    if (isFetching) {
        return false;
    }
    return true;
}

export const REQUEST_POSTERS = "REQUEST_POSTERS";
export const RECEIVE_POSTERS = "RECEIVE_POSTERS";

function requestPosters() {
    return {
        [CALL_API]: {
            endpoint: 'consultation/banners',
            schema: Schemas.POSTER_ARRAY,
            types: [REQUEST_POSTERS, RECEIVE_POSTERS]
        }
    };
}

function shouldRequestPosters(state) {
    return !state.posters.isFetching;
}

export function requestPostersIfNeeded() {
    return (dispatch, getState) => {
        if (shouldRequestPosters(getState()))
            return dispatch(requestPosters());
    };
}
