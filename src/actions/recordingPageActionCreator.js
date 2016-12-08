import { CALL_API } from '../middlewares/api';
import Schemas from '../schemas/schema';

export const REQUEST_TALK_ANSWERS = "REQUEST_TALK_ANSWERS";
export const RECEIVE_TALK_ANSWERS = "RECEIVE_TALK_ANSWERS";

// get talk
function requestTalkQuestions(id) {
  return {
    [CALL_API]: {
      types: [REQUEST_TALK_ANSWERS, RECEIVE_TALK_ANSWERS],
      endpoint: 'consultation/record_answers/' + id + '.json',
      schema: Schemas.TALK,
      payload: {
        id: id
      }
    }
  };
}

function shouldRequestTalkQuestions(state, id) {
  const {
    recordingPage
  } = state;
  return !recordingPage.isFetching;
}

export function requestTalkQuestionsIfNeed(id) {
  return (dispatch, getState) => {
    if(shouldRequestTalkQuestions(getState(), id)) {
      return dispatch (requestTalkQuestions(id));
    }
  };
}

// start record

export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';

function startRecording(id) {
  return {
    type: START_RECORDING,
    id
  };
}

function shouldStartRecording(state) {
  const {
    recordingPage
  } = state;
  return !recordingPage.isRecording;
}

export function startRecordingIfNeeded(talkId, id, callback) {
  return (dispatch, getState) => {
    if(shouldStartRecording(getState())) {
      wx.startRecord();
      wx.onVoiceRecordEnd({
        complete: (res) => {
          let localId = res.localId;
          uploadVoiceToWXServer(dispatch, talkId, localId, id, getState(), callback);
        }
      });
      return dispatch(startRecording(id));
    }
  };
}

// stop record

function stopRecording(id) {
  return {
    type: STOP_RECORDING,
    id
  };
}

function shouldStopRecording(state) {
  const {
    recordingPage
  } = state;
  return recordingPage.isRecording;
}

export function stopRecordingIfNeeded(talkId, id, callback) {
  return (dispatch, getState) => {
    if(shouldStopRecording(getState())){
      wx.stopRecord({
        success: (res) => {
          let localId = res.localId;
          uploadVoiceToWXServer(dispatch, talkId, localId, id, getState(), callback);
        }
      });
      return dispatch(stopRecording(id));
    }
  };
}

function uploadVoiceToWXServer(dispatch, talkId, localId, questionId, state, callback) {
  const time = state.recordingPage.recordingTime;
  wx.uploadVoice({
    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
    isShowProgressTips: 1, // 默认为1，显示进度提示
    success: (res) => {
      let serverId = res.serverId; // 返回音频的服务器端ID
      callback(questionId, localId, serverId, time);
    }
  });
}

//play voice
export const PLAY_VOICE = "PLAY_VOICE";

export function playVoice(answerId) {
  return (dispatch) => dispatch({
    type: PLAY_VOICE,
    playingId: answerId
  });
}

// stop playVoice

// commit voice

export const RECEIVE_SET_TALK_ANSWER = "RECEIVE_SET_TALK_ANSWER";

export function sendAnswerToQuestion(questionId, localId, serverId, time){
  return {
    type:  RECEIVE_SET_TALK_ANSWER,
    localId: localId,
    serverId: serverId,
    questionId: questionId
  };
}

//delete voice

export const RECEIVE_DELETE_ANSWER = "RECEIVE_DELETE_ANSWER";

function deleteVoice(questionId, answerId) {
  return {
    type:  RECEIVE_DELETE_ANSWER,
    questionId,
    answerId
  };
}

export function deleteVoiceIfNeeded(talkId, questionId, answerId) {
  return (dispatch) => dispatch(deleteVoice(talkId, questionId, answerId));
}

// timer
export const SET_RECORDING_TIME = "SET_RECORDING_TIME";

function shouldSetRecordingTime(state) {
  const {
    recordingPage
  } = state;
  return recordingPage.isRecording;
}

export function setRecordingTimeIfNeeded() {
  return  (dispatch, getState) => {
    if(shouldSetRecordingTime(getState())){
      return dispatch({
        type: SET_RECORDING_TIME
      });
    }
  };
}

// submit talk

export const REQUEST_SUBMIT_TALK = "REQUEST_SUBMIT_TALK";
export const RECEIVE_SUBMIT_TALK = "RECEIVE_SUBMIT_TALK";
export const RECEIVE_SUBMIT_ERROR = "RECEIVE_SUBMIT_ERROR";

function submitTalk(talkId, type) {
  return {
    [CALL_API]: {
      types: [REQUEST_SUBMIT_TALK, RECEIVE_SUBMIT_TALK, RECEIVE_SUBMIT_ERROR],
      endpoint: 'consultation/record_answers/' + talkId + '/submission.json?',
      schema: Schemas.TALK,
      options: {
        method: 'post',
        body: JSON.stringify({
          answer_type: type
        })
      }
    }
  }
}

function shouldSubmitTalk(state) {
  const {
    recordingPage
  } = state;
  return !recordingPage.isSubmiting;
}

export function submitTalkIfNeeded(talkId, type) {
  return (dispatch, getState) => {
    if(shouldSubmitTalk(getState())){
      return dispatch(submitTalk(talkId, type));
    }
  };
}

export const REQUEST_AUTO_SAVE_CONTENT = "REQUEST_AUTO_SAVE_CONTENT";
export const RECEIVE_AUTO_SAVE_CONTENT = "RECEIVE_AUTO_SAVE_CONTENT";

export function autoSaveContentIfNeeded(id, data) {
  return (dispatch, getState) => {
    if(shouldSaveDraft(getState())) {
      return dispatch({
        [CALL_API]: {
          types: [REQUEST_AUTO_SAVE_CONTENT, RECEIVE_AUTO_SAVE_CONTENT],
          endpoint: 'consultation/lecture_drafts/' + id,
          schema: Schemas.DRAFT,
          options: {
            method: 'put',
            body: JSON.stringify(data)
          }
        }
      });
    }
  }

}

function shouldSaveDraft(state) {
  const {
    recordingPage :{
      isSubmiting,
      generateTalkId
    }
  } = state;
  if(isSubmiting || generateTalkId > 0)
    return false;
  return true;
}
