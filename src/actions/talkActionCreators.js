import { CALL_API } from '../middlewares/api';
import Schemas from '../schemas/schema';
import { alertInfo } from './globalActionCreators';

export const REQUEST_TALK = 'REQUEST_TALK';
export const RECEIVE_TALK = 'RECEIVE_TALK';

export function fetchTalk(id) {
  let endpoint = 'consultation/talks/' + id + '.json';

  return {
    [CALL_API]: {
      types: [REQUEST_TALK, RECEIVE_TALK],
      endpoint: endpoint,
      schema: Schemas.TALK,
      payload: {
        id: id
      }
    }
  };
}

export const REQUEST_COMMENT_TALK = 'REQUEST_COMMENT_TALK';
export const RECEIVE_COMMENT_TALK = 'RECEIVE_COMMENT_TALK';
export const FAILED_COMMENT_TALK = 'FAILED_COMMENT_TALK';

export function commentTalk(talkId, content) {
  return {
    [CALL_API]: {
      types: [REQUEST_COMMENT_TALK, RECEIVE_COMMENT_TALK, FAILED_COMMENT_TALK],
      endpoint: 'consultation/talks/' + talkId + '/comments.json',
      schema: Schemas.COMMENT,
      options: {
        method: 'post',
        body: JSON.stringify({
          content: content
        })
      },
      payload: {
        talkId: talkId
      }
    }
  }
}

function shouldFetchResultContents(type, state, talkId, isInitial) {
  const { visitedTalks } = state;
  if(!visitedTalks || !visitedTalks[talkId]) return false;

  const talk = visitedTalks[talkId] || {};
  const contents = talk[type] || {};
  const items = contents.items || [];
  if(contents.isEnd || contents.isFetching) return false;
  if(contents.page && contents.page > 1 && isInitial) return false;
  return true;
}

export const REQUEST_TALK_COMMENTS = 'REQUEST_TALK_COMMENTS';
export const RECEIVE_TALK_COMMENTS = 'RECEIVE_TALK_COMMENTS';

function requestComments(talkId, page) {
  return {
    [CALL_API]: {
      types: [REQUEST_TALK_COMMENTS, RECEIVE_TALK_COMMENTS],
      endpoint: 'consultation/talks/' + talkId + '/comments.json?page=' + page,
      schema: Schemas.COMMENT_ARRAY,
      payload: { id: talkId }
    }
  }
}

export function fetchCommentsIfNeeded(talkId, page=1, isInitial=false) {
  return (dispatch, getState) => {
    if(shouldFetchResultContents('comments', getState(), talkId, isInitial)) {
      return dispatch(requestComments(talkId, page));
    }
  }
}

export const REQUEST_TALK_QUESTIONS = 'REQUEST_TALK_QUESTIONS';
export const RECEIVE_TALK_QUESTIONS = 'RECEIVE_TALK_QUESTIONS';

function requestQuestions(talkId, page, isForce) {
  return {
    [CALL_API]: {
      types: [REQUEST_TALK_QUESTIONS, RECEIVE_TALK_QUESTIONS],
      endpoint: 'consultation/talks/' + talkId + '/questions.json?page=' + page,
      schema: Schemas.TALK_QUESTION_ARRAY,
      payload: { id: talkId, isForce }
    }
  }
}

export function fetchQuestionsIfNeeded(talkId, page=1, isInitial=false, isForce=false) {
  return (dispatch, getState) => {
    if(isForce) {
      return dispatch(requestQuestions(talkId, 1));
    }
    else if(shouldFetchResultContents('questions', getState(), talkId, isInitial)) {
      return dispatch(requestQuestions(talkId, page));
    }
  }
}

export const REQUEST_TALK_CONSULTATIONS = 'REQUEST_TALK_CONSULTATIONS';
export const RECEIVE_TALK_CONSULTATIONS = 'RECEIVE_TALK_CONSULTATIONS';

function requestConsultations(talkId, page) {
  return {
    [CALL_API]: {
      types: [REQUEST_TALK_CONSULTATIONS, RECEIVE_TALK_CONSULTATIONS],
      endpoint: 'consultation/talks/' + talkId + '/consultations.json?page=' + page,
      schema: Schemas.CONSULTATION_ARRAY,
      payload: { id: talkId }
    }
  }
}

export function fetchConsultationsIfNeeded(talkId, page=1, isInitial=false) {
  return (dispatch, getState) => {
    if(shouldFetchResultContents('consultations', getState(), talkId, isInitial)) {
      return dispatch(requestConsultations(talkId, page));
    }
  }
}

