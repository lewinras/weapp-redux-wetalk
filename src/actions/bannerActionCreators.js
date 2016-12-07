import {CALL_API} from '../middlewares/api';
import Schemas from '../schemas/schema';

export const REQUEST_BANNER_CATEGORY = "REQUEST_BANNER_CATEGORY";
export const RECEIVE_BANNER_CATEGORY = "RECEIVE_BANNER_CATEGORY";
export const CHANGE_CATEGORY = 'CHANGE_CATEGORY';
import {fetchTalksIfNeeded} from './talksActionCreators'
function requestBanner() {
    return {
        [CALL_API]: {
            types: [REQUEST_BANNER_CATEGORY, RECEIVE_BANNER_CATEGORY],
            endpoint: 'consultation/categories.json',
            schema: Schemas.BANNER_ARRAY,
        }
    };
}

function shouldRequestBanner(state) {
    const {banners} = state;
    return !banners.isFetchingBanner;
}

export function requestBannerIfNeeded() {
    return (dispatch, getState) => {
        if (shouldRequestBanner(getState())) {
            return dispatch(requestBanner());
        }
    }
}

export function changeCategory(categoryId = 0) {
    return (dispatch, getState) => {
        if (getState().talks[categoryId]) {
            dispatch({
                type: CHANGE_CATEGORY,
                id: categoryId
            })
        }else{
            dispatch(fetchTalksIfNeeded(1,"",categoryId))
        }
    }
}

