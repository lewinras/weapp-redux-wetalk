import {bindActionCreators} from '../../libs/redux'
import{connect} from '../../libs/wechat-redux'
import merge from '../../libs/lodash.merge'
import pick from '../../libs/lodash.pick'
import {
    requestSubscribedIfNeeded,
    fetchProfileIfNeeded,
    fetchProfileHistoryIfNeeded
} from '../../actions/profileActionCreators'
import {fetchConsultant} from'../../actions/consultantActionCreators'
import {getCurrentUser} from '../../selectors/index.js';

const pageConfig = {
    data: {},
    onLoad(){
        // this.requestSubscribedIfNeeded()//wechat need
        this.fetchConsultant(this.data.userInfo.id)
        this.fetchProfileIfNeeded();
        this.fetchProfileHistoryIfNeeded(1, 'glances', true);


    },
    handleLoadMore(){
        if (!this.data.glances.isEnd) {
            this.fetchProfileHistoryIfNeeded(this.data.glances.page, 'glances', false)
        }
    },
    clickItem(e){
        console.log(e)
        if (e.currentTarget.dataset.completed === 'true') {
            wx.navigateTo({
                url: `../detail/detail?id=${e.currentTarget.dataset.id}`
            })
        }else{
            wx.navigateTo({
                url: `../record/record?id=${e.currentTarget.dataset.slug_id}`
            })
        }
    }
};
const mapStateToData = (state, props) => {
    const currentUser = getCurrentUser(state)
    const path = 'glances'
    const {entities: {consultations, users},} = state;
    const profile = state.profile || {};
    let cooked = pick(profile, [path]) || {[path]: {}};
    const items = cooked[path]['items'] || [];
    const cookedItems = items.map(id => (
        merge({}, consultations[id], {
            name: !consultations[id].name || consultations[id].name === '' ? '未指定用户' : consultations[id].name,
            avatar: !consultations[id].avatar || consultations[id].avatar == '' ? 'http://cdn-img.duilu.me/196a9d19-06c9-47d8-9498-257c38a9bcc3' : consultations[id].avatar,
            consultant: users[consultations[id].consultant],
            questioner: users[consultations[id].questioner]
        })
    ));

    cooked = merge({}, cooked, {
        [path]: {items: cookedItems}
    });

    return {userInfo: pick(currentUser, ['isFetching', 'name', 'avatar', 'id']), ...cooked}
};
const mapDispatchToPage = dispatch =>
    bindActionCreators({
        requestSubscribedIfNeeded,
        fetchConsultant,
        fetchProfileIfNeeded,
        fetchProfileHistoryIfNeeded
    }, dispatch);
Page(connect(mapStateToData, mapDispatchToPage)(pageConfig));

