import {CALL_API} from '../middlewares/api';
import Schemas from '../schemas/schema';
// import {wxPay} from '../../utils/wxConfig';
import {alertInfo, loading, dismissLoading} from './globalActionCreators';

export const REQUEST_ORDER_PREPARE = 'REQUEST_ORDER_PREPARE';
export const FAILED_ORDER_PREPARE = 'FAILED_ORDER_PREPARE';

const API_ROOT = 'http://localhost:3000/';

function requestOrderPrepare(payload) {
    return {
        type: REQUEST_ORDER_PREPARE,
        ...payload
    }
}

function failedOrderPrepare(payload, error) {
    return {
        type: FAILED_ORDER_PREPARE,
        messages: error,
        ...payload
    }
}

export const REQUEST_PAYMENT = 'REQUEST_PAYMENT';
export const RECEIVE_PAYMENT = 'RECEIVE_PAYMENT';
export const FAILED_PAYMENT = 'FAILED_PAYMENT';

function requestPayment(payload) {
    return {
        type: REQUEST_PAYMENT,
        ...payload
    }
}

function receivePayment(payload) {
    return {
        type: RECEIVE_PAYMENT,
        ...payload
    }
}

function pay(type, id, postPayload = {}) {
    // TODO: rewrite with middleware
    return (dispatch, getState) => {
        const state = getState();
        let url, payload, subState;

        if (type === 'talk') {
            url = `${API_ROOT}consultation/talks/${id}/orders.json`;
            payload = {talkId: id, scene: 'talk'};
            subState = (state.visitedTalks || {})[id] || {};
        }
        else if (type === 'appointment') {
            url = `${API_ROOT}consultation/appointments/${id}/orders.json`;
            payload = {appointmentId: id, scene: 'appointment'};
            subState = (state.visitedAppointments || {})[id] || {};
        }
        else if (type === 'consultation') {
            const userId = postPayload.userId;
            delete postPayload.userId;
            url = `${API_ROOT}consultation/users/${userId}/orders.json`;
            payload = {talkId: id, scene: 'consultation'};
            subState = (state.visitedTalks || {})[id] || {};
        }
        else {
            throw new Error('Unsupported payment type');
        }

        const paying = subState.paying;
        if (paying === 'processing') return undefined;

        dispatch(loading());
        dispatch(requestOrderPrepare(payload));
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                method: 'post',
                body: JSON.stringify(postPayload),
                success: resolve,
                fail: reject
            })

        }).then(res => res.data.json())
            .then(json => {
                dispatch(dismissLoading());
                if (json.state === 'completed') {
                    dispatch(receivePayment(payload));
                }
                else {
                    dispatch(requestPayment(payload));
                    return wxPay(json.prepay).then(res => {
                        dispatch(receivePayment(payload));
                        return res;
                    }).catch(err => {
                        if (err === 'cancelled') {
                            throw 'cancelled';
                        }
                        if (err) {
                            dispatch(alertInfo(err.message || err));
                            throw err.message || err;
                        }
                        else {
                            dispatch(alertInfo(i18next.t('payment.failed')));
                            throw 'failed';
                        }
                    });
                }
            })
            .catch(error => {
                const msg = (error && (error.errors || error)) || i18next.t('common.error');
                dispatch(dismissLoading());
                dispatch(failedOrderPrepare(payload, error));
                dispatch(alertInfo(msg));
                throw 'failed';
            });
    };
}

export function payForTalk(talkId) {
    return pay('talk', talkId);
}

export function payForAppointment(id, payload) {
    return pay('appointment', id, payload);
}

export function payForConsultation(userId, talkId, payload) {
    return pay('consultation', talkId, {userId, ...payload});
}
