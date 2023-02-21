import { createStore } from "vuex"
import state from "./state"
import daoState from "./dao"
import marketState from "./market"
const store = createStore({
  modules: {
    state,
    daoState,
    marketState
  },
})

export default store;