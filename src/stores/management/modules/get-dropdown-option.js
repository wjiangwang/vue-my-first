import request from '@/modules/request'

export default {
  namespaced: true,

  actions: {
    async getDropdown({ commit }, dropdown = {}) {
      return await request.get('/api/v2/emergencyRescue/getOption', {
        params: dropdown
      })
    },

    async getAllArea({ commit }) { // 选择地区
      return await request.get('/api/v2/emergencyRescue/getAllArea')
    },
    async getCompanyAll({ commit }) { // 选择企业
      return await request.get('/api/v2/emergencyRescue/getCompanyAll')
    },
    async groupAll({ commit }) { // 选择集团
      return await request.get('/api/v2/emergencyRescue/groupAll')
    },
    async industryCategoriesAll({ commit }) { // 行业类别
      return await request.get('/api/v2/emergencyRescue/industryCategoriesAll')
    }
  }
}
