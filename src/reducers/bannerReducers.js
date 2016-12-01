import merge from '../libs/lodash.merge';
import pick from '../libs/lodash.pick';
import {
  REQUEST_BANNER_CATEGORY,
  RECEIVE_BANNER_CATEGORY,
  CHANGE_CATEGORY,
} from '../actions/bannerActionCreators';

import scrollReducersCreator from './scrollReducersCreator';

export default function banners(state={
  isFetchingBanner: false,
  banners: [],
  selectedIndex: 0,
}, action){
  return {
    isFetchingBanner: isFetchingBanner(state, action),
    banners: returnBanners(state, action),
    selectedIndex: selectedIndex(state.selectedIndex, action),
  }
}

function isFetchingBanner(state, action) {
  switch(action.type){
    case REQUEST_BANNER_CATEGORY:
      return true;
    case RECEIVE_BANNER_CATEGORY:
      return false;
    default:
      return state.isFetchingBanner;
  };
}

function selectedIndex(state, action){
  switch(action.type){
  case CHANGE_CATEGORY:
    return action.id;
  default:
    return state;
  }
}

function returnBanners(state, action) {
  switch (action.type) {
    case RECEIVE_BANNER_CATEGORY:
      return action.response.result;
    default:
      return state.banners;
  }
}
