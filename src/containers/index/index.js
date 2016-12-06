//index.js
import {bindActionCreators} from '../../libs/redux';
import {connect} from '../../libs/wechat-redux'
import pick from '../../libs/lodash.pick';
import {fetchTalksIfNeeded, requestPostersIfNeeded} from '../../actions/talksActionCreators'
import {requestBannerIfNeeded} from '../../actions/bannerActionCreators'
import {initSystemInfo} from '../../actions/systemInfoActionCreators'
import{makeGetBanners, makeGetPosters, makeGetTalksList} from '../../selectors/index'

const getCookedItems = (previousItems = [], posters) =>
    posters.reduce((items, element, index) => {
        items.splice(index * 4, 0, element);
        return items;
    }, previousItems);

const getPricedItems = (cookedItems = []) =>
    cookedItems.map(item => item.product && item.product.price ? Number(item.product.price) : 0);


const mapStateToData = (state, props) => {
    const windowWidth = state.systemInfo.windowWidth;
    const data = makeGetTalksList()(state, props);
    let banners = makeGetBanners()(state);
    banners.unshift({
        id: 0,
        name: '全部'
    });
    const posters = makeGetPosters()(state, props);

    const cookedItems = getCookedItems(data.items, posters);
    const pricedItems = getPricedItems(cookedItems);
    console.log('index mapstatetodata');
    return {
        windowWidth,
        data: pick(data, ['isFetching', 'refs', 'isEnd', 'page', 'totalCount']),
        banners,
        cookedItems,
        pricedItems
    }

};

const mapDispatchToPage = dispatch =>
    bindActionCreators({fetchTalksIfNeeded, requestBannerIfNeeded, requestPostersIfNeeded, initSystemInfo}, dispatch);

const pageConfig = {
    data: {
        selectedIndex: 0
    },

    handleLoadMore () {
        if (this.data.data.isEnd || this.data.data.isFetching) return;
        this.fetchTalksIfNeeded(this.data.data.page, this.data.data.refs, this.data.selectedIndex)
    },

    categorySelected(e){
        this.setData({
            selectedIndex: Number(e.target.dataset.id)
        });
        this.onPullDownRefresh();

    },
    onPullDownRefresh(){
        this.fetchTalksIfNeeded(1, this.data.refs, this.data.selectedIndex);
        wx.stopPullDownRefresh();
    },
    onLoad(){
        console.log('onstart');
        wx.getSystemInfo({
            success: res => this.initSystemInfo(res)
        })
        this.fetchTalksIfNeeded(1, this.data.data.refs, 0);
        this.requestBannerIfNeeded();
        this.requestPostersIfNeeded()
    },
    onReady() {
        console.log('ready');

    }
};

const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig);

Page(nextPageConfig);