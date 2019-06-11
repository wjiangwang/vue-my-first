import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

const baseURL = '/api/v2/coCompanyInfo'
const list = listBase({ url: baseURL })

export default merge(list, {
  namespaced: true,

  actions: {
    async create({ dispatch }, formData) {
      return await request.post(baseURL, formData)
    },

    async load({}, id) {
      return await request.get(`${baseURL}/${id}`)
    },

    async update({ dispatch }, { id, formData }) {
      try {
        return await request.put(`${baseURL}/${id}`, formData)
      } catch (err) {
        return false
      }
    },

    async getEnterpriseToken({}, uuid) {
      return await request.get(`api/v2/getEnterpriseToken/${uuid}`)
    },

    async delete({ dispatch }, id) {
      try {
        await request.delete(`${baseURL}/${id}`)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    }
  }
})
