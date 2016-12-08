import {
  REQUEST_TALK_ANSWERS,
  RECEIVE_TALK_ANSWERS,
  START_RECORDING,
  STOP_RECORDING,
  SET_RECORDING_TIME,
  RECEIVE_DELETE_ANSWER,
  REQUEST_SUBMIT_TALK,
  RECEIVE_SUBMIT_TALK,
  RECEIVE_SET_TALK_ANSWER,
  PLAY_VOICE,
  RECEIVE_SUBMIT_ERROR
} from '../actions/recordingPageActionCreator.js';

// import {
//   STOP_AUDIO
// } from '../actions/audioPlayerActionCreators.js';

import merge from '../libs/lodash.merge';


export default function recordingPage(state={}, action) {
  return {
    isFetching: isFetching(state.isFetching, action),
    talkId: getId(state.id, action),
    questions: getQuestions(state, action),
    isSubmiting: isSubmiting(state.isSubmiting, action),
    generateTalkId: generateTalkId(state.generateTalkId, action),
    isRecording: isRecording(state.isRecording, action),
    recordingId: recordingId(state.recordingId, action),
    recordingTime: recordingTime(state.recordingTime, action),
    playingId: playingId(state.playingId, action),
    isPlaying: isPlaying(state.isPlaying, action),
    textQuestions: getTextQuestions(state.textQuestions, action)
  };
}

function getTextQuestions(state=[], action) {
  switch(action.type) {
  case RECEIVE_TALK_ANSWERS:
    const commited = action.response.entities.talks[action.response.result].commited;
    let questions = action.response.entities.talks[action.response.result].questions.map((id)=>
                                                                                         action.response.entities.talkQuestions[id]);
    if(commited) {
      return questions;
    }else {
      let draft_questions = action.response.entities.talks[action.response.result].draft.text_content.questions || [];
      return merge([], questions, draft_questions);
    }
  default:
    return state;
  }
}

function generateTalkId(state=-1 , action) {
  switch(action.type) {
  case RECEIVE_SUBMIT_TALK:
    return action.response.result;
  default:
    return state;
  }
}

function isPlaying(state=false, action) {
  switch(action.type) {
  case PLAY_VOICE:
    return true;
  // case STOP_AUDIO:
  //   return false;
  default:
    return state;
  }
}

function playingId (state=-1, action){
  switch(action.type) {
  case PLAY_VOICE:
    return action.playingId;
  // case STOP_AUDIO:
  //   return -1;
  default:
    return state;
  }
}

function isSubmiting(state=false, action) {
  switch(action.type) {
  case REQUEST_SUBMIT_TALK:
    return true;
  case RECEIVE_SUBMIT_TALK:
    return false;
  case RECEIVE_SUBMIT_ERROR:
    return false;
  default:
    return state;
  }
}

function recordingTime(state=0, action) {
  switch(action.type) {
  case SET_RECORDING_TIME:
    return state + 1;
  case START_RECORDING:
    return 0;
  default:
    return state;
  }
}

function playingLocalVoice(state='', action) {
  return state.playingLocalVoice;
}

function recordingId(state='', action) {
  switch(action.type) {
  case START_RECORDING:
    return action.id;
  case STOP_RECORDING:
    return '';
  default:
    return state;
  }
}

function isRecording(state=false, action) {
  switch(action.type) {
  case START_RECORDING:
    return true;
  case STOP_RECORDING:
    return false;
  default:
    return state;
  }
}

function getQuestions(state, action) {
  let questions = state.questions || [];
  const recordingTime = state.recordingTime || 0;
  switch(action.type) {
  case RECEIVE_TALK_ANSWERS:
    const commited = action.response.entities.talks[action.response.result].commited;
    questions = action.response.entities.talks[action.response.result].questions.map((id)=>
      action.response.entities.talkQuestions[id]);
    if(commited){
      return questions;
    }else {
      let draft_questions = action.response.entities.talks[action.response.result].draft.voice_content.questions || [];
      return merge([], questions, draft_questions);
    }
  case RECEIVE_SET_TALK_ANSWER:
    return questions.map(item => {
      if(item.id === action.questionId){
        let answers = item.answers || [];
        answers.push({
          localId: action.localId,
          length: recordingTime,
          media_id: action.serverId,
          answered_at: Date.now()
                     });
      item =  merge({}, item, {
          answers
        });
      }
      return item;
    });
  case RECEIVE_DELETE_ANSWER:
    return questions.map(item => {
      let answers = item.answers;
      if(item.id === action.questionId) {
       answers = answers.splice(answers.findIndex((element, index, array)=>{
         return element.media_id === action.answerId;
        }),1);
      }
      return item;
    });

  default:
    return questions;
  }
}

function getId(state='', action) {
  switch(action.type) {
  case RECEIVE_TALK_ANSWERS:
    return action.response.result;
  default:
    return state;
  }
}

function isFetching(state=false, action) {
  switch(action.type) {
  case REQUEST_TALK_ANSWERS:
    return true;
  case RECEIVE_TALK_ANSWERS:
    return false;
  default:
    return state;
  }
}
