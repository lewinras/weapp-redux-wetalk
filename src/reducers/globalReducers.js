import merge from '../libs/lodash.merge';
import isArray from '../libs/lodash.isArray';
import {
  DIALOG_SHOWED,
  DIALOG_CLOSED,
  FETCH_FAILED,
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_WX_LAYER,
  HIDE_WX_LAYER,
  PAGE_NOT_FOUND,
  MODAL_OPENED,
  MODAL_CLOSED,
  SHOW_FOOTER,
  HIDE_FOOTER,
  HACK_RE_ROUTE,
} from '../actions/globalActionCreators';

function reRoutePath(state='', action) {
  switch(action.type) {
  case HACK_RE_ROUTE:
    return action.path;
  default:
    return state;
  }
}

function dialog(state={}, action) {
  switch(action.type) {
  case DIALOG_SHOWED:
    const messages = isArray(action.message) ? action.message : [action.message];
    return {
      messages: messages,
      buttons: action.buttons
    };
  case DIALOG_CLOSED:
    return {};
  case FETCH_FAILED:
    return {
      messages: action.messages
    };
  default:
    return state;
  }
}

function loading(state=false, action) {
  switch(action.type) {
  case SHOW_LOADING:
    return true;
  case HIDE_LOADING:
    return false;
  default:
    return state;
  }
}

function wxLayer(state='', action) {
  switch(action.type) {
  case SHOW_WX_LAYER:
    return action.content;
  case HIDE_WX_LAYER:
    return '';
  default:
    return state;
  }
}

function modal(state=false, action) {
  switch(action.type) {
  case MODAL_OPENED:
    return true;
  case MODAL_CLOSED:
    return false;
  default:
    return state;
  }
}

function footer(state=true, action) {
  switch(action.type) {
  case SHOW_FOOTER:
    return true;
  case HIDE_FOOTER:
    return false;
  default:
    return state;
  }
}

export default function global(state={
  dialog: {}
}, action) {
  return {
    dialog: dialog(state.dialog, action),
    loading: loading(state.loading, action),
    wxLayer: wxLayer(state.wxLayer, action),
    modal: modal(state.modal, action),
    footer: footer(state.footer, action),
    show404: action.type === PAGE_NOT_FOUND,
    reRoutePath: reRoutePath(state.reRoutePath, action)
  };
}
