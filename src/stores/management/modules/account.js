import pick from 'lodash/pick'
import request from '@/modules/request'

export default {
  namespaced: true,

  state: {
    model: {
      id: '',
      account: '',
      nickname: '',
      telephone: '',
      email: '',
      roleName: '',
      password: ''
    }
  },

  mutations: {
    setAccount(state, data) {
      state.model = Object.assign(state.model, pick(data, Object.keys(state.model)))
    }
  },

  actions: {
    async loadData({ commit }) {
      const result = await request.get('/api/v2/sysUser/getUserInfo')
      commit('setAccount', result)
    },

    async updatePassword({ state }, formData) {
      return await request
        .post('/api/v2/sysUser/updateUserPassword', formData)
    }
  }
}