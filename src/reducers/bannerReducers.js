import {
    REQUEST_BANNER_CATEGORY,
    RECEIVE_BANNER_CATEGORY,
    CHANGE_CATEGORY,
} from '../actions/bannerActionCreators';
import {
    RECEIVE_TALKS
} from '../actions/talksActionCreators'

export default function banners(state = {}, action) {
    return {
        isFetchingBanner: isFetchingBanner(state.isFetchingBanner, action),
        banners: returnBanners(state.banners, action),
        selectedIndex: selectedIndex(state.selectedIndex, action),
    }
}

function isFetchingBanner(state = false, action) {
    switch (action.type) {
        case REQUEST_BANNER_CATEGORY:
            return true;
        case RECEIVE_BANNER_CATEGORY:
            return false;
        default:
            return state;
    }
}

function selectedIndex(state = 0, action) {
    switch (action.type) {
        case CHANGE_CATEGORY:
        case RECEIVE_TALKS:
            return action.id;
        default:
            return state;
    }
}

function returnBanners(state = [], action) {
    switch (action.type) {
        case RECEIVE_BANNER_CATEGORY:
            return action.response.result;
        default:
            return state;
    }
}
