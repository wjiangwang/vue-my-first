import Vue from 'vue'
import request from '@/modules/request'

export default {
  namespaced: true,

  state: {
    dimensionList: {
      total: 0,
      status: 0,
      items: []
    },

    enterpriseGrades: [],

    enterpriseMapItems: [],

    enterpriseTreeList: [],

    enterpriseTreeItems: [],

    mapType: 1
  },

  getters: {
    filteredEnterprises: (state) => (keyword) => {
      return state.enterpriseTreeItems.filter(item => {
        return item.enterpriseName.includes(keyword)
      })
    }
  },

  mutations: {
    setDimensionListData(state, data) {
      state.dimensionList = {
        total: data.countCompany,
        status: data.status,
        items: data.listCompany
      }
    },

    setDimensionListStatus(state, status) {
      state.dimensionList.status = status
    },

    setEnterpriseGrades(state, data) {
      state.enterpriseGrades = data
    },

    setEnterpriseMapItems(state, data) {
      state.enterpriseMapItems = data
    },

    showMapItemInfoWindow(state, id) {
      const index = state.enterpriseMapItems.findIndex(item => item.id === id)
      if (index !== -1) {
        const item = state.enterpriseMapItems[index]
        Vue.set(item, 'infoWindowShow', true)
        state.enterpriseMapItems.splice(index, 1, item)
      }

      return state.enterpriseMapItems[index]
    },

    hideMapItemInfoWindow(state, id) {
      const index = state.enterpriseMapItems.findIndex(item => item.id === id)
      if (index !== -1) {
        const item = state.enterpriseMapItems[index]
        Vue.set(item, 'infoWindowShow', false)
        state.enterpriseMapItems.splice(index, 1, item)
      }
    },

    setEnterpriseTreeList(state, data) {
      const list = []
      let enterprises = []

      data.forEach(province => {
        const firstLevel = { label: province.province, children: [] }

        province.city.forEach(city => {
          const secondLevel = { label: city.city, children: [] }

          city.area.forEach(area => {
            const thirdLevel = {
              label: area.area,
              children: area.companyNameList.map(item => ({
                id: item.id,
                label: item.enterpriseName,
                isEnterprise: true
              }))
            }

            secondLevel.children.push(thirdLevel)
            enterprises = enterprises.concat(area.companyNameList)
          })

          firstLevel.children.push(secondLevel)
        })

        list.push(firstLevel)
      })

      state.enterpriseTreeList = list
      state.enterpriseTreeItems = enterprises
    },

    setMapType (state, data) {
      state.mapType = data
    }
  },

  actions: {
    async loadDimensionListData({ commit }, params = {}) {
      const result = await request.get(
        '/api/v2/elementArgument/multidimensional',
        { params }
      )

      commit('setDimensionListData', result)
    },

    async loadEnterpriseMapItems({ state, commit }, params = {}) {
      params = Object.assign({}, { type: state.mapType }, params)
      const result =
        await request.get('/api/v2/elementArgument/companyInfoList', { params })
      commit('setEnterpriseMapItems', result)
    },

    async loadEnterpriseTreeListData({ commit }) {
      const result =
        await request.get('/api/v2/elementArgument/companyNameList')
      commit('setEnterpriseTreeList', result)
    },

    async updateControlStatus({ commit }, data) {
      commit('setDimensionListStatus', data.status)
      return await request.post('/api/v2/controlledManagement', data)
    },

    async loadEnterpriseGrades({ commit }) {
      const result = await request.get('/dropDownChoice/enterpriseType')
      commit('setEnterpriseGrades', result)
    }
  }
}
