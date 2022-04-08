import Vue from 'vue'
import Vuex from 'vuex'
import vuexPersistedstate from 'vuex-persistedstate'
import getters from './getters.js'
import actions from './actions.js'
import state from './state.js'
import mutations from './mutations.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [vuexPersistedstate()]
})
