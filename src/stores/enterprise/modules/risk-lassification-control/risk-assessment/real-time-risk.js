import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'
// 作业风险
const baseURL = '/api/v2/workRisk'
const list = listBase({url: `${baseURL}/getAll`})

export default merge(list, {
  namespaced: true,

  state: {
    historyList: {
      loading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      items: []
    }
  },

  mutations: {
    setHistoryListData(state, { total, currentPage, items}) {
      state.historyList = Object.assign({}, state.historyList, {
        total, currentPage, items
      })
    },

    setHistoryListPageSize(state, pageSize) {
      state.historyList.pageSize = pageSize
    },

    historylistLoading(state) {
      state.historyList.loading = true
    },

    historylistLoaded(state) {
      state.historyList.loading = false
    },
  },

  actions: {
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

    async loadHistory({state, commit }, id, { page = 1 } = {}) {
      commit('historylistLoading')
      const result = await request.get(`${baseURL}/record/${id}`, {
        params: Object.assign({
          current: page,
          size: state.historyList.pageSize
        })
      })

      commit('historylistLoaded')
      commit('setHistoryListData', {
        // total: result.total,
        // currentPage: page,
        // items: result.records
        items: result
      })
    }
  }
})
