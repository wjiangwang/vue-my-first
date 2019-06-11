import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

const baseURL = '/api/v2/enCoPostCertificate'
const list = listBase({ url: baseURL })

export default merge(list, {
  namespaced: true,

  actions: {
    async load({ commit }, id) {
      return await request.get(`${baseURL}/${id}`)
    },

    async create({ dispatch }, formData) {
      try {
        await request.post(baseURL, formData)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async update({ dispatch }, { id, formData }) {
      try {
        await request.put(`${baseURL}/${id}`, formData)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async delete({ dispatch }, id) {
      try {
        await request.delete(`${baseURL}/${id}`)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    }
  }
})
