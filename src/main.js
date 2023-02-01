import { createApp, h } from "vue"
import App from "./App.vue"
import router from "./router/index.js";
import store from "./store"
import "./styles/weavr-custom.scss";
// import "bulma/css/bulma.css"
import Toaster from "@meforma/vue-toaster";
import Unicon from "vue-unicons"
import {uniUserPlus, uniTimesCircle, uniSync, uniEye,  uniSearch, uniArrowUpRight, uniEyeSlash, uniTimes, uniTimesSquare, uniSignOutAlt, uniFilePlusAlt, uniCamera, uniBullseye, uniTwitter, uniDiscord,  uniAngleLeft, uniAngleDown, uniGithub, uniUserCheck, uniCopy, uniPen } from 'vue-unicons/dist/icons'
Unicon.add([uniUserPlus, uniTimesCircle, uniSync, uniEye, uniPen, uniSearch, uniArrowUpRight, uniTimes,uniEyeSlash, uniTimesSquare, uniSignOutAlt, uniFilePlusAlt, uniCamera, uniAngleDown, uniUserCheck, uniBullseye, uniTwitter, uniDiscord, uniAngleLeft, uniAngleDown, uniGithub, uniCopy])
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

