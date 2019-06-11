import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

const baseURL = '/api/v2/threeSubproject'
const list = listBase()
// 作业风险详情（三级列表）
export default merge(list, {
  namespaced: true,

  state: {
  },

  mutations: {
  },

  actions: {
    async loadListData({ state, commit }, { page = 1, reset = false } = {}) {
      commit('listLoading')
      if (reset) commit('setListFilterParams', {})
      const result = await request.get(`/api/v2/twoSubproject/threeSubprojectInfo/${state.list.params.secondId}`, {
        params: Object.assign({
          current: page,
          size: state.list.pageSize
        }, state.list.params, state.list.filterParams)
      })

      commit('listLoaded')
      commit('setListData', {
        total: result.total,
        currentPage: page,
        items: result.records
      })
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
    }
  }
})
