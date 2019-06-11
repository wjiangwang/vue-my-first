import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'

const baseURL = '/api/v2/riskControlRecord'
const list = listBase({url: `${baseURL}/bookList`})

// 风险管控台帐
export default merge(list, {
  namespaced: true,

  state: {
    list: {
      pageSize: 10
    }
  },

  mutations: {

  },

  actions: {
    async getTree () {
      return await request.get(`${baseURL}/riskThrss`)
    },

    async load ({}, params) {
      return await request.get(`${baseURL}/riskShow`, {
        params: params
      })
    }
  }
})
