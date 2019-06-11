import request from '@/modules/request'

export default {
  namespaced: true,

  actions: {
    async load({}, enterpriseId) {
      return await request.get(
        `/api/v2/coSafetyManagementInfo/safeManagementInfo/${enterpriseId}`
      )
    },

    async update({ dispatch }, { id, formData }) {
      try {
        return await request.put(
          `/api/v2/coSafetyManagementInfo/safeManagementInfo/${id}`,
          formData
        )
      } catch (err) {
        return false
      }
    }
  }
}