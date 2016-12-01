//app.js
import {Provider} from './libs/wechat-redux'
import store from './configureStore';

App(
    Provider(store)({
            onLaunch: function () {
                console.log("onLaunch")
            }
        }
    )
)