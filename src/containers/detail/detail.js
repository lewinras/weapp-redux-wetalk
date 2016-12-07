import {formatSecond} from '../../utils/util.js'
import{bindActionCreators} from '../../libs/redux'
import {connect} from '../../libs/wechat-redux'
import {
    fetchTalk,
    fetchQuestionsIfNeeded,
    fetchCommentsIfNeeded,
} from '../../actions/talkActionCreators';
import {
    makeGetVisitedTalk,
    makeGetTalkQuestions,
    makeGetTalkComments,
    // getAudioPlayer,
    getCurrentUser
} from '../../selectors/index';
const pageConfig = {
    data: {
        id: 1
    },

    handleLoadMore(){
        if (!this.data.questions.isEnd) {
            if (!this.data.questions.isFetching)
                this.fetchQuestionsIfNeeded(this.data.id, this.data.questions.page)
        } else if (!this.data.comments.isEnd) {
            if (!this.data.comments.isFetching)
                this.fetchCommentsIfNeeded(this.data.id, this.data.comments.page)

        }
    },
    onLoad(options){
        if (options.id) {
            this.setData({id: Number(options.id)})
        }
        this.fetchTalk(this.data.id)
        this.fetchQuestionsIfNeeded(this.data.id)

    },
    onReady(){

    }
};
const mapStateToData = (state, props) => {
    console.log('detail mapstateto data')
    const getVisitedTalk = makeGetVisitedTalk();
    const getTalkQuestions = makeGetTalkQuestions();
    const getTalkComments = makeGetTalkComments();
    const talk = getVisitedTalk(state, props);
    if(talk && talk.product){
        talk.product.price = talk.product.price ? Number(talk.product.price) : 0;
    }

    const questions = getTalkQuestions(state, props);
    if (questions.items) {
        questions.items.forEach(item => {
                if (talk && talk.answer_type === 'voice') {
                    item.answers_time = formatSecond(item.answers_length)
                }
                return item;
            }
        )
    }
    const comments = getTalkComments(state, props);
    // const audioPlayer = getAudioPlayer(state, props);
    const currentUser = getCurrentUser(state, props);
    const id = props.id;
    const cookedTalk = Object.assign({}, talk, {id, questions, comments, /*audioPlayer,*/ currentUser});
    return {...cookedTalk};

};
const mapDispatchToPage = dispatch =>
    bindActionCreators({fetchTalk, fetchQuestionsIfNeeded, fetchCommentsIfNeeded}, dispatch);
Page(connect(mapStateToData, mapDispatchToPage)(pageConfig));
