import { createStore } from "vuex"
import state from "./state"

const store = createStore({
  modules: {
    state
  },
})

export default store;