//index.js
import {bindActionCreators} from '../../libs/redux';
import {connect} from '../../libs/wechat-redux'
import pick from '../../libs/lodash.pick';
import merge from '../../libs/lodash.merge';
import {fetchTalksIfNeeded, requestPostersIfNeeded, changeCategory} from '../../actions/talksActionCreators'
import {requestBannerIfNeeded} from '../../actions/bannerActionCreators'
import {initSystemInfo} from '../../actions/systemInfoActionCreators'
import{makeGetBanners, makeGetPosters, makeGetTalksList} from '../../selectors/index'

const getCookedItems = (previousItems = [], posters) =>
    posters.reduce((items, element, index) => {
        items.splice(index * 4, 0, element);
        return items;
    }, previousItems);


const mapStateToData = (state, props) => {
    const data = makeGetTalksList()(state);
    let banners = makeGetBanners()(state);
    banners.unshift({
        id: 0,
        name: '全部'
    });
    const posters = makeGetPosters()(state);
    const cookedItems = getCookedItems(data.items, posters);
    console.log('index mapstatetodata');
    return {
        windowWidth: state.systemInfo.windowWidth,
        data: pick(data, ['isFetching', 'refs', 'isEnd', 'page', 'totalCount']),
        banners,
        cookedItems: merge(
            {},
            cookedItems,
            cookedItems.map(item => {
                if (item.product) {
                    item.product.price = item.product && item.product.price ? Number(item.product.price) : 0;
                }
                return item
            })),
        selectedIndex: state.talks.selectedIndex
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
        selectedIndex: 0
    },

    handleLoadMore () {
        if (this.data.data.isEnd || this.data.data.isFetching) return;
        this.fetchTalksIfNeeded(this.data.data.page, this.data.data.refs, this.data.selectedIndex)
    },

    categorySelected(e){
        this.changeCategory(Number(e.target.dataset.id))

    },
    onLoad(){
        wx.getSystemInfo({
            success: res => this.initSystemInfo(res)
        })
        this.fetchTalksIfNeeded(1, this.data.data.refs, 0);
        this.requestBannerIfNeeded();
        this.requestPostersIfNeeded()
    },
};

const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig);

Page(nextPageConfig);