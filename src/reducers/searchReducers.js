import pick from '../libs/lodash.pick';
import {
  REQUEST_SEARCH_RESULT,
  RECEIVE_SEARCH_RESULT,
  CLEAR_SEARCH,
} from  '../actions/searchActionCreators.js';
import scrollReducersCreator from './scrollReducersCreator';

function isFetching(state=false, action) {
  switch(action.type) {
  case REQUEST_SEARCH_RESULT:
    return true;
  case RECEIVE_SEARCH_RESULT:
    return false;
  default:
    return state;
  }
}

function isSearching(state=false, action) {
  switch(action.type) {
  case REQUEST_SEARCH_RESULT:
    return true;
  case CLEAR_SEARCH:
    return false;
  default:
    return state;
  }
}

function searchState(state = {
  isEnd: false,
  page: 1,
  items: [],
}, action) {
  switch(action.type){
  case CLEAR_SEARCH:
    return {
      isEnd: false,
      page: 1,
      items: [],
    }
  case REQUEST_SEARCH_RESULT:
    return clearState(state, action)(action.text !== state.text)
  case RECEIVE_SEARCH_RESULT:
    return scrollReducersCreator(RECEIVE_SEARCH_RESULT)(pick(state, ['isEnd', 'page', 'items'],), action);
  default:
    return state;
  }
}

function clearState(state, action){
  return (shouldClear)=> {
    if(shouldClear){
      return {
        isEnd: false,
        page: 1,
        items: [],
      }
    }else{
      return state;
    }
  }
}

function searchingText(text='', action){
  switch(action.type){
  case REQUEST_SEARCH_RESULT:
    return action.text;
  case CLEAR_SEARCH:
    return '';
  default:
    return text;
  }
}

export default function search(state={
  
}, action) {
  return {
    isFetching: isFetching(state.isFetching, action),
    ...(
      searchState(state, action)
    ),
    isSearching: isSearching(state.isSearching, action),
    text: searchingText(state.text, action)
  }
}
