import { CALL_API } from '../middlewares/api';
import Schemas from '../schemas/schema';

export const REQUEST_CONSULTANT = 'REQUEST_CONSULTANT';
export const RECEIVE_CONSULTANT = 'RECEIVE_CONSULTANT';

export function fetchConsultant(id, collectionId) {
  let endpoint = 'consultation/users/' + id + '.json';
  if(collectionId && collectionId !== '') {
    endpoint = endpoint + '?from_collection=' + collectionId
  }
  return {
    [CALL_API]: {
      types: [REQUEST_CONSULTANT, RECEIVE_CONSULTANT],
      endpoint: endpoint,
      schema: Schemas.USER,
      payload: {
        id: id
      }
    }
  };
}

export const POST_QUESTION_REQUEST = 'POST_QUESTION_REQUEST';
export const POST_QUESTION_RESPONSE = 'POST_QUESTION_RESPONSE';
export const POST_QUESTION_FAILED = 'POST_QUESTION_FAILED';

export function postQuestion(info) {
  return{
    [CALL_API]: {
      types: [POST_QUESTION_REQUEST, POST_QUESTION_RESPONSE, POST_QUESTION_FAILED],
      endpoint: 'consultation/users/' + info.id + '/consultations.json',
      schema: Schemas.CONSULTATION,
      options: {
        method: 'post',
        body: JSON.stringify({
          question: info.question,
          anonymous: info.anonymous,
          collection_id: info.collection_id
        })
      },
      payload: {
        id: info.id
      }
    }
  };
}

export const REQUEST_USER_ANSWERS = "REQUEST_USER_ANSWERS";
export const RECEIVE_USER_ANSWERS = "RECEIVE_USER_ANSWERS";

function shouldFetchUserAnswers(state, userId, isInitial){
  const { visitedConsultants } = state;
  const data = visitedConsultants[userId].answers;
  if(data.isFetching || data.isEnd){
    return false;
  }
  if(data.page && data.page > 1 && isInitial) {
    return false;
  }
  return true;
}

export function fetchUserAnswersIfNeeded(page=1, userId, isInitial){
  return (dispatch, getState)=>{
    if(shouldFetchUserAnswers(getState(), userId, isInitial)){
      return dispatch(fetchUserAnswers(page, userId));
    }
  }
}

export function fetchUserAnswers(page, userId){
  return {
    [CALL_API]: {
      types: [REQUEST_USER_ANSWERS, RECEIVE_USER_ANSWERS],
      endpoint: 'consultation/users/' + userId + "/answers.json?page=" + page,
      schema: Schemas.CONSULTATION_ARRAY,
      payload: {
        id: userId
      }
    }
  };
}

function shouldPostQuestion(state, id){
  const { visitedConsultants, } = state;
  let data = visitedConsultants[id];
  return !data.isPosting;
}

export function postQuestionIfNeeded(info){
  return (dispatch, getState)=> {
    if(shouldPostQuestion(getState(), info.id)){
      return dispatch(postQuestion(info));
    }
  }
}
