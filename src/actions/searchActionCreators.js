import { CALL_API } from '../middlewares/api';
import Schemas from '../schemas/schema';

export const REQUEST_SEARCH_RESULT = 'REQUEST_SEARCH_REQUEST';
export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_REQUEST';

function fetchSearchResult(text, page) {
  return {
    [CALL_API]: {
      types: [REQUEST_SEARCH_RESULT, RECEIVE_SEARCH_RESULT],
      endpoint: 'consultation/search.json?type=lectures&utf8=✓&q=' + text + "&page=" + page,
      schema: { talks: Schemas.TALK_ARRAY },
      payload: {
        text: text
      }
    }
  }
}

function shouldSearchResult(state, isInitail, retext) {
  const {search: {
    items,
    isFetching,
    isEnd,
    text
  }} = state;
  if(retext=== '')
    return false;
  if(text && retext === text){
    if(isFetching || isEnd){
      return false;
    }
    if(state.page && state.page > 1 && isInitail) {
      return false;
    }
  }
  return true;
}

export function search(text, page=1, isInitail=false) {
  return (dispatch, getState) => {
    if(shouldSearchResult(getState(), isInitail, text)){
      return dispatch(fetchSearchResult(text, page));
    }
  }
}

export const CLEAR_SEARCH = 'CLEAR_SEARCH';

export function clearSearch() {
  return (dispatch, getState) => {
    return dispatch({
        type: CLEAR_SEARCH
    });
  }
}
