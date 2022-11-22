import { createApp, h } from "vue"
import App from "./App.vue"
import router from "./router/index.js"
import store from "./store"
import "./styles/frabric-custom.scss";
// import "bulma/css/bulma.css"
import Toaster from "@meforma/vue-toaster";
import Unicon from "vue-unicons"
import { uniArrowUpRight, uniEyeSlash, uniTimes, uniTimesSquare, uniSignout, uniFilePlusAlt, uniCamera, uniBullseye, uniTwitter, uniDiscord,  uniAngleLeft, uniAngleDown, uniGithub, uniUserCheck } from 'vue-unicons/dist/icons'
Unicon.add([uniArrowUpRight, uniTimes,uniEyeSlash, uniTimesSquare, uniSignout, uniFilePlusAlt, uniCamera, uniAngleDown, uniUserCheck, uniBullseye, uniTwitter, uniDiscord, uniAngleLeft, uniAngleDown, uniGithub])
require("dotenv").config()





const app = createApp({
    render: () => h(App)
})

store.$toast = app.$toast;

app.config.productionTip = true
app.use(router)
app.use(store)
app.use(Toaster)
app.use(Unicon)
app.mount("#app")

