import {applyMiddleware, createStore, compose} from './libs/redux'
// const devTools = require('./libs/remote-redux-devtools.js').default;//development env
import reducers from './reducers/index'
import apiMiddleware from './middlewares/api'
import thunk from './libs/redux-thunk'


const middleware = [thunk, apiMiddleware]

//production env
export default compose(
    applyMiddleware(...middleware),
)(createStore)(reducers)


//development env
// export default compose(
//     applyMiddleware(...middleware),
//     // devTools({
//     //     hostname: 'localhost',
//     //     port: 5678,
//     //     secure: false
//     // })
// )
// (reducers)
