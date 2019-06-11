import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

const urls = {
  control: '/api/v2/homePage/riskControl',
  riskLevel: '/api/v2/homePage/riskCompanyList',
  trend: 'api/v2/homePage/riskTendencyDetail',
  label: '/api/v2/elementArgument/companyListByLabel'
}

export default merge(listBase(), {
  namespaced: true,

  actions: {
    async loadListData({ state, commit }, { page = 1, reset = false, type } = {}) {
      if (!type) return

      commit('listLoading')

      if (reset) commit('setListFilterParams', {})

      const result = await request.get(urls[type], {
        params: Object.assign({
          current: page,
          size: state.list.pageSize
        }, state.list.params, state.list.filterParams)
      })

      commit('listLoaded')
      commit('setListData', {
        total: result.total,
        currentPage: page,
        items: result.records.filter(v => !!v)
      })
    }
  }
})