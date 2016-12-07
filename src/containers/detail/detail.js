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
    const getVisitedTalk = makeGetVisitedTalk();
    const getTalkQuestions = makeGetTalkQuestions();
    const getTalkComments = makeGetTalkComments();
    const talk = getVisitedTalk(state, props);
    const questions = getTalkQuestions(state, props);
    console.log(questions.isEnd)
    const audio_lengths = talk && talk.answer_type === 'voice' && questions.items ? questions.items.map(item => formatSecond(item.answers_length)) : [];
    const comments = getTalkComments(state, props);
    // const audioPlayer = getAudioPlayer(state, props);
    const currentUser = getCurrentUser(state, props);
    const id = props.id;
    const cookedTalk = Object.assign({}, talk, {id, questions, comments, /*audioPlayer,*/ currentUser});
    return {...cookedTalk, audio_lengths};

};
const mapDispatchToPage = dispatch =>
    bindActionCreators({fetchTalk, fetchQuestionsIfNeeded, fetchCommentsIfNeeded}, dispatch);
const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig);
Page(nextPageConfig);
