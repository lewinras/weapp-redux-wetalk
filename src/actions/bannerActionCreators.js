import {CALL_API} from '../middlewares/api';
import Schemas from '../schemas/schema';

export const REQUEST_BANNER_CATEGORY = "REQUEST_BANNER_CATEGORY";
export const RECEIVE_BANNER_CATEGORY = "RECEIVE_BANNER_CATEGORY";

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



