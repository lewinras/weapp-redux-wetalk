import { CALL_API } from '../middlewares/api';
import Schemas from '../schemas/schema';
import { arrayOf } from '../libs/normalizr.min';

export const REQUEST_DISCOVERIES = "REQUEST_DISCOVERIES ";
export const RECEIVE_DISCOVERIES = "RECEIVE_DISCOVERIES ";

function fetchUserDiscorveries(page){
    return {
      [CALL_API]: {
        types: [REQUEST_DISCOVERIES , RECEIVE_DISCOVERIES],
        endpoint: 'consultation/collections.json?page=' + page,
        schema: arrayOf(Schemas.DISCOVERY_SUBJECT),
      }
    };
}

export const REQUEST_SUBJECT = "REQUEST_SUBJECT";
export const RECEIVE_SUBJECT = "RECEIVE_SUBJECT";

function shouldFetchUserDiscorveries(state, isInitial){
  const discoveries = state.discoveries || {};
  const { isFetching, isEnd, items } = discoveries;

  if(isFetching || isEnd) {
    return false;
  }

  if(discoveries.page && discoveries.page > 1 && isInitial) {
    return false;
  }

  return true;
}

export function fetchUserDiscorveriesIfNeeded(page, isInitial=false){
  return (dispatch, getState)=>{
    if(shouldFetchUserDiscorveries(getState(), isInitial)){
      return dispatch(fetchUserDiscorveries(page));
    }
  };
}

function shouldFetchUserSubject(state, id){
  const visitedUsersSubjects = state.visitedUsersSubjects || {};
  const { isFetching } = visitedUsersSubjects[id] || {};
  return !isFetching;
}

function fetchUserSubject(id){
  return{
    [CALL_API]: {
      types: [REQUEST_SUBJECT, RECEIVE_SUBJECT],
      endpoint: 'consultation/collections/' + id + '.json',
      schema: Schemas.DISCOVERY_SUBJECT,
      payload: {
        id: id,
      }
    }
  }
}


export function fetchUserSubjectIfNeeded(id){
  return (dispatch, getState)=>{
    if(shouldFetchUserSubject(getState(), id)){
      return dispatch(fetchUserSubject(id));
    }
  }
}


export const POST_SUBJECT_CREATOR = "POST_SUBJECT_CREATOR";
export const RESPONSE_SUBJECT_CREATOR = "RESPONSE_SUBJECT_CREATOR";

export function createSubjectIfNeeded(info){
  return (dispatch, getState)=>{
    if (shouldCreateSubject(getState())) {
      return dispatch(createSubject(info));
    }
  }
}

function createSubject(info) {
  return{
    [CALL_API]: {
        types: [POST_SUBJECT_CREATOR, RESPONSE_SUBJECT_CREATOR],
        endpoint: 'consultation/collections.json',
        schema: Schemas.DISCOVERY_SUBJECT,
        options: {
          method: 'post',
          body: JSON.stringify({
            title: info.title,
            description: info.description
        })
      }
    }
  }
}

function shouldCreateSubject(state) {
  const { discoveries: {
    isCreatingSubject
  }, } = state;
  return !isCreatingSubject;
}

export const JOIN_USER_SUBJECT = "JOIN_USER_SUBJECT";
export const JOIN_USER_SUBJECT_SUCCESS = "JOIN_USER_SUBJECT_SUCCESS";

export function joinUserSubjectIfNeeded(id, userId){
  return (dispatch, getState)=>{
    if (shouldJoinUserSubject(getState())) {
      return dispatch(joinUserSubject(id, userId))
    }
  }
}

function shouldJoinUserSubject(state){
  const { discoveries: {
    isFetching
  }} = state;
  return !isFetching;
}

function joinUserSubject(id, userId){
  return{
    [CALL_API]: {
      types: [JOIN_USER_SUBJECT, JOIN_USER_SUBJECT_SUCCESS],
      endpoint: "consultation/collections/" + id + "/members.json",
      schema: Schemas.DISCOVERY_SUBJECT,
      options: {
        method: 'post',
      },
      payload:{
        id: id,
        userId: userId
      }
    }
  }
}

export function editSubjectIfNeeded(info){
  return (dispatch, getState)=>{
    if(shouldEditSubject(getState())){
      return dispatch(editSubject(info));
    }
  }
}

function shouldEditSubject(state){
  return shouldCreateSubject(state);
}

function editSubject(info){
  return{
    [CALL_API]: {
      types: [POST_SUBJECT_CREATOR, RESPONSE_SUBJECT_CREATOR],
      endpoint: "consultation/collections/" + info.id + ".json",
      schema: Schemas.DISCOVERY_SUBJECT,
      options: {
        method: 'put',
        body: JSON.stringify({
          title: info.title,
          description: info.description
        })
      },
      payload:{
        id: info.id,
      }
    }
  }
}

