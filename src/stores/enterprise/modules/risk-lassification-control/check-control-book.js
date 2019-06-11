import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'
// 隐患治理台帐
const baseURL = '/api/v2/checkGovernanceRecord'
const list = listBase({ url: `${baseURL}/bookListByType` })

export default merge(list, {
  namespaced: true,

  state: {},

  mutations: {},

  actions: {
    async getTree() {
      return await request.get(`${baseURL}/riskThrss`)
    },

    // async load({}, params) {
    //   return await request.get(`${baseURL}/riskShow`, {
    //     params: params
    //   })
    // },
    async getRiskOptions({}) {
      return await request.get(`/api/v2/generalAPI/getRiskAll`)
    },
    async loadDetail({}, bookId) {
      let result = await request.get(`${baseURL}/showCheckGovernanceRecord`, {
        params: {
          bookId
        }
      })
      for (const key in result) {
        if (result[key] === null || result[key] === '') {
          result[key] = '/'
        }
        if (result['hiddenFlowUrl'] === '/') {
          result['hiddenFlowUrl'] = ''
        }
        if (result['reviewUrl'] === '/') {
          result['reviewUrl'] = ''
        }
        if (result['controlsUrl'] === '/') {
          result['controlsUrl'] = ''
        }
      }

      return result
    }
  }
})
