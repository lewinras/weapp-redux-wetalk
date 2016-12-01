//index.js
import {getTalksList} from '../../utils/api'
import {connect} from '../../libs/wechat-redux'
import {fetchTalksIfNeeded} from '../../actions/talksActionCreators'
import {requestBannerIfNeeded} from '../../actions/bannerActionCreators'
const pageConfig = {
    data: {
        tabs: ["全部", "求职", "升学", "创业", "自由职业"],
        list: [],
        loading: true,
        hasMore: true,
        page: 1,
        category_id: 1
    },

    handleLoadMore () {
        if (!this.data.hasMore) return;
        this.fetchData()
    },

    categorySelected(e){
        this.setData({
            category_id: e.currentTarget.dataset.id,
            page: 1,
            list: [],
            hasMore: true
        })
        this.fetchData();

    },
    onPullDownRefresh() {
        this.setData({
            page: 1,
            list: [],
            hasMore: true
        })
        this.fetchData();
    },

    fetchData() {
        this.setData({
            loading: true
        })
        const params = this.data.category_id == 1 ? {page: this.data.page} : {
            page: this.data.page,
            category_id: this.data.category_id
        }
        getTalksList(params)
            .then(data => {
                if (data.talks.length) {
                    this.setData({list: this.data.list.concat(data.talks), page: this.data.page + 1})
                } else {
                    this.setData({hasMore: false})
                }
            })
            .catch(e => {
                console.error(e)
            })
            .then(
                setTimeout(() => {
                    this.setData({loading: false})
                    wx.stopPullDownRefresh()
                }, 300))
    },

    onLoad() {
        this.fetchTalks()
        this.fetchBanners()
    }
}
const mapStateToData = state => ({
    list: state.talks,

})

const mapDispatchToPage = dispatch => ({
    fetchTalks: () => dispatch(fetchTalksIfNeeded()),
    fetchBanners: () => dispatch(requestBannerIfNeeded())
})
const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(nextPageConfig)