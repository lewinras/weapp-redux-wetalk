import uniq from '../libs/lodash.uniq';

export default function scrollReducersCreator(type, maxCount=20) {
  return (state={
    isEnd: false,
    page: 1,
    items: []
  }, action) => {
    switch(action.type) {
      case type:
      state = Object.assign({}, {
        isEnd: false,
        page: 1,
        items: []
      }, state);
      if(action.isForce) {
        state = Object.assign({}, state, { page: 1 });
      }

      let items = action.response.result;
      if(!Array.isArray(action.response.result)) {
        for(let prop in action.response.result) {
          if(Array.isArray(action.response.result[prop])) {
            items = action.response.result[prop];
            break;
          }
        }
      }
      if(!Array.isArray(items)){
        items = [];
      }
      const page = items.length > 0 ? state.page + 1 : state.page;
      return Object.assign({}, state, {
        isEnd: isEnd(items, maxCount),
        page: page,
        items: action.isForce ? items : uniq(state.items.concat(items)),
        lastUpdated: action.receivedAt
      });
    default:
      return state;
    }
  }
}

function isEnd(items, maxCount) {
  if(!items) return true;
  if(items.length === 0) return true;
  if(items.length < maxCount) return true;
  return false;
}
