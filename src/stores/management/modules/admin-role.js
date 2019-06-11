import Vue from 'vue'
import _ from 'lodash'
import request from '@/modules/request'
import menus from '@/modules/menus'

export default {
  namespaced: true,

  state: {
    roles: [],
    permissions: []
  },

  mutations: {
    setRoles(state, { roles }) {
      state.roles = roles
    },

    setPermissions(state, { permissions }) {
      // const menuCodes = menus.managementMenuItems.map(m => m.code)
      // state.permissions = _.sortBy(permissions, (p) => {
      //   const index = menuCodes.indexOf(p.code)
      //   return index === -1 ? permissions.length : index
      // })
      const menuCodes = menus.managementMenuItems.map(m => m.code)
      permissions = _.sortBy(permissions, (p) => {
        const index = menuCodes.indexOf(p.code)
        return index === -1 ? permissions.length : index
      })
      state.permissions = _.filter(permissions, (i) => {return i.parentId < 1})
      _.each(permissions, (i) => {
        let exist = _.find(state.permissions, {id: i.parentId})
        let existSub = _.findLast(state.permissions, {parentId: i.parentId})
        if (exist && existSub) {
          let index = state.permissions.indexOf(existSub) + 1
          state.permissions.splice(index, 0, i)
        } else if (exist) {
          let index = state.permissions.indexOf(exist) + 1
          state.permissions.splice(index, 0, i)
        }
      })
    },

    updateRoleSelected(state, { roleId }) {
      state.roles.forEach(role => {
        Vue.set(role, 'selected', role.id === roleId)
      })
    },

    updatePermissions(state, { permissions }) {
      state.permissions.forEach(permission => {
        const index = permissions.findIndex(p => p.id === permission.id)
        Vue.set(permission, 'selected', index !== -1)
      })
    }
  },

  actions: {
    async loadInitialData({ dispatch }) {
      await dispatch('loadRoles')
      await dispatch('loadPermissions')
    },

    async loadRoles({ commit }) {
      const roles = await request.get('/api/v2/sysRole')
      commit('setRoles', { roles })
    },

    async loadPermissions({ commit }) {
      const permissions = await request.get('/api/v2/menus')
      commit('setPermissions', { permissions })
    },

    async loadRolePermissions({ commit }, roleId) {
      const permissions = await request.get(`/api/v2/permissions/${roleId}`)
      commit('updatePermissions', { permissions })
    },

    async updateRolePermissions({}, { roleId, permissions }) {
      await request.put(
        `/api/v2/permissions/${roleId}`,
        permissions.map(permission => permission.id)
      )
    },

    async create({ dispatch }, formData) {
      await request.post('/api/v2/sysRole', formData)
      await dispatch('loadInitialData')
    },

    async load({ commit }, id) {
      return await request.get(`/api/v2/sysRole/${id}`)
    },

    async update({ dispatch }, { id, formData }) {
      await request.put(`/api/v2/sysRole/${id}`, formData)
      await dispatch('loadRoles')
    },

    async delete({ dispatch }, id) {
      await request.delete(`/api/v2/sysRole/${id}`)
      await dispatch('loadInitialData')
    }
  }
}
