<!-- <template>
  <div class="">
    <management-dashboard></management-dashboard>
  </div>
</template>

<script>
  import ManagementDashboard from '@/pages/management/DashboardBat'

  export default {
    name: 'GroupDashboard',

    components: {
      ManagementDashboard
    }
  }
</script> -->

<!-- 临时调用 -->
<template>
  <div class="page dashboard">
    <div class="enterprise-count">累计企业总数：{{riskDoughnutDataset.total}}</div>

    <div class="page-main">
      <div class="top">
        <el-card shadow="never" class="level-charts">
          <div
            :class="['chart-wrapper', `level-${item.level}` ]"
            v-for="item in riskDoughnutDataset.items"
            :key="item.level"
          >
            <div class="chart">
              <ve-ring
                :data="item.chartData"
                :legend-visible="false"
                :loading="riskDoughnutDataset.loading"
                :colors="doughnutChartColors(item.level)"
                :settings="doughnutChartSettings"
                :tooltip="doughnutChartTooltip"
                :events="doughnutChartEvents"
                width="180px"
                ref="doughnutChart"
              ></ve-ring>
            </div>
            <div class="legend">
              <div class="label">{{item.label}}</div>
              <div class="value">
                数量：
                <span class="count">{{item.count}}家</span>
              </div>
            </div>
          </div>
        </el-card>

        <div class="today">
          <div
            class="item controlled"
            @click="dashboardEnterprises.show({ title: '今日已管控企业', type: 'control', params: { status: 1 } })"
          >
            <div class="value">{{controlStat.hasControl}}</div>
            <div class="label">今日已管控</div>
          </div>

          <div
            class="item not-controlled"
            @click="dashboardEnterprises.show({ title: '今日未管控企业', type: 'control', params: { status: 0 } })"
          >
            <div class="value">{{controlStat.notControl}}</div>
            <div class="label">今日未管控</div>
          </div>
        </div>
      </div>

      <div class="bottom">
        <el-card shadow="never" class="chart-card">
          <div class="card-header" slot="header">
            <div class="left">企业数量分类统计</div>
          </div>

          <ve-histogram
            :data="riskBarDataset.chartData"
            :loading="riskBarDataset.loading"
            :settings="riskBarDataset.chartSettings"
            :colors="['#4580FF', '#F4D341', '#F49E41', '#FA5878']"
            :extend="{ legend: { bottom: true }, grid: { top: 20 }, cursor: 'default' }"
            height="320px"
          ></ve-histogram>
        </el-card>
        <el-card shadow="never" class="chart-card">
          <div class="card-header" slot="header">
            <div class="left">风险隐患趋势图</div>
            <div class="right">
              <div class="legend">
                <span class="color"></span>
                风险数量
              </div>

              <div class="legend">
                <span class="color"></span>
                隐患数量
              </div>
            </div>
          </div>

          <!-- <ve-line
            :data="riskLineDataset.chartData"
            :loading="riskLineDataset.loading"
            :colors="['#FC649D', '#7777FF']"
            :legend-visible="false"
            :extend="{ grid: { top: 20, bottom: 10 } }"
            :settings="lineChartSettings"
            :after-config="afterLineChartConfig"
            :events="lineChartEvents"
            height="320px"
          ></ve-line>-->
          <ve-line
            :data="riskLineDataset.chartData"
            :settings="lineChartSettings"
            :colors="['#FFBABA', '#4AB0F9']"
            :extend="{ grid: { top: 20, bottom: 10 } }"
            height="320px"
            :events="lineChartEvents"
            :legend-visible="false"
            :loading="riskLineDataset.loading"
          ></ve-line>
        </el-card>
      </div>
    </div>

    <dashboard-enterprises ref="dashboardEnterprises"></dashboard-enterprises>
  </div>
</template>

<script>
import 'v-charts/lib/style.css'
import { mapState, mapActions } from 'vuex'
import dayjs from 'dayjs'
import VeRing from 'v-charts/lib/ring.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VeLine from 'v-charts/lib/line.common'
import DashboardEnterprises from '@/pages/management/DashboardEnterprises'

