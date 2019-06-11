import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

// const listBaseURL = '/api/v2/twoSubproject/threeSubprojectInfo'
const list = listBase()

const baseURL = '/api/v2/generalAPI'

export default merge(list, {
  namespaced: true,

  actions: {
    async loadListData({ state, commit }, { page = 1, reset = false } = {}) {
      commit('listLoading')

      if (reset) commit('setListFilterParams', {})

      // let listURL
      // if (window.__APP_EDITION__ === 'ENTERPRISE') {
      //   console.log('企业端来了')
      //   listURL = '/api/v2/coRiskAssessment/threeSubprojectInfo'
      // } else  {
      //   listURL = `${listBaseURL}/${state.list.params.twoSubprojectId}`
      // }

      const result = await request.get(`${baseURL}/threeSubprojectList/${state.list.params.twoSubprojectId}`, {
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

    async create({ dispatch }, formData) {
      try {
        if (window.__APP_EDITION__ === 'ENTERPRISE') {
          formData.isSystem = 'N'
        }

        await request.post(`${baseURL}/addThreeSubproject`, formData)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async load({}, id) {
      // let url
      // if (window.__APP_EDITION__ === 'ENTERPRISE') {
      //   url = `/api/v2/coRiskAssessment/threeSubprojectInfo/${id}`
      // } else {
      //   url = `${baseURL}/${id}`
      // }

      return await request.get(`${baseURL}/showThreeSubproject/${id}`)
    },

    async update({ dispatch }, { id, formData }) {
      try {
        await request.put(`${baseURL}/updateThreeSubproject/${id}`, formData)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async delete({ dispatch }, id) {
      try {
        await request.delete(`${baseURL}/deleteThreeSubproject/${id}`)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async updateCase({ dispatch }, { id, formData }) {
      await request.put(`${baseURL}/updateThreeSubproject/${id}`, formData)
      await dispatch('loadListData', { reset: true })
    }
  }
})
