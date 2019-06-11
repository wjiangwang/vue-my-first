import pick from 'lodash/pick'
import dayjs from 'dayjs'
import request from '@/modules/request'

const levelsText = ['重大', '较大', '一般', '低']
const levelsColor = ['#FA5878', '#F49E41', '#F4D341', '#4580FF']

function transformDoughnutData(items, totalCount) {
  const columns = ['level', 'count']

  return [1, 2, 3, 4].map(level => {
    const item = items.find(item => item.minLevel === level)
    const count = item ? item.countCompany : 0
    const restCount = item ? totalCount - item.countCompany : totalCount
    const name = {
      level: level,
      label: `${levelsText[level - 1]}风险企业`
    }

    const rows = [
      {
        level: JSON.stringify(Object.assign({ value: count }, name)),
        count
      },
      {
        level: JSON.stringify(
          Object.assign({ value: count, rest: true }, name)
        ),
        count: restCount
      }
    ]

    return {
      level,
      label: name.label,
      count: item ? item.countCompany : 0,
      chartData: { columns, rows }
    }
  })
}

export default {
  namespaced: true,

  state: {
    controlStat: {
      hasControl: 0,
      notControl: 0
    },

    riskDoughnutDataset: {
      loading: false,
      total: 0,
      items: []
    },

    riskBarDataset: {
      loading: false,
      chartSettings: {},
      chartData: {}
    },

    riskLineDataset: {
      loading: false,
      chartData: {}
    },

    mapDataset: {
      loading: false,
      chartData: []
    },
    materialAndTeamDataset: {
      loading: false,
      equipmentMaterial: {
        chartData: []
      },
      erRescueTeam: {
        chartData: []
      }
    }
  },

  mutations: {
    setControlStat(state, data) {
      state.controlStat = pick(data, Object.keys(state.controlStat))
    },

    setRiskDoughnutLoading(state, loading = true) {
      state.riskDoughnutDataset.loading = loading
    },

    setRiskDoughnutData(state, data) {
      const total = data.totalCompany

      state.riskDoughnutDataset.loading = false
      state.riskDoughnutDataset = {
        total,
        items: transformDoughnutData(data.statistic, data.totalCompany)
      }
    },

    setRiskBarLoading(state, loading = true) {
      state.riskBarDataset.loading = loading
    },

    setRiskBarData(state, data) {
      state.riskBarDataset.loading = false

      const columns = ['category', 'level4', 'level3', 'level2', 'level1']
      const chartSettings = {
        labelMap: {
          level4: '低风险企业',
          level3: '一般风险企业',
          level2: '较大风险企业',
          level1: '重大风险企业'
        },
        legendName: {
          低风险企业: `低（${data.fourRisk}）`,
          一般风险企业: `一般（${data.threeRisk}）`,
          较大风险企业: `较大（${data.twoRisk}）`,
          重大风险企业: `重大（${data.oneRisk}）`
        }
      }

      const rows = data.companyType.map(item => {
        return {
          category: item.enterpriseGrade,
          level4: item.fourRisk,
          level3: item.threeRisk,
          level2: item.twoRisk,
          level1: item.oneRisk
        }
      })

      state.riskBarDataset.chartSettings = chartSettings
      state.riskBarDataset.chartData = { columns, rows }
    },

    setRiskLineLoading(state, loading = true) {
      state.riskLineDataset.loading = loading
    },

    setRiskLineData(state, data) {
      state.riskLineDataset.loading = false

      const columns = ['date', 'risk', 'hiddenDanger']
      const rows = data.map(item => {
        return {
          date: dayjs(item.dayDate).format('MM-DD'),
          risk: item.riskCount,
          hiddenDanger: item.hiddenCount
        }
      })

      state.riskLineDataset.chartData = { columns, rows }
    },

    setMapLoading(state, loading = true) {
      state.mapDataset.loading = loading
    },

    setMapData(state, data) {
      state.mapDataset.loading = false
      const res = data.map(item => {
        return {
          name: item.enterpriseName,
          value: [item.longitude, item.latitude],
          uuid: item.uuid,
          info: {
            mainProduct: item.mainProduct,
            address: item.address
          }
        }
      })
      state.mapDataset.chartData = res
    },

    setMaterialAndTeamData(state, data) {
      console.log('materialAndTeam', data)
      let { equipmentMaterialList, erRescueTeamList } = data
      let equipmentMaterialRes = []
      for (let key in equipmentMaterialList) {
        let position = key.split(',')
        equipmentMaterialRes.push({
          value: [position[1], position[0]],
          info: equipmentMaterialList[key]
        })
      }
      state.materialAndTeamDataset.equipmentMaterial.chartData = equipmentMaterialRes
      
      let erRescueTeamRes = []
      for (let key in erRescueTeamList) {
        let position = key.split(',')
        erRescueTeamRes.push({
          value: [position[1], position[0]],
          info: erRescueTeamList[key]
        })
      }
      state.materialAndTeamDataset.erRescueTeam.chartData = erRescueTeamRes

      state.mapDataset.loading = false
    }
  },

  actions: {
    async loadControlStat({ commit }) {
      const result = await request.get('/api/v2/homePage/statisticSriskControl')
      commit('setControlStat', result)
    },

    async loadRiskDoughnutData({ commit }) {
      commit('setRiskDoughnutLoading')
      const result = await request.get('/api/v2/homePage/riskStatistics')
      commit('setRiskDoughnutData', result)
    },

    async loadRiskBarData({ commit }) {
      commit('setRiskBarLoading')
      const result = await request.get('/api/v2/homePage/riskStatisticsType')
      commit('setRiskBarData', result)
    },

    async loadRiskLineData({ commit }) {
      commit('setRiskLineLoading')
      const result = await request.get('/api/v2/homePage/riskTendency/30')
      commit('setRiskLineData', result)
    },

    async loadMapData({ commit }) {
      commit('setMapLoading')
      const result = await request.get('/api/v2/homePage/mapCompany')
      commit('setMapData', result)
    },

    async loadMaterialAndTeamData({ commit }) {
      commit('setMapLoading')
      const result = await request.get('/api/v2/homePage/materialAndTeam')
      commit('setMaterialAndTeamData', result)
    },

    async clearAllMapData({ commit }) {
      commit('setMapLoading')
      commit('setMaterialAndTeamData', [])
    },

    async getTodayControled({ commit }) {
       await request.get('/getNum')
    }
  }
}
