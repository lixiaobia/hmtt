import Vue from 'vue'
import Vuex from 'vuex'
import { setStorages, getStorages } from '@/utils/storage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(getStorages('user')) || {} // 用户基本资料(默认从本地取)
  },
  getters: {
  },
  mutations: {
    setUser (state, userObj) {
      state.user = userObj
      setStorages('user', JSON.stringify(userObj))
    }
  },
  actions: {
  },
  modules: {
  }
})
