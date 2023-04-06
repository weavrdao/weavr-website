import { createStore } from "vuex"
import createPersistedState from "vuex-plugin-persistedstate";
import state from "./state"
import daoState from "./dao"
import marketState from "./market"

const walletState = createPersistedState({
  paths: ["wallet"]
})

const store = createStore({
  modules: {
    state,
    daoState,
    marketState
  },
  // plugins: [walletState]
})

export default store;