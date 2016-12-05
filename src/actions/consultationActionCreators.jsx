import { CALL_API } from '../middlewares/api';
import Schemas from '../schemas/schema';

export const REQUEST_CONSULTATION = 'REQUEST_CONSULTATION';
export const RECEIVE_CONSULTATION = 'RECEIVE_CONSULTATION';
export const FAILED_CONSULTATION = 'FAILED_CONSULTATION';

export function fetchConsultation(id) {
  return {
    [CALL_API]: {
      types: [ REQUEST_CONSULTATION, RECEIVE_CONSULTATION, FAILED_CONSULTATION ],
      endpoint: 'consultation/consultations/' + id + '.json',
      schema: Schemas.CONSULTATION,
      payload: {
        id: id
      }
    }
  };
}

export const REQUEST_LIKE_CONSULTATION = 'REQUEST_LIKE_CONSULTATION';
export const RECEIVE_LIKE_CONSULTATION = 'RECEIVE_LIKE_CONSULTATION';

export function likeConsultation(id) {
  return {
    [CALL_API]: {
      types: [ REQUEST_LIKE_CONSULTATION, RECEIVE_LIKE_CONSULTATION ],
      endpoint: 'consultation/consultations/' + id + '/likes.json',
      schema: Schemas.CONSULTATION,
      options: {
        method: 'post'
      },
      payload: {
        id: id
      }
    }
  };
}

export const REQUEST_GLANCE = 'REQUEST_GLANCE';
export const RECEIVE_GLANCE = 'RECEIVE_GLANCE';

export function glanceConsultation(id) {
  return {
    [CALL_API]: {
      types: [ REQUEST_GLANCE, RECEIVE_GLANCE ],
      endpoint: 'consultation/consultations/' + id + '/glances.json',
      schema: Schemas.CONSULTATION,
      options: {
        method: 'post'
      },
      payload: {
        id: id
      }
    }
  }
}

export const REQUEST_ANSWER = 'REQUEST_ANSWER';
export const RECEIVE_ANSWER = 'RECEIVE_ANSWER';

export function answerConsultation(id, answer) {
  return {
    [CALL_API]: {
      types: [ REQUEST_ANSWER, RECEIVE_ANSWER ],
      endpoint: 'consultation/consultations/' + id + '/answers.json',
      schema: Schemas.CONSULTATION,
      options: {
        method: 'post',
        body: JSON.stringify({
          answer: answer
        })
      },
      payload: {
        id: id
      }
    }
  }
}
