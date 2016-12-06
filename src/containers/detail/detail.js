import {formatSecond} from '../../utils/util.js'
import{bindActionCreators} from '../../libs/redux'
import {connect} from '../../libs/wechat-redux'
import {
    fetchTalk
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
        // info: {
        //     "id": 34,
        //     "title": "如何“眼高手低”地拿下BAT产品offer",
        //     "price": "3.0",
        //     "participant_num": 100,
        //     "locked": false,
        //     "asked": null,
        //     "product": {"id": 1360, "price": "1.0", "available_at": 1472202304},
        //     "oractor": {
        //         "id": 29,
        //         "user_id": "f0bc68ba-aa68-4dbd-9798-35a7aeccb9b4",
        //         "name": "隐士",
        //         "avatar": "http://cdn-img.duilu.me/c2f5389bf87d4bc08d0b33810dad5572",
        //         "tags": ["中南财经政法大学", "市场营销专业", "2014届"],
        //         "description": "中南财经政法大学，市场营销专业，网红公众号“呵呵茶山刘”、“吃喝茶山刘”创始人之一。曾实习于天弘基金客户部、立白市场部以及怡安翰威特咨询咨询部，校招时拿到腾讯、UC、YY语音等公司产品策划offer，阿里运营培训offer和酷派市场管培offer",
        //         "available": true
        //     }
        // },
        // questions: [{"id": 408, "content": "先来段简单的自我介绍噢~", "locked": false, "answers_length": 42}, {
        //     "id": 409,
        //     "content": "吃喝茶山刘”当时可谓是风靡整个财大并波及周遭众多高校的一个大学生创业项目，可以简单介绍一下这个项目吗？",
        //     "locked": false,
        //     "answers_length": 84
        // }, {
        //     "id": 410,
        //     "content": "\"吃喝茶山刘“这段项目在你今后的求职路上有发挥什么样的作用呢？",
        //     "locked": false,
        //     "answers_length": 35
        // }, {"id": 411, "content": "曾在怡安翰威特咨询实习过一段时间，能说说当时的求职经历吗？", "locked": false, "answers_length": 94}, {
        //     "id": 418,
        //     "content": "你的文章里有这么一句话“从大一到大三的规划想法-‘手低’”，“眼高手低”才能让我们离自己理想的offer距离更近，那具体怎样才是“眼高手低”呢？",
        //     "locked": false,
        //     "answers_length": 101
        // }, {"id": 414, "content": "“眼高手低”可以针对性的举个小例子吗？", "locked": false, "answers_length": 125}, {
        //     "id": 419,
        //     "content": "那我们应该怎么选择自己的项目和实习工作呢如何规划我们的大学生活？",
        //     "locked": false,
        //     "answers_length": 90
        // }, {"id": 420, "content": "那你觉得简历应该如何书写才会更加适合BAT这样的互联网公司呢？", "locked": false, "answers_length": 99}, {
        //     "id": 421,
        //     "content": "除了简历外还需要带一本”必胜书“请问这本书需要写哪些内容呢？",
        //     "locked": false,
        //     "answers_length": 86
        // }, {
        //     "id": 422,
        //     "content": "那除简历和小本子以外你在参加校招前还会做哪些准备呢？又如何合理规划校招时期的刷题、笔试、面试时间呢？",
        //     "locked": false,
        //     "answers_length": 60
        // }, {
        //     "id": 424,
        //     "content": "可以简单介绍一下你腾讯、UC、YY语音、阿里、酷派等企业校招offer情况吗？",
        //     "locked": false,
        //     "answers_length": 40
        // }, {
        //     "id": 425,
        //     "content": "那在BAT等互联网公司笔试、面试时有遇到什么让你印象深刻的题吗？你是怎么回答的？答题思路可以说说吗？",
        //     "locked": false,
        //     "answers_length": 94
        // }, {
        //     "id": 426,
        //     "content": "群面当中我们应该怎么去选择自己的角色呢？只有当leader或者创意提供者才能顺利通过吗？",
        //     "locked": false,
        //     "answers_length": 113
        // }, {
        //     "id": 427,
        //     "content": "你觉得作为一个产品人应该要具备哪些基本素质呢？如何通过一段时间来锻炼产品思维为以后的产品校招做准备？",
        //     "locked": false,
        //     "answers_length": 113
        // }, {
        //     "id": 428,
        //     "content": "special offer能说一下是怎样的一个获得过程吗？和普通offer在获取上流程是怎样的?",
        //     "locked": false,
        //     "answers_length": 33
        // }, {
        //     "id": 429,
        //     "content": "在面试时，面试官是否会看你的作品集？他们看的深度有多少？还是说只是扫一下，按照简历或者准备的问题来问？",
        //     "locked": false,
        //     "answers_length": 24
        // }, {
        //     "id": 430,
        //     "content": "如果有作品集的话简历需要很详细吗?因为更多东西会在作品集里介绍?",
        //     "locked": false,
        //     "answers_length": 12
        // }, {
        //     "id": 431,
        //     "content": "为何最终选择了腾讯产品策划呢？在选择offer时会做哪些考虑？可以分享一下你的职业规划吗？",
        //     "locked": false,
        //     "answers_length": 43
        // }, {"id": 432, "content": "没有拿得出手的产品相关实习经历，简历上应该怎么写才能见到HR?", "locked": false, "answers_length": 49}],
        // audio_lengths: [],
        // comments: [{
        //     "id": 169,
        //     "content": "有的语音只能听一半 难过😔",
        //     "user": {
        //         "id": "9b0d90ca-46a5-4049-831b-d6504caf9ee8",
        //         "name": "满世界格📝",
        //         "avatar": "http://cdn-img.duilu.me/18613a0ac48440e992ea04afb15a57fa"
        //     }
        // }, {
        //     "id": 252,
        //     "content": "我这边听是没问题的，应该已经修复好啦~",
        //     "user": {
        //         "id": "dca4fc96-532c-40a8-b98e-bec88692ac41",
        //         "name": "周潇",
        //         "avatar": "http://cdn-img.duilu.me/78e7cbc567c68a2f742086726e1e59ab.png"
        //     },
        //     "parent": {
        //         "user": {"id": "9b0d90ca-46a5-4049-831b-d6504caf9ee8", "name": "满世界格📝"},
        //         "id": 169,
        //         "content": "有的语音只能听一半 难过😔有的语音只能听一半 难过😔有的语音只能听一半 难过😔有的语音只能听一半 难过😔有的语音只能听一半 难过😔有的语音只能听一半 难过😔"
        //     }
        // }, {
        //     "id": 253,
        //     "content": "现在声音正常了貌似，我听了没问题~",
        //     "user": {
        //         "id": "249d37bb-29d6-4e8d-af92-36ebb7e5a721",
        //         "name": "中二青年氕氘氚",
        //         "avatar": "http://cdn-img.duilu.me/add659308d4c4da1b9e3a7315802aafa"
        //     },
        //     "parent": {
        //         "user": {"id": "9b0d90ca-46a5-4049-831b-d6504caf9ee8", "name": "满世界格📝"},
        //         "id": 169,
        //         "content": "有的语音只能听一半 难过😔"
        //     }
        // }],
        id: 1
    },
    onLoad(options){
        console.log('onload')
        console.log(options.id)
        if (options.id) {
            this.setData({id: Number(options.id)})
        }
        console.log(options)
        if (this.data.questions.length) {
            this.setData({
                // audio_lengths: this.data.questions.map(item => formatSecond(item.answers_length))
            })
        }

    },
    onReady(){
        this.fetchTalk(this.data.id)
    }
}
const mapStateToProps = (state, props) => {
    console.log('detail mapstatetoprops')
    const getVisitedTalk = makeGetVisitedTalk();
    const getTalkQuestions = makeGetTalkQuestions();
    const getTalkComments = makeGetTalkComments();
    const talk = getVisitedTalk(state, props);
    const questions = getTalkQuestions(state, props);
    const comments = getTalkComments(state, props);
    // const audioPlayer = getAudioPlayer(state, props);
    const currentUser = getCurrentUser(state, props);
    const id = props.id
    const cookedTalk = Object.assign({}, talk, {id, questions, comments, /*audioPlayer,*/ currentUser});
    return cookedTalk;

}
const mapStateToData = (state, props, options) => {
    console.log('mapstatetodata')
    console.log(options)
    const windowWidth = state.systemInfo.windowWidth
    return {windowWidth}
}
const mapDispatchToPage = dispatch =>
    bindActionCreators({fetchTalk}, dispatch)
const nextPageConfig = connect(mapStateToProps, mapDispatchToPage)(pageConfig)
Page(nextPageConfig)
