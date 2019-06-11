import request from '@/modules/request'

export default function({ url, params = {} } = {}) {
  return {
    actions: {
      async create({ dispatch }, formData) {
        try {
          await request.post(`${url}`, formData)
          await dispatch('loadListData', { reset: true })
        } catch (err) {}
      },

      async delete({ dispatch }, id) {
        try {
          await request.delete(`${url}/${id}`)
          await dispatch('loadListData', { reset: true })
        } catch (err) {}
      },

      async update({ dispatch }, { id, formData }) {
        try {
          await request.put(`${url}/${id}`, formData)
          await dispatch('loadListData', { reset: true })
        } catch (err) {}
      },

      async detail({ commit }, id) {
        return await request.get(`${url}/${id}`)
      }
    }
  }
}
