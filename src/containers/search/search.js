import {getSearchList} from '../../utils/api.js'
Page({
    data: {
        list: [],
        hasMore: true,
        page: 1,
        question: ''
    },
    handleLoadMore () {
            if (!this.data.hasMore) return;
            this.searchData()
    },
    bindInput (e) {
        if (!e.detail.value) return;
       this.setData({
            question: e.detail.value
        })
    },
    searchQuestion(){
        this.onPullDownRefresh();
    },
    onPullDownRefresh() {
        this.setData({
            page: 1,
            list: [],
            hasMore: true
        })
        this.searchData();
    },
    searchData() {
        this.setData({
            loading: true
        })
        const params = {page: this.data.page, q: this.data.question}
        getSearchList(params)
            .then(data => {
                if (data.talks && data.talks.length) {
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
    onLoad(){
        
    }
})