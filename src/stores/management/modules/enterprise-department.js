import omit from 'lodash/omit'
import request from '@/modules/request'

const baseURL = '/api/v2/coPersonInfo/department'

function flattenDepartments(departments, depth = 0) {
  let result = []

  departments.forEach(department => {
    result.push(Object.assign({ depth }, omit(department, 'children')))

    if (department.children && department.children.length)
      result = result.concat(flattenDepartments(department.children, depth + 1))
  })

  return result
}

export default {
  namespaced: true,

  state: {
    list: {
      loading: false,
      params: {},
      items: [],
      treeItems: []
    }
  },

  mutations: {
    listLoading(state) {
      state.list.loading = true
    },

    listLoaded(state) {
      state.list.loading = false
    },

    setListParams(state, params) {
      state.list.params = Object.assign({}, state.list.params, params)
    },

    setListData(state, { items }) {
      state.list.treeItems = items
      state.list.items = flattenDepartments(items)
    }
  },

  actions: {
    async loadListData({ state, commit }) {
      commit('listLoading')

      const result = await request.get(`${baseURL}/${state.list.params.enterpriseId}`)

      commit('listLoaded')
      commit('setListData', { items: result })
    },
    
    async create({ dispatch }, formData) {
      try {
        await request.post(baseURL, formData)
        await dispatch('loadListData')
      } catch (err) {}
    },

    async load({ commit }, id) {
      return await request.get(`${baseURL}/${id}/show`)
    },

    async update({ dispatch }, { id, formData }) {
      try {
        await request.put(`${baseURL}/${id}`, formData)
        await dispatch('loadListData')
      } catch (err) {}
    },

    async delete({ dispatch }, id) {
      try {
        await request.delete(`${baseURL}/${id}`)
        await dispatch('loadListData')
      } catch (err) {}
    },

    async loadParentList({}, { enterpriseId }) {
      return await request.get(`${baseURL}/parentList/${enterpriseId}`)
    }
  }
}