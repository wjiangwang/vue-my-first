import merge from 'lodash/merge'
import request from '@/modules/request'
import base from '@/stores/management/modules/enterprise-risk-trend'

export default merge(base, {
  actions: {
    async loadData({ commit }) {
      commit('setLoading')

      const result = await request.get(
        '/api/v2/home/riskHiddenDangerTendency?num=30'
      )
      commit('setLoading', false)
      commit('setChartData', result)
    }
  }
})
