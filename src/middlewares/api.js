/**
 * Created by luqingchuan on 2016/12/1.
 */
import {Promise} from '../libs/promise'
const API_ROOT = 'http://www.duilu.me/';
function callApi(url, options = {}) {
    const fullUrl = (url.indexOf(API_ROOT === -1) ? API_ROOT + url : url)
    return new Promise((resolve, reject) => {
        wx.request({
            url: fullUrl,
            header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: resolve,
            fail: reject
        })
    })
}

export const CALL_API = Symbol('WeTalk Api')

export default store => next => action => {
    console.log('dsfsdf')
    const callAPI = action[CALL_API]
    if(typeof callAPI === 'undefined') {
        return next(action)
    }
    let { endpoint, options, payload } = callAPI
    const { schema, types } = callAPI

    payload = payload || {}

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState());
        l  }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }
    if (!schema) {
        throw new Error('Specify one of the exported Schemas.');
    }
    if (!Array.isArray(types) || types.length > 3) {
        throw new Error('Expected an array of three action types.');
    }
    if (!types.every(type => typeof type === 'string' || typeof type === 'function')) {
        throw new Error('Expected action types to be strings or functions.');
    }

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }

    const [ requestType, successType, failureType ] = types
    next(actionWith({ type: requestType, ...payload}))

    return callApi(endpoint, options)
        .then(res => res.data)
        .then(response => {
            let suc =successType;
            if(typeof suc === 'function'){
                suc = suc(next, response)
            }
            console.log(response)
            next(actionWith({
                response,
                type: suc,
                receiveAt:Date.now(),
                ...payload
            }))
        })
        .catch(error => {
            console.log('error')
            console.error(error)
        })

}