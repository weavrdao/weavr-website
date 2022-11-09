import { createApp, h } from "vue"
import App from "./App.vue"
import { sync } from "vuex-router-sync"
import home from "./router/home.js"
import governance from "./router/governance.js"
import dapp from "./router/dapp.js"
import store from "./store"
import "./styles/frabric-custom.scss";
// import "bulma/css/bulma.css"
import Toaster from "@meforma/vue-toaster";
import Unicon from "vue-unicons"
import { uniTimesCircle, uniTimes, uniTimesSquare, uniSignout, uniEyeSlash, uniBullseye, uniTwitter, uniDiscord, uniGithub } from 'vue-unicons/dist/icons'
Unicon.add([uniTimes, uniTimesSquare, uniSignout, uniEyeSlash, uniBullseye, uniTwitter, uniDiscord, uniGithub  ])
require("dotenv").config()
const host = window.location.host;
const parts = host.split('.');
const domainLength = 3; // route1.example.com => domain length = 3



const router = () => {
  let routes;
  if (parts.length === (domainLength - 1) || parts[0] === 'www') {
    console.log("not a domain, or www")
    routes = home;
  } else if (parts[0] === 'app') {
    console.log("dapp")
    routes = dapp;
  } else if (parts[0] === 'gov') {
    console.log("gov")
    routes = governance;
  } else {
    // If you want to do something else just comment the line below
    console.log("else branch")
    routes = home;
  }
  return routes;
};




const unsync = sync(store, router()) // done. Returns an unsync callback fn


const app = createApp({
  render: () => h(App)
})

store.$toast = app.$toast;

app.config.productionTip = true
app.use(router())
app.use(store)
app.use(Toaster)
app.use(Unicon)
app.mount("#app")

