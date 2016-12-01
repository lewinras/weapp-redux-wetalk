import {applyMiddleware, createStore, compose} from './libs/redux'
// const devTools = require('./libs/remote-redux-devtools.js').default;
import reducers from './reducers/index'
import apiMiddleware from './middlewares/api'
import thunk from './libs/redux-thunk'

// function configureStore() {
//   return createStore(reducer, compose(devTools({
//     hostname: 'localhost',
//     port: 5678,
//     secure: false
//   })));
// }

const middleware = [thunk, apiMiddleware]

// 利用compose增强store，这个 store 与 applyMiddleware 和 redux-devtools 一起使用
export default compose(
    applyMiddleware(...middleware),
)(createStore)(reducers)
