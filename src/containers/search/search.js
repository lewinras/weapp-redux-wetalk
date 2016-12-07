import {bindActionCreators} from '../../libs/redux';
import {connect} from '../../libs/wechat-redux';
import {search, clearSearch} from '../../actions/searchActionCreators'
import { makeGetSearches } from  '../../selectors/index.js';

const mapStateToData = (state, props) => {
    return {...makeGetSearches()(state)}
};
const mapDispatchToPage = dispatch => bindActionCreators({search, clearSearch}, dispatch);

const pageConfig = {
    data: {
        question: ''
    },
    bindInput (e) {
        if (!e.detail.value) return;
        this.setData({
            question: e.detail.value
        })
    },
    searchQuestion(){
        this.search(this.data.question);
    },
    handleLoadMore () {
        if (this.data.isEnd || this.data.isFetching) return;
        this.search(this.data.text, this.data.page);
    },
    onLoad(){
       this.clearSearch();
    }
};

Page(connect(mapStateToData, mapDispatchToPage)(pageConfig));