export const REQUEST_POST_COMMENT = 'REQUEST_POST_COMMENT';
export const RECEIVE_POST_COMMENT = 'RECEIVE_POST_COMMENT';
export const FAILED_POST_COMMENT = 'FAILED_POST_COMMENT';

function postCommentFailed(dispatch, error) {
  alertInfo((error && (error.errors || error)) || i18next.t('common.error'))(dispatch);
  return FAILED_POST_COMMENT;
}

function postComment(info) {
  return {
    [CALL_API]: {
      types: [REQUEST_POST_COMMENT, RECEIVE_POST_COMMENT, postCommentFailed],
      endpoint: 'consultation/talks/' + info.id + '/comments.json?from=talk',
      schema: Schemas.COMMENT,
      options: {
        method: 'post',
        body: JSON.stringify({
          content: info.content,
          parent_id: info.parentId
        })
      },
      payload: {
        id: info.id
      }
    }
  }
}

function shouldPostComment(state, id) {
  const { visitedTalks } = state;
  return (visitedTalks[id] || {}).commenting !== 'processing';
}

export function postCommentIfNeeded(info) {
  return (dispatch, getState) => {
    if(shouldPostComment(getState(), info.id)) {
      return dispatch(postComment(info));
    }
  }
}

export const REQUEST_COMMENT_DELETION = 'REQUEST_COMMENT_DELETION';
export const RECEIVE_COMMENT_DELETION = 'RECEIVE_COMMENT_DELETION';

export function deleteComment(talkId, id) {
  return {
    [CALL_API]: {
      types: [REQUEST_COMMENT_DELETION, RECEIVE_COMMENT_DELETION],
      endpoint: `consultation/comments/${id}.json`,
      schema: Schemas.COMMENT,
      options: {
        method: 'delete'
      },
      payload: { talkId }
    }
  }
}

export const REQUEST_TALK_APPOINTMENT = 'REQUEST_POST_CONSULTATION';
export const RECEIVE_TALK_APPOINTMENT = 'RECEIVE_POST_CONSULTATION';

export function requestTalkAppointment() {
  
}

function shouldRequestTalkAppointment() {
  
}

export function requestTalkAppointmentIfNeed() {
  return (dispatch, getState) => {
    if(shouleRequestTalkAppointment()){
      return dispatch(requestTalkAppointment());
    }
  };
}

export const REQUEST_POST_APPOINTMENT = 'REQUEST_POST_CONSULTATION';
export const RECEIVE_POST_APPOINTMENT = 'RECEIVE_POST_CONSULTATION';
export const FAILED_POST_APPOINTMENT = 'FAILED_POST_CONSULTATION';

export function postAppointment(){
  return {
    [CALL_API]: {
      types: [REQUEST_POST_APPOINTMENT, RECEIVE_POST_APPOINTMENT, FAILED_POST_APPOINTMENT],
      endpoint: 'consultation',
    }
  };
}

export function shouldPostAppointment(){
}

export function postAppointmentIfNeeded(){
  return (dispatch, getState) => {
    if(shouldPostAppointment()){
      return dispatch(postAppointment());
    }
  };
}

export const REQUEST_TALK_CONSULTATION = 'REQUEST_TALK_CONSULTATION';
export const RECEIVE_TALK_CONSULTATION = 'RECEIVE_TALK_CONSULTATION';
export const FAILED_TALK_CONSULTATION = 'FAILED_TALK_CONSULTATION';

function postConsultationFailed(dispatch, error) {
  alertInfo((error && (error.errors || error)) || i18next.t('common.error'))(dispatch);
  return FAILED_TALK_CONSULTATION;
}

function postConsultation(talkId, info) {
  return {
    [CALL_API]: {
      types: [REQUEST_TALK_CONSULTATION, RECEIVE_TALK_CONSULTATION, postConsultationFailed],
      endpoint: 'consultation/talks/' + talkId + '/consultations.json',
      schema: Schemas.COMMENT,
      options: {
        method: 'post',
        body: JSON.stringify({
          question: info.question
        })
      },
      payload: {
        talkId: talkId
      }
    }
  };
}

function shouldPostConsultation(state, talkId) {
  const visitedTalks = state.visitedTalks;

  if(!visitedTalks || !visitedTalks[talkId]) return false;

  const talk = visitedTalks[talkId] || {};
  return talk.consulting !== 'processing';
}

export function postConsultationIfNeeded(talkId, info) {
  return (dispatch, getState) => {
    if(shouldPostConsultation(getState(), talkId)) {
      return dispatch(postConsultation(talkId, info));
    }
  }
}
