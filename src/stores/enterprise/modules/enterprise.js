import request from '@/modules/request'

const baseURL = '/api/v2/coCompanyInfo'

export default {
  namespaced: true,

  actions: {
    async load({}) {
      return await request.get(baseURL)
    },

    async update({ dispatch }, { id, formData }) {
      try {
        return await request.put(`${baseURL}/${id}`, formData)
      } catch (err) {
        return false
      }
    }
  }
}
