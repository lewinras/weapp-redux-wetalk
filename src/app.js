//app.js
import {Provider} from './libs/wechat-weapp-redux'
import store from './configureStore';

App(
    Provider(store)({
            onLaunch: function () {
                console.log("onLaunch")
            }
        }
    )
)