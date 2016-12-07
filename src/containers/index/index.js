//index.js
import {bindActionCreators} from '../../libs/redux';
import {connect} from '../../libs/wechat-redux'
import pick from '../../libs/lodash.pick';
import merge from '../../libs/lodash.merge';
import {fetchTalksIfNeeded, requestPostersIfNeeded} from '../../actions/talksActionCreators'
import {requestBannerIfNeeded, changeCategory} from '../../actions/bannerActionCreators'
import {initSystemInfo} from '../../actions/systemInfoActionCreators'
import{makeGetBanners, makeGetPosters, makeGetTalksList} from '../../selectors/index'

const makeGetCookedItems = (previousItems = [], posters) =>
    posters.reduce((items, element, index) => {
            items.splice(index * 4, 0, element);
            return items;
        },
        previousItems)
        .map(item => {
            if (item.product) {
                item.product.price = item.product.price ? Number(item.product.price) : 0;
            }
            return item
        });


const mapStateToData = (state, props) => {
    const data = makeGetTalksList()(state);
    const posters = makeGetPosters()(state);
    let banners = makeGetBanners()(state);
    banners.unshift({
        id: 0,
        name: '全部'
    });
    console.log('index mapstatetodata');
    return {
        windowWidth: state.systemInfo.windowWidth,
        talks: {...pick(data, ['isFetching', 'refs', 'isEnd', 'page', 'totalCount'])},
        banners,
        cookedItems: makeGetCookedItems(data.items, posters),
        selectedIndex: state.banners.selectedIndex
    }

};

const mapDispatchToPage = dispatch =>
    bindActionCreators({
        fetchTalksIfNeeded,
        requestBannerIfNeeded,
        requestPostersIfNeeded,
        initSystemInfo,
        changeCategory
    }, dispatch);

const pageConfig = {
    data: {
    },

    handleLoadMore () {
        if (this.data.talks.isEnd || this.data.talks.isFetching) return;
        this.fetchTalksIfNeeded(this.data.talks.page, this.data.talks.refs, this.data.selectedIndex)
    },

    categorySelected(e){
        this.changeCategory(Number(e.target.dataset.id))

    },
    onLoad(){
        wx.getSystemInfo({
            success: res => this.initSystemInfo(res)
        })
        this.fetchTalksIfNeeded(1, this.data.talks.refs, 0);
        this.requestBannerIfNeeded();
        this.requestPostersIfNeeded()
    },
};

const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig);

Page(nextPageConfig);