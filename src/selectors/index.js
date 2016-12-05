/**
 * Created by luqingchuan on 2016/12/1.
 */
import { createSelector } from '../libs/reselect';
import merge from '../libs/lodash.merge';
import union from '../libs/lodash.union';

const getTalks = (state) => state.talks;
const getProfile = (state) => state.profile;
const getEntities = (state) => state.entities;
const getEntitiesTalks = (state) => state.entities.talks;
const getUsers = (state) => state.entities.users;
const getOractors = (state) => state.entities.oractors;
const getUser = (state, props) => state.entities.users[props.userId || props.id];
const getOractor = (state, props) => state.entities.oractors[props.id];
export const getGlobal = (state) => state.global;
const getVisitedTalks = (state) => state.visitedTalks;
const getVisitedTalk = (state, props) => state.visitedTalks[props.params.talkId || props.params.id];
const getTalk = (state, props) => state.entities.talks[props.params.talkId || props.params.id];
const getProducts = (state) => state.entities.products;
const getActivity = (state, props) => state.entities.activities[props.params.activityId || props.params.id];
const getVisitedActivities = (state, props) => state.visitedActivities[props];

const getProfileUser = createSelector(
    [getUsers, getProfile],
    (users, profile) => users[profile.id]
);

export const getCurrentUser = createSelector(
    [getProfile, getUsers],
    (profile, users) => {
        if(profile) {
            return merge({}, profile, users[profile.id]);
        }
    }
);

export const getCurrentUserData = createSelector(
    [getCurrentUser],
    (profile) => {
        return {
            data: profile,
        }
    }
)

const getTalksByCategory = (state, props) => {
    let id = props.selectedIndex || 0;
    return getTalks(state)[id] || {};
}

export const makeGetTalksList = () => {
    return createSelector(
        [getTalksByCategory, getEntitiesTalks, getProducts, getOractors, getUsers],
        (talksList, talks, products, oractors, users) => {
            talksList = talksList || {};
            talks = talks || [];
            const items = (talksList.items || []).map(id => {
                return Object.assign({}, talks[id], {
                    oractor: oractors[talks[id].oractor],
                    product: products[talks[id].product]
                });
            });
            return merge({}, talksList, {
                items: items
            });
        }
    );
}

export const makeGetVisitedTalk = () => {
    return createSelector(
        [getTalk, getOractors, getVisitedTalk, getProducts],
        (talk, oractors, visitedTalk, products) => {
            if(talk && visitedTalk) {
                const oractor = oractors[talk.oractor];
                const product = products[talk.product];
                return merge({}, talk, visitedTalk, { oractor, product });
            }
        }
    );
}

export const makeGetTalkAndQuestions = ()=> {
    return createSelector(
        [getTalk, getOractors, getTalkQuestions],
        (talk, oractors, talkQuestions) => {
            if(talk && getTalkQuestions) {
                if(!talk.oractor) return talk;
                const oractor = (oractors || [])[talk.oractor];
                return merge({}, talk, {
                    oractor
                });
            }
        }
    );
}

export const makeGetQuestions = ()=> {
    return createSelector(
        [getTalk, getTalkQuestions],
        (talk, talkQuestions) => {
            if(talk && talk.questions && talkQuestions) {
                return talk.questions.map(id=> talkQuestions[id]);
            }
        }
    );
}

const getTalkQuestions = (state) => state.entities.talkQuestions;

export const makeGetTalkQuestions = () => {
    return createSelector(
        [getVisitedTalk, getTalkQuestions],
        (talk, questions) => {
            if(!talk) return {};
            const cookedItems = talk.questions.items.map(id => {
                const question = questions[id] || {answers: []};
                return merge({}, {answers: []}, question);
            });
            return merge({}, talk.questions, {
                items: cookedItems
            });
        }
    );
};

const getComments = (state) => state.entities.comments;

