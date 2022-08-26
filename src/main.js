import { createApp, h } from "vue"
import App from "./App.vue"
import router from "@/router"
import store from "./store"
import "./styles/frabric-custom.scss";
// import "bulma/css/bulma.css"
import Toaster from "@meforma/vue-toaster";
import Unicon from "vue-unicons"
import { uniMultiplySolid, uniAppsSolid, uniListUlSolid, uniConstructor } from "vue-unicons/dist/icons"

Unicon.add([uniMultiplySolid, uniAppsSolid, uniListUlSolid, uniConstructor])

require("dotenv").config()

const app = createApp({
  render: () => h(App)
})

store.$toast = app.$toast;

app.config.productionTip = false
app.use(router)
app.use(store)
app.use(Toaster)
app.use(Unicon)
app.mount("#app")

