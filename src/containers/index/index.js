//index.js
import {bindActionCreators} from '../../libs/redux';
import {getTalksList} from '../../utils/api'
import {connect} from '../../libs/wechat-redux'
import {fetchTalksIfNeeded, requestPostersIfNeeded} from '../../actions/talksActionCreators'
import {requestBannerIfNeeded} from '../../actions/bannerActionCreators'
import {initSystemInfo} from '../../actions/systemInfoActionCreators'
import{makeGetBanners, makeGetPosters, makeGetTalksList, getBannerSelectedIndex} from '../../selectors/index'
const pageConfig = {
    data: {
        cookedItems: [],
        data: {},
        selectedIndex: 0
    },

    handleLoadMore () {
        if (this.data.data.isEnd || this.data.data.isFetching) return;
        this.fetchTalksIfNeeded(this.data.data.page, false, this.data.data.refs, this.data.selectedIndex)
    },

    categorySelected(e){
        console.log(e.target.dataset)
        this.setData({
            selectedIndex: Number(e.target.dataset.id)
        })
        this.fetchTalksIfNeeded(1, true, this.data.refs, this.data.selectedIndex)

    },
    onLoad(){
        console.log('onstart')
        wx.getSystemInfo({
            success: res => this.initSystemInfo(res)
        })
    },
    onReady() {
        console.log('componentDidMount')
        this.fetchTalksIfNeeded(1, true, this.data.data.refs, 0)
        this.requestBannerIfNeeded()
        this.requestPostersIfNeeded()
    }
}

const mapStateToData = (state, props) => {
    const windowWidth = state.systemInfo.windowWidth
    const data = makeGetTalksList()(state, props)
    console.log(data)
    let banners = makeGetBanners()(state)
    banners.unshift({
        id: 0,
        name: '全部'
    })
    const posters = makeGetPosters()(state, props)
    let items = data.items || []
    const cookedItems = posters.reduce((items, element, index, array) => {
        items.splice(index * 4, 0, element);
        return items;
    }, items)
    console.log('index mapstatetodata')
    return {windowWidth, data, banners, cookedItems}

}

const mapDispatchToPage = dispatch =>
    bindActionCreators({fetchTalksIfNeeded, requestBannerIfNeeded, requestPostersIfNeeded, initSystemInfo}, dispatch)

const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)

Page(nextPageConfig)