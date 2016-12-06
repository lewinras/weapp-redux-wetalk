import merge from '../libs/lodash.merge';
import pick from '../libs/lodash.pick';
import uniq from '../libs/lodash.uniq';
import {
  REQUEST_TALK,
  RECEIVE_TALK,
  FAILED_TALK,
  REQUEST_TALK_QUESTIONS,
  RECEIVE_TALK_QUESTIONS,
  REQUEST_TALK_COMMENTS,
  RECEIVE_TALK_COMMENTS,
  REQUEST_TALK_CONSULTATIONS,
  RECEIVE_TALK_CONSULTATIONS,
  REQUEST_TALK_AUDIO,
  REQUEST_POST_COMMENT,
  RECEIVE_POST_COMMENT,
  FAILED_POST_COMMENT,
  REQUEST_POST_APPOINTMENT,
  RECEIVE_POST_APPOINTMENT,
  FAILED_POST_APPOINTMENT,
  REQUEST_TALK_APPOINTMENT,
  RECEIVE_TALK_APPOINTMENT,
  REQUEST_TALK_CONSULTATION,
  RECEIVE_TALK_CONSULTATION,
  FAILED_TALK_CONSULTATION,
  REQUEST_COMMENT_DELETION,
  RECEIVE_COMMENT_DELETION
} from '../actions/talkActionCreators';
import {
  REQUEST_ORDER_PREPARE,
  FAILED_ORDER_PREPARE,
  REQUEST_PAYMENT,
  RECEIVE_PAYMENT,
  FAILED_PAYMENT
} from '../actions/orderActionCreators';
import scrollReducersCreator from './scrollReducersCreator';

function isFetching(state=false, action) {
  switch(action.type) {
  case REQUEST_TALK:
    return true;
  case FAILED_TALK:
  case RECEIVE_TALK:
    return false;
  default:
    return state;
  }
}

function consulting(state=null, action) {
  switch(action.type) {
  case REQUEST_TALK_CONSULTATION:
    return 'processing';
  case FAILED_TALK_CONSULTATION:
    return 'failed';
  case RECEIVE_TALK_CONSULTATION:
    return 'completed';
  default:
    return state;
  }
  /*
  if(action.scene !== 'consultation') {
    return state;
  }

  switch(action.type) {
  case REQUEST_ORDER_PREPARE:
  case REQUEST_PAYMENT:
    return 'processing';
  case FAILED_ORDER_PREPARE:
  case FAILED_PAYMENT:
    return 'failed';
  case RECEIVE_PAYMENT:
    return 'completed';
  default:
    return state;
  }
   */
}

function commenting(state=false, action) {
  switch(action.type) {
  case REQUEST_POST_COMMENT:
    return 'processing';
  case RECEIVE_POST_COMMENT:
    return 'completed';
  case FAILED_POST_COMMENT:
    return 'failed';
  default:
    return state;
  }
}

function payment(state=null, action) {
  if(action.scene !== 'talk') {
    return state;
  }

  switch(action.type) {
  case REQUEST_ORDER_PREPARE:
  case REQUEST_PAYMENT:
    return 'processing';
  case FAILED_ORDER_PREPARE:
  case FAILED_PAYMENT:
    return 'failed';
  case RECEIVE_PAYMENT:
    return 'completed';
  default:
    return state;
  }
}

function questions(state={
  isFetching: false,
  isEnd: false,
  page: 1,
  items: []
}, action) {
  switch(action.type) {
  case REQUEST_TALK_QUESTIONS:
    return Object.assign({}, state, {
      isFetching: true
    });
  case RECEIVE_TALK_QUESTIONS:
    const scrollState = pick(state, ['isEnd', 'page', 'items']);
    return Object.assign({}, state, {
      isFetching: false,
      ...(scrollReducersCreator(RECEIVE_TALK_QUESTIONS)(scrollState, action))
    });
  default:
    return state;
  }
}

function comments(state={
  isFetching: false,
  isEnd: false,
  page: 1,
  items: []
}, action) {
  let items = state.items || [];
  switch(action.type) {
  case RECEIVE_COMMENT_DELETION:
    items = (state.items || []).filter(item => item !== action.response.result);
    return Object.assign({}, state, {
      items: items
    });
  case REQUEST_TALK_COMMENTS:
    return Object.assign({}, state, {
      isFetching: true
    });
  case RECEIVE_TALK_COMMENTS:
    const scrollState = pick(state, ['isEnd', 'page', 'items']);
    return merge({}, state, {
      isFetching: false,
      ...(scrollReducersCreator(RECEIVE_TALK_COMMENTS)(scrollState, action))
    });
  case RECEIVE_POST_COMMENT:
    return Object.assign({}, state, {
      items: uniq(([action.response.result]).concat(items))
    });
  default:
    return state;
  }
}

function consultations(state={
  isFetching: false,
  isEnd: false,
  page: 1,
  items: []
}, action) {
  switch(action.type) {
  case REQUEST_TALK_CONSULTATIONS:
    return Object.assign({}, state, {
      isFetching: true
    });
  case RECEIVE_TALK_CONSULTATIONS:
    const scrollState = pick(state, ['isEnd', 'page', 'items']);
    return merge({}, state, {
      isFetching: false,
      ...(scrollReducersCreator(RECEIVE_TALK_CONSULTATIONS)(scrollState, action))
    });
  default:
    return state;
  }
}

export default function visitedTalks(state={}, action) {
  if(!action.id && !action.talkId) return state;

  switch(action.type) {
  case FAILED_TALK:
  case REQUEST_TALK:
  case RECEIVE_TALK:
  case REQUEST_TALK_QUESTIONS:
  case RECEIVE_TALK_QUESTIONS:
  case REQUEST_TALK_COMMENTS:
  case RECEIVE_TALK_COMMENTS:
  case REQUEST_TALK_CONSULTATIONS:
  case RECEIVE_TALK_CONSULTATIONS:
  case REQUEST_POST_COMMENT:
  case RECEIVE_POST_COMMENT:
  case FAILED_POST_COMMENT:
  case REQUEST_ORDER_PREPARE:
  case FAILED_ORDER_PREPARE:
  case REQUEST_TALK_CONSULTATION:
  case RECEIVE_TALK_CONSULTATION:
  case FAILED_TALK_CONSULTATION:
  case REQUEST_PAYMENT:
  case RECEIVE_PAYMENT:
  case FAILED_PAYMENT:
  case RECEIVE_COMMENT_DELETION:
    const id = action.talkId || action.id;
    const subState = state[id] || {};
    const cooked = Object.assign({}, subState, {
      isFetching: isFetching(subState.isFetching, action),
      consulting: consulting(subState.consulting, action),
      commenting: commenting(subState.commenting, action),
      payment: payment(subState.payment, action),
      questions: questions(subState.questions, action),
      comments: comments(subState.comments, action),
      consultations: consultations(subState.consultations, action)
    });
    return Object.assign({}, state, {
      [id]: cooked
    });
  default:
    return state;
  }
}
