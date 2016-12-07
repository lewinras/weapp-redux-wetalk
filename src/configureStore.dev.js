import {applyMiddleware, createStore, compose} from './libs/redux'
// const devTools = require('./libs/remote-redux-devtools.js').default;//development env
import reducers from './reducers/index'
import apiMiddleware from './middlewares/api'
import thunk from './libs/redux-thunk'
import merge from './libs/lodash.merge'
import {defaultEntities} from './schemas/schema'
import createLogger from './libs/redux-logger'

const loggerMiddleware = createLogger();

const middleware = [thunk, apiMiddleware, loggerMiddleware]
const initialState = {
    entities: merge({}, defaultEntities,
        {
            users: {
                '249d37bb-29d6-4e8d-af92-36ebb7e5a721': {
                    answered_consulations_count: 7,
                    avatar: 'http://cdn-img.duilu.me/add659308d4c4da1b9e3a7315802aafa',
                    description: "浙江大学，生物系统工程专业，java原生支持者",
                    id: "249d37bb-29d6-4e8d-af92-36ebb7e5a721",
                    is_oractor: false,
                    name: "中二青年氕氘氚",
                    resume: null,
                    serviceable: true,
                    utility_count: 12
                }
            }
        }),
    profile: {
        id: '249d37bb-29d6-4e8d-af92-36ebb7e5a721'
    }
}
//production env
export default compose(
    applyMiddleware(...middleware),
)(createStore)(reducers, initialState)


//development env
// export default compose(
//     applyMiddleware(...middleware),
//     devTools({
//         hostname: 'localhost',
//         port: 5678,
//         secure: false
//     })
// )(createStore)
// (reducers)