export default {
  name: 'GroupDashboard',

  components: {
    VeRing,
    VeHistogram,
    VeLine,
    DashboardEnterprises
  },

  computed: {
    ...mapState('dashboard', [
      'controlStat', 'riskDoughnutDataset', 'riskBarDataset', 'riskLineDataset'
    ]),

    dashboardEnterprises () {
      return this.$refs.dashboardEnterprises
    },

    doughnutChartSettings () {
      return {
        label: { show: false },
        labelLine: { show: false },
        radius: ['30%', '50%'],
        offsetY: 60,
        hoverAnimation: false
      }
    },

    doughnutChartTooltip () {
      return {
        position: 'right',
        formatter: (params, ticket, callback) => {
          const { level, label, value } = JSON.parse(params.data.name)

          const marker = `<span style="background: ${this.doughnutChartColors(level)[0]};width: 16px;height: 16px; display: inline-block; margin-right: 10px;"></span>`

          return `
            <div style="display: flex; align-items: center;">${marker}${label}</div>
            <div style="display: flex; justify-content: space-between;">
              <span>${value}家</span>
              <span>占比${(value / this.riskDoughnutDataset.total).toFixed(2) * 100}%</span>
            </div>
          `
        }
      }
    },

    doughnutChartEvents () {
      return {
        click: (event) => {
          const { level, label } = JSON.parse(event.data.name)

          this.dashboardEnterprises.show({
            title: `${label}明细`,
            type: 'riskLevel',
            params: { riskLevel: level }
          })
        }
      }
    },

    // lineChartSettings () {
    //   return {
    //     lineStyle: { width: 3 }
    //   }
    // },

    lineChartEvents () {
      return {
        click: (event) => {
          const date = `${dayjs().year()}-${event.data[0]}`
          this.dashboardEnterprises.show({
            title: '风险隐患趋势明细',
            type: 'trend',
            params: { date }
          })
        }
      }
    }
  },

  data () {
    return {
      lineChartSettings: {
        labelMap: {
          risk: '风险点数量',
          hiddenDanger: '隐患点数量'
        },
        area: true
      }
    }
  },

  methods: {
    ...mapActions('dashboard', [
      'loadControlStat', 'loadRiskDoughnutData', 'loadRiskBarData', 'loadRiskLineData'
    ]),

    doughnutChartColors (level) {
      switch (level) {
        case 1:
          return ['#FA5878', '#DFDFDF']
        case 2:
          return ['#F49E41', '#DFDFDF']
        case 3:
          return ['#F4D341', '#DFDFDF']
        case 4:
          return ['#4580FF', '#DFDFDF']
      }
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
  },

  created () {
    this.loadControlStat()
    this.loadRiskDoughnutData()
    this.loadRiskBarData()
    this.loadRiskLineData()
  }
}
</script>

<style lang="scss" scoped>
.dashboard.page {
  height: auto !important;
}

.enterprise-count {
  padding: 20px;
  color: #919090;
  font-size: 14px;
  line-height: 19px;
}

.top {
  display: flex;
  padding: 0 20px 20px;

  .level-charts {
    flex: 1;
    /deep/ .el-card__body {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      padding-bottom: 8px;
    }

    .chart-wrapper {
      width: 50%;
      color: #333;
      position: relative;

      .chart {
        height: 120px;
        overflow-y: hidden;
      }

      .legend {
        position: absolute;
        top: 34px;
        left: 160px;

        .label {
          font-size: 16px;
          line-height: 22px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .value {
          font-size: 13px;
          line-height: 17px;
        }
      }
    }
  }

  .today {
    width: 360px;
    margin-left: 20px;

    .item {
      height: 118px;
      text-align: center;
      color: #fff;
      padding-top: 27px;
      box-sizing: border-box;
      cursor: pointer;

      .value {
        font-size: 30px;
        line-height: 41px;
      }

      .label {
        font-size: 14px;
        line-height: 20px;
      }
    }

    .controlled {
      margin-bottom: 20px;
      background: url("../../assets/images/controlled-bg.png") no-repeat;
      background-size: 100% 100%;
    }

    .not-controlled {
      background: url("../../assets/images/not-controlled-bg.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}

.bottom {
  display: flex;
  padding: 0 20px 20px;

  .chart-card {
    width: 50%;
    &:first-child {
      margin-right: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        font-weight: 500;
        color: #080808;
      }

      .right {
        .legend {
          display: inline-flex;
          align-items: center;
          font-size: 13px;
          color: #666666;
          &:first-child {
            margin-right: 26px;
          }

          .color {
            width: 36px;
            height: 3px;
            margin-right: 4px;
          }

          &:first-child .color {
            background: #FFBABA;
          }

          &:last-child .color {
            background: #4AB0F9;
          }
        }
      }
    }
  }
}
</style>
