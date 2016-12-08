import {bindActionCreators} from '../../libs/redux';
import {connect} from '../../libs/wechat-redux';
import{
    requestTalkQuestionsIfNeed
} from '../../actions/recordingPageActionCreator';
import { makeGetTalkAndQuestions } from '../../selectors/index.js';
const pageConfig = {
    data: {

    },
    onLoad(options){
        if(options.id) {
            this.setData({id: options.id})
        }
        this.requestTalkQuestionsIfNeed(this.data.id)
    }
};
const mapStateToData = (state, props) => {
    const talk = makeGetTalkAndQuestions()(state, props);
    return {talk, ...state.recordingPage}
};

const mapDispatchToPage = dispatch =>
    bindActionCreators({requestTalkQuestionsIfNeed}, dispatch);
Page(connect(mapStateToData,mapDispatchToPage)(pageConfig));