export const REQUEST_SUBJECT_QUESTIONS = "REQUEST_SUBJECT_QUESTIONS";
export const RECEIVE_SUBJECT_QUESTIONS = "RECEIVE_SUBJECT_QUESTIONS";

function shouldFetchSubjectQuestion(state, id, isInitial){
  const { visitedUserSubjects } = state;
  const data = visitedUserSubjects[id];
  if(data && data.questions && (data.questions.isFetching || data.questions.isEnd)){
    return false;
  }
  if(data && data.page && data.page > 1 && isInitial){
    return false;
  }
  return true;
}

export function fetchSubjectQuestionIfNeeded(page=1, id, isInitial){
  return (dispatch, getState)=>{
    if (shouldFetchSubjectQuestion(getState(), id, isInitial)) {
      return dispatch(fetchQuestion(page, id));
    }
  }
}

function fetchQuestion(page, id){
  return{
    [CALL_API]: {
      types: [REQUEST_SUBJECT_QUESTIONS, RECEIVE_SUBJECT_QUESTIONS],
      endpoint: "consultation/collections/" + id + "/consultations.json?page=" + page,
      schema: Schemas.CONSULTATION_ARRAY,
      payload: {
        id: id,
        page: page,
        name: "questions",
      }
    }
  }
}

export const REQUEST_SUBJECT_USERS = "REQUEST_SUBJECT_USERS";
export const RECEIVE_SUBJECT_USERS = "RECEIVE_SUBJECT_USERS";

export function fetchSubjectUsersIfNeeded(page=1, id, isInitial=false){
  return (dispatch, getState)=>{
    if(shouldFetchSubjectUsers(getState(), id, isInitial)){
      return dispatch(fetchSubjectUsers(page, id));
    }
  };
}

function shouldFetchSubjectUsers(state, id, isInitial){
  const { visitedUserSubjects } = state;
  const data = visitedUserSubjects[id];
  if(data && data.users && (data.users.isFetching || data.users.isEnd ) ){
    return false;
  }
  if(data && data.page && data.page > 1 && isInitial){
    return false;
  }
  return true;
}

function fetchSubjectUsers(page, id){
  return {
    [CALL_API]: {
      types: [REQUEST_SUBJECT_USERS, RECEIVE_SUBJECT_USERS],
      endpoint: 'consultation/collections/' + id + '/users.json?page=' + page,
      schema: Schemas.USER_ARRAY,
      payload: {
        page:page,
        id: id,
        name: "users"
      }
    }
  }
}

export const POST_SELF_ASKING_QUESTION = "POST_SELF_ASKING_QUESTION";
export const RESPONSE_SELF_ASKING_QUESTION = "RESPONSE_SELF_ASKING_QUESTION";

function shouldPostSelfAskingQuestion(state){
  const { discoveries } = state;
  return !discoveries.isPostSelfAskingQuestion.isPosting;
}

export function postSelfAskingQuestionIfNeeded(info){
  return (dispatch, getState)=> {
    if(shouldPostSelfAskingQuestion(getState())){
      dispatch(postSelfAskingQuestion(info));
    }
  }
}

function  postSelfAskingQuestion(info){
  return {
    [CALL_API]: {
      types: [POST_SELF_ASKING_QUESTION, RESPONSE_SELF_ASKING_QUESTION],
      endpoint: 'consultation/default_issues/' + info.id + '/answers.json',
      schema: Schemas.CONSULTATION,
      options: {
        method: 'POST',
        body:JSON.stringify(info)
      }
    }
  };
}

export const REQUEST_DEFAULT_ISSUE = "REQUEST_DEFAULT_ISSUE";
export const RESPONSE_DEFAULT_ISSUE = "RESPONSE_DEFAULT_ISSUE";
export const FAILED_DEFAULT_ISSUE = "FAILED_DEFAULT_ISSUE";

function shouldRequestDefaultIssue(state, id){
  return true;
}

export function requestDefaultIssueIfNeed(id){
  return (dispatch, getState)=>{
    if(shouldRequestDefaultIssue(getState(), id)){
      return dispatch(requestDefaultIssue(id));
    }
  }
}

function requestDefaultIssue(id){
  return {
    [CALL_API]: {
      endpoint: 'consultation/default_issues/' + id + '.json',
      types: [REQUEST_DEFAULT_ISSUE, RESPONSE_DEFAULT_ISSUE, FAILED_DEFAULT_ISSUE],
      schema: Schemas.DEFAULT_ISSUE,
    }
  };
}
