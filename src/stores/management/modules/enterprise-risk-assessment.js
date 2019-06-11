import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

const baseURL = '/api/v2/coRiskAssessment'
const list = listBase({ url: baseURL })

export default merge(list, {
  namespaced: true,

  mutations: {
    updateItemStatus(state, { id, status }) {
      const item = state.list.items.find(item => item.id === id)
      if (item) item.status = status
    }
  },

  actions: {
    async create({ dispatch }, formData) {
      try {
        await request.post(baseURL, formData)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async load({ commit }, id) {
      return await request.get(`${baseURL}/${id}`)
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
    },

    async updateStatus({ commit }, { id, status }) {
      await request.put(`${baseURL}/${id}`, { status })
      commit('updateItemStatus', { id, status })
    },

    async loadThirdItemCases({}, id) {
      return await request.get(`/api/v2/coRiskAssessment/caseList/${id}`)
    },

    async removeControls({}, enterpriseId) {
      return await request.delete(`/api/v2/coRiskAssessment/removeControlData/${enterpriseId}`)
    }
  }
})
