import request from '@/modules/request'

function transformItems(data) {
  const items = []

  data.securityRiskTypes.forEach(type => {
    type.securityRiskProject.forEach(project => {
      project.securityRiskContent.forEach(content => {
        items.push(Object.assign({
          typeId: type.id,
          typeName: type.name,
          projectId: project.id,
          projectName: project.name
        }, content))
      })
    })
  })

  return items
}

export default {
  namespaced: true,

  state: {
    loading: false,
    items: [],
    totalScore: 0
  },

  mutations: {
    setItems(state, items) {
      state.items = items
    },

    updateItemScore(state, { itemId, score }) {
      const item = state.items.find(item => item.id === itemId)
      item.score = score
    },

    setTotalScore(state, score) {
      state.totalScore = score
    },

    setLoading(state, loading = true) {
      state.loading = loading
    }
  },

  actions: {
    async loadData({ commit }, enterpriseId) {
      commit('setLoading')
      const result = await request.get(`/api/v2/securityRiskContent/${enterpriseId}`)

      commit('setItems', transformItems(result))
      commit('setTotalScore', result.countScope)
      commit('setLoading', false)
    },

    async updateScore({ state, dispatch }, enterpriseId) {
      const data = state.items.map(item => {
        return {
          companyId: enterpriseId,
          riskContentId: item.id,
          scorePoints: item.score
        }
      })

      const result = await request.put(`/api/v2/securityRiskContent/${enterpriseId}`, {
        securityAnswerQuestions: data
      })

      dispatch('loadData', enterpriseId)

      return result
    },

    async updateTotalScore({ commit }, { enterpriseId, totalScore }) {
      await request.post('/api/v2/securityRiskContent', {
        companyId: enterpriseId,
        scope: totalScore
      })
      commit('setTotalScore', totalScore)
    }
  }
}
