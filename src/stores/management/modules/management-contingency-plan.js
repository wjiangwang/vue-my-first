import merge from 'lodash/merge'
import listBase from '@/stores/list'
import request from '@/modules/request'

const baseURL = '/api/v2/emergencyRescue/enterpriseAll'
const list = listBase({ url: baseURL })
const params={}

export default merge(list,{
  namespaced: true,
  state:{
    totalNumber:{
    }
  },
  mutations:{
    setTotalData(state, { totalNumber }) {
      state.totalNumber = totalNumber
    }
  },
  actions:{
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
        total: result.companyList.total,
        currentPage: page,
        items: result.companyList.records
      })
      commit('setTotalData', {
        totalNumber: result.totalNumber,
      })
    },
    async filterData({ commit, dispatch }, filterParams = {}) {
      commit('setListFilterParams', filterParams)
      await dispatch('getData')
    }
  }
})
