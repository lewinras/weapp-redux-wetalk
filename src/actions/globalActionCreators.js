export const FETCH_FAILED = 'FETCH_FAILED';
export const UNAUTH = 'UNAUTH';
export const PAGE_NOT_FOUND = "PAGE_NOT_FOUND";

export const DIALOG_SHOWED = 'DIALOG_SHOWED';
export const DIALOG_CLOSED = 'DIALOG_CLOSED';

function dialogShowed(opts={}) {
  return {
    type: DIALOG_SHOWED,
    message: opts.message,
    buttons: opts.buttons
   }
}

function dialogClosed() {
  return {
    type: DIALOG_CLOSED
  }
}

export function showDialog(opts={}) {
  return dispatch => {
    return dispatch(dialogShowed(opts));
  }
}

export function closeDialog() {
  return dispatch => {
    return dispatch(dialogClosed());
  }
}

export function alertInfo(message) {
  return dispatch => {
    return dispatch(dialogShowed({message: message}));
  }
}

export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';
export function loading() {
  return {
    type: SHOW_LOADING
  }
}

export function dismissLoading() {; return {
    type: HIDE_LOADING
  }
}

export const SHOW_WX_LAYER = 'SHOW_WX_LAYER';
export const HIDE_WX_LAYER = 'HIDE_WX_LAYER';
export function showWxLayer(content) {
  return {
    type: SHOW_WX_LAYER,
    content: content
  }
}
export function hideWxLayer() {
  return {
    type: HIDE_WX_LAYER
  }
}

export const MODAL_OPENED = 'MODAL_OPENED';
export const MODAL_CLOSED = 'MODAL_CLOSED';
export function openModal() {
  return {
    type: MODAL_OPENED
  }
}

export function closeModal() {
  return {
    type: MODAL_CLOSED
  }
}

export const SHOW_FOOTER = 'SHOW_FOOTER';
export const HIDE_FOOTER = 'HIDE_FOOTER';
export function showFooter() {
  return {
    type: SHOW_FOOTER
  };
}

export function hideFooter() {
  return {
    type: HIDE_FOOTER
  }
}

export const HACK_RE_ROUTE = "HACK_RE_ROUTE";

export function hackReRoute(path) {
  return (dispatch) => {
    dispatch({
      type: HACK_RE_ROUTE,
      path: path
    });
  }
}
