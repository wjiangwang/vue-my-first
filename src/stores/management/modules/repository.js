import merge from 'lodash/merge'
import listBase from '@/stores/list'

import request from '@/modules/request'
const baseURL = '/api/v2/knowledgeBase/knowledgeBaseList'
const list = listBase({ url: baseURL })
const params = {}

export default merge(list,{
  namespaced: true,

  actions: {
    async getData({ state, commit }, { page = 1, reset = false } = {}) {
      commit('listLoading')
      if (reset) commit('setListFilterParams', {})
      const result = await request.get(baseURL, {
        params: Object.assign({
          current: page,
          size: state.list.pageSize
        }, params, state.list.params, state.list.filterParams)
      })
      commit('listLoaded')
      commit('setListData', {
        total: result.total,
        currentPage: page,
        items: result
      })
    },


    async filterData({ commit, dispatch }, filterParams = {}) {
      commit('setListFilterParams', filterParams)
      await dispatch('getData')
    },

    async parentAll({ dispatch }) {
      try {
        return await request.get('/api/v2/knowledgeBase/parentAll')
      } catch (err) {}
    },

    async create({ dispatch }, formData) {
      try {
        await request.post('/api/v2/knowledgeBase', formData)
        await dispatch('getData', { reset: true })
      } catch (err) {}
    },

    // async load({ commit }, id) {
    //   return await request.get(`${baseURL}/${id}`)
    // },

    async update({ dispatch }, { id, formData }) {
      try {
        await request.put(`/api/v2/knowledgeBase/${id}`, formData)
        await dispatch('getData', { reset: true })
      } catch (err) {}
    },

    async delete({ dispatch }, id) {
      try {
        await request.delete(`/api/v2/knowledgeBase/${id}`)
        await dispatch('getData', { reset: true })
      } catch (err) {}
    }
  }
}) 
