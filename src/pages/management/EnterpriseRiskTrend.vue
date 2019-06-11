<template>
  <el-dialog
    :visible.sync="visible"
    title="企业风险隐患趋势图"
    width="600px"
    :modal="true"
    :append-to-body="true"
  >
    <div class="title" v-if="enterprise && enterprise.id">
      <el-button
        type="text"
        size="medium"
        @click="$router.push({ name: 'emap-risk-planar-graph', params: { enterpriseId: enterprise.id } })"
      >{{enterprise.name}}</el-button>
    </div>

    <div class="chart">
      <!-- <ve-line
        :data="chartData"
        :loading="loading"
        :colors="['#FC649D', '#7777FF']"
        :legend-visible="false"
        :extend="{ grid: { top: 20, bottom: 10 } }"
        :settings="lineChartSettings"
        :after-config="afterLineChartConfig"
        height="320px"
      ></ve-line>-->
      <ve-line
        :data="chartData"
        :settings="lineChartSettings"
        :colors="['#FFBABA', '#4AB0F9']"
        :extend="{ grid: { top: 20, bottom: 10 } }"
        height="320px"
        :legend-visible="false"
        :loading="loading"
      ></ve-line>
    </div>
  </el-dialog>
</template>

<script>
import 'v-charts/lib/style.css'
import VeLine from 'v-charts/lib/line.common'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'EnterpriseRiskTrend',

  components: {
    VeLine
  },

  data () {
    return {
      visible: false,
      lineChartSettings: {
        labelMap: {
          risk: '风险点数量',
          hiddenDanger: '隐患点数量'
        },
        area: true
      }
    }
  },

  computed: {
    ...mapState('enterpriseRiskTrend', ['loading', 'enterprise', 'chartData']),

    // lineChartSettings () {
    //   return {
    //     lineStyle: { width: 3 }
    //   }
    // }

  },

  methods: {
    ...mapActions('enterpriseRiskTrend', ['loadData']),

    show (enterpriseId) {
      this.visible = true
      this.loadData(enterpriseId)
    },

    // afterLineChartConfig (options) {
    //   options.tooltip.formatter = (params) => {
    //     const result = []

    //     params.forEach((param, index) => {
    //       const seriesName = param.seriesName
    //       const [date, value] = param.data
    //       const type = value < 0 ? '降低' : '增加'

    //       if (index === 0) result.push(date)

    //       if (seriesName === 'risk') {
    //         result.push(`${param.marker} 风险${type} ${value < 0 ? -value : value}`)
    //       } else {
    //         result.push(`${param.marker} 隐患${type} ${value < 0 ? -value : value}`)
    //       }
    //     })

    //     return result.join('<br />')
    //   }

    //   return options
    // }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>