export const makeGetTalkComments = () => {
    return createSelector(
        [getVisitedTalk, getComments, getUsers],
        (talk, comments, users) => {
            if(!talk) return {};
            const items = talk.comments.items.map(id => {
                const comment = comments[id];
                const user = users[comment.user];
                let parent = {};
                if(comment.parent) {
                    const tmp = comments[comment.parent];
                    parent = merge({}, tmp, {user: users[tmp.user]});
                }
                return merge({}, comment, { user, parent });
            });

            return merge({}, talk.comments, { items });
        }
    );
}

const getConsultations = (state) => state.entities.consultations;
export const makeGetTalkConsultations = () => {
    return createSelector(
        [getVisitedTalk, getConsultations, getUsers],
        (talk, consultations, users) => {
            if(!talk) return {};
            const items = talk.consultations.items.map(id => {
                const consultation = consultations[id];
                const consultant = users[consultation.consultant];
                const questioner = users[consultation.questioner];
                return merge({}, consultation, { consultant, questioner});
            });

            return merge({}, talk.consultations, { items });
        }
    );
}

const getStateAudioPlayer = (state) => state.audioPlayer;
export const getAudioPlayer = createSelector(
    [getStateAudioPlayer, getTalkQuestions],
    (audioPlayer, questions) => {
        const playing = questions[audioPlayer.playing];
        return merge({}, audioPlayer, { playing });
    }
);

const getVisitedAppointments = (state) => state.visitedAppointments;
const getAppointments = (state) => state.entities.appointments;
const getAppointment = (state, props) => state.entities.appointments[props.params.id];
const getVisitedAppointment = (state, props) => state.visitedAppointments[props.params.id];

export const makeGetVisitedAppointment = () => {
    return createSelector (
        [getAppointment, getVisitedAppointment,  getOractors, getProducts, getEntitiesTalks],
        (appointment, visitedAppointment,  oractors, products, talks) => {
            if(appointment && visitedAppointment) {
                const oractor = oractors[appointment.oractor];
                const product = products[appointment.product];
                const talk = talks[appointment.talk];
                return merge({}, appointment, visitedAppointment, { oractor, product, talk });
            }
        });
}

const getSearches = (state) => state.search;

export const makeGetSearches = () => {
    return createSelector (
        [getSearches, getEntitiesTalks, getProducts, getOractors, getUsers],
        (searches, talks, products, oractors, users) => {
            talks = talks || [];
            oractors = oractors || [];
            products = products || [];
            const items = (searches.items || []).map(id => {
                let talk = talks[id]||{};
                return Object.assign({}, talk, {
                    oractor: oractors[talk.oractor],
                    product: products[talk.product]
                });
            });
            return merge({}, searches, {
                items: items
            });
        }
    );
}

const getEntitiesBanners = (state)=> state.entities.banner;
const getBanners = (state) => state.banners.banners;

export const makeGetBanners = () => {
    return createSelector(
        [getEntitiesBanners, getBanners],
        (bannerData, bannerArray) => {
            bannerArray = bannerArray || [];
            bannerData = bannerData || [];
            return bannerArray.map( id => bannerData[id]);
        }
    );
};

export const getBannerSelectedIndex = (state) => state.banners.selectedIndex;

const getEntitiesPosters = (state) => state.entities.poster;

export const makeGetPosters = () => {
    return createSelector(
        [getTalksByCategory, getEntitiesPosters],
        (data, posterArray) => {
            data = data || {};
            let posters = data.posters || [];
            posterArray = posterArray || [];
            return posters.map( id => posterArray[id]);
        }
    );
}

const getVisitedActivity = (state, props) => state.visitedActivities[props.params.id];
export const makeGetVisitedActivity = () => {
    return createSelector(
        [getActivity, getVisitedActivity],
        (activity, visitedActivity) => {
            if(activity && visitedActivity) {
                return merge({}, activity, visitedActivity);
            }
        }
    );
}
