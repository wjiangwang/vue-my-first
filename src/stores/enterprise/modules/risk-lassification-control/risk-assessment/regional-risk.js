import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

function transformItems(subjects) {
  const result = []

  subjects.forEach(subject => {
    subject.threeSubprojects.forEach(item => {
      result.push(Object.assign({}, subject, item))
    })
  })

  return result
}

const baseURL = '/api/v2/regionalRisk'

// 区域风险相关接口
const list = listBase({ url: `${baseURL}/coRiskAssessmentList` })
export default merge(list, {
  namespaced: true,

  state: {
    riskLevelList: {
      loading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      params: {},
      filterParams: {},
      items: []
    },
    flattenedSCLItems: []
  },

  mutations: {
    updateItemStatus(state, { id, status }) {
      const item = state.list.items.find(item => item.id === id)
      if (item) item.status = status
    },

    setRiskLevelListParams(state, params = {}) {
      state.riskLevelList.params = Object.assign({}, state.riskLevelList.params, params)
    },

    setRiskLevelListFilterParams(state, params = {}) {
      state.riskLevelList.filterParams = cloneDeep(params)
    },

    setRiskLevelListPageSize(state, pageSize) {
      state.riskLevelList.pageSize = pageSize
    },

    riskLevelListLoading(state) {
      state.riskLevelList.loading = true
    },

    riskLevelListLoaded(state) {
      state.riskLevelList.loading = false
    },

    setRiskLevelListData(state, { total, currentPage, items }) {
      state.riskLevelList = Object.assign({}, state.riskLevelList, {
        total, currentPage, items
      })
    },

    setRiskDangerItems(state, items) {
      // state.sclItems = items
      state.flattenedSCLItems = transformItems(items)
    }
  },

  actions: {
    async create({ dispatch }, formData) {
      try {
        await request.post(`${baseURL}/addCoRiskAssessment`, formData)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async load({ commit }, id) {
      return await request.get(`${baseURL}/showCoRiskAssessment/${id}`)
    },

    async update({ dispatch }, { id, formData }) {
      try {
        await request.put(`${baseURL}/updateCoRiskAssessment/${id}`, formData)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async delete({ dispatch }, id) {
      try {
        await request.delete(`${baseURL}/deleteCoRiskAssessment/${id}`)
        await dispatch('loadListData', { reset: true })
      } catch (err) {}
    },

    async updateStatus({ commit }, { id, status }) {
      await request.put(`${baseURL}/updateCoRiskAssessment/${id}`, { status })
      commit('updateItemStatus', { id, status })
    },

    async loadRiskLevelList ({ state, commit }, { page = 1 } = {}) {
      commit('riskLevelListLoading')
      let result = {}
      if (state.riskLevelList.params.type === 'risk') {
        result = await request.get(`${baseURL}/threeSubprojectList`, {
          params: Object.assign({
            current: page,
            size: state.riskLevelList.pageSize
          }, state.riskLevelList.params, state.riskLevelList.filterParams)
        })
      } else {
        result = await request.get(`${baseURL}/hiddenDangerList`, {
          params: Object.assign({
            current: page,
            size: state.riskLevelList.pageSize,
            hiddenDangerLevel: state.riskLevelList.params.riskLevel,
          }, state.riskLevelList.params, state.riskLevelList.filterParams)
        })
      }

      commit('riskLevelListLoaded')
      commit('setRiskLevelListData', {
        total: result.total,
        currentPage: page,
        items: result.records
      })
    },

    async loadHiddenDetail ({}, id) {
      return await request(`${baseURL}/getHiddenDangerManagement/${id}`)
    },

    async loadRiskDanger ({ commit }, id) {
      const result = await request.get(`${baseURL}/getSCLRisk`, {
        params: { riskAssessmentId: id }
      })

      commit('setRiskDangerItems', result)
    },

    async loadRiskDetail ({}, id) {
      return await request.get(`${baseURL}/getRiskDetail`, {
        params: { riskAssessmentId: id }
      })
    },

    export () {
      console.log('cfnvkn')
    }

    // async loadThirdItemCases({}, id) {
    //   return await request.get(`/api/v2/coRiskAssessment/caseList/${id}`)
    // },

    // async removeControls({}, enterpriseId) {
    //   return await request.delete(`/api/v2/coRiskAssessment/removeControlData/${enterpriseId}`)
    // }
  }
})
