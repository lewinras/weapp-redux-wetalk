import {applyMiddleware, createStore, compose} from './libs/redux'
import reducers from './reducers/index'
import apiMiddleware from './middlewares/api'
import thunk from './libs/redux-thunk'
const middleware = [thunk, apiMiddleware]

export default compose(
    applyMiddleware(...middleware),
)(createStore)(reducers)


