import request from '@/modules/request'

export default {
  namespaced: true,

  state: {
    model: {}
  },

  mutations: {
    setAccount(state, data) {
      state.model = data
    }
  },

  actions: {
    async loadData({ commit }) {
      const result = await request.get('/api/v2/companyUser/getUserInfo')
      commit('setAccount', result)
    },

    async updatePassword({ state }, formData) {
      return await request
        .post('/api/v2/companyUser/updateUserPassword', formData)
    }
  }
}
