import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

const baseURL = '/api/v2/majorHazard'
const list = listBase({ url: baseURL })

export default merge(list, {
  namespaced: true,

  state: {
    recordsList: {
      items: [],
      loading: false
    }
  },

  mutations: {
    setRecordsList (state, { list }) {
      state.recordsList.items = list
    },

    recordsListLoading(state) {
      state.recordsList.loading = true
    },

    recordsListLoaded(state) {
      state.recordsList.loading = false
    }
  },

  actions: {
    async load({ commit }, id) {
      return await request.get(`${baseURL}/${id}`)
    },

    async loadRecord({ commit }, params) {
      commit('recordsListLoading')
      const result = await request.get(`${baseURL}/getRecord`, {
          params: params
        })
      commit('recordsListLoaded')
      commit('setRecordsList', {
        list: result
      })
    },

    async approveRecord ({commit, dispatch}, formData) {
      try {
        const result = await request.post(`${baseURL}/hazardsApproval`, formData)
        commit('setListFilterParams', {type: 1})
        await dispatch('loadListData', { reset: true })
        return result
      } catch (err) {}
    },

    async approveCancel ({commit, dispatch}, formData) {
      try {
        const result = await request.post(`${baseURL}/verificationApproval`, formData)
        commit('setListFilterParams', {type: 2})
        await dispatch('loadListData', { reset: true })
        return result
      } catch (err) {}
    },

    async loadCancel({ commit }, id) {
      return await request.get(`${baseURL}/showCancelAfterVerification/${id}`)
    },

    async riskList ({ commit }) {
      return await request.get('/api/v2/majorHazard/getCoRiskAssessment')
    }
  }
})
