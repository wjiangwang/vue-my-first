<template>
  <div class="dashboard-carousel-item-content progress-statistics">
    <el-row>
      <el-col :span="12">
        <el-row class="chart-wrapper">
          <el-col :span="12">
            <ve-ring :data="riskChart"
              :legend-visible="false"
              height="100%"
              :colors="['#F7454A', '#FDB45C', '#FFE031', '#2BB0F8', '#C8CBD5']"
              :settings="ringChartSettings"
              :extend="ringChartExtend"
              ref="chart1">
            </ve-ring>
          </el-col>
          <el-col :span="12" class="legend-column">
            <div class="legend">
              <div class="title">安全风险统计</div>
              <ul class="items">
                <li v-for="(item, index) in riskLegendItems" :key="index">
                  <span class="icon" :style="{ 'background': item.color }"></span>
                  <span class="label">{{item.label}}</span>
                  <span class="value">{{item.value}}</span>
                  <span class="percent">({{item.percent}}%)</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="chart-wrapper">
          <el-col :span="12">
            <ve-ring :data="hiddenDangerChart"
              :legend-visible="false"
              height="100%"
              :colors="['#F7454A', '#FDB45C', '#C8CBD5']"
              :settings="ringChartSettings"
              :extend="ringChartExtend"
              ref="chart2">
            </ve-ring>
          </el-col>
          <el-col :span="12" class="legend-column">
            <div class="legend">
              <div class="title">安全隐患统计</div>
              <ul class="items">
                <li v-for="(item, index) in hiddenDangerLegendItems" :key="index">
                  <span class="icon triangle" :style="{ 'border-bottom-color': item.color }"></span>
                  <span class="label">{{item.label}}</span>
                  <span class="value">{{item.value}}</span>
                  <span class="percent">({{item.percent}}%)</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row class="chart-wrapper gauge-chart-wrapper">
          <el-col :span="12">
            <ve-gauge :data="controlProgressChart"
              height="100%"
              :settings="controlProgressChartSettings"
              ref="chart3">
            </ve-gauge>
          </el-col>
          <el-col :span="12" class="legend-column">
            <div class="legend">
              <div class="title">实时管控进度</div>
              <ul class="items">
                <li v-for="(item, index) in controlProgressLegendItems" :key="index">
                  <span class="icon" :style="{ 'background': item.color }"></span>
                  <span class="label">{{item.label}}</span>
                  <span class="value">{{item.value}}</span>
                  <span class="percent">({{item.percent}}%)</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="chart-wrapper gauge-chart-wrapper">
          <el-col :span="12">
            <ve-gauge :data="personalProgressChart"
              height="100%"
              :settings="personalProgressChartSettings"
              ref="chart4">
            </ve-gauge>
          </el-col>
          <el-col :span="12" class="legend-column">
            <div class="legend">
              <div class="title">个人承诺进度</div>
              <ul class="items">
                <li v-for="(item, index) in personalProgressLegendItems" :key="index">
                  <span class="icon" :style="{ 'background': item.color }"></span>
                  <span class="label">{{item.label}}</span>
                  <span class="value">{{item.value}}</span>
                  <span class="percent">({{item.percent}}%)</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <resize-observer @notify="resizeCharts" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VeRing from 'v-charts/lib/ring.common'
import VeGauge from 'v-charts/lib/gauge.common'

const riskColors = ['#F7454A', '#FDB45C', '#FFE031', '#2BB0F8', '#C8CBD5']
const hiddenDangerColors = ['#F7454A', '#FDB45C', '#C8CBD5']

export default {
  name: 'ProgressStatistics',

  components: {
    VeRing,
    VeGauge
  },

  data() {
    return {
      ringChartSettings: {
        label: { show: false },
        labelLine: { show: false },
        radius: ['40%', '70%']
      },

      ringChartExtend: {
        series: {
          center: ['50%', '50%']
        }
      }
    }
  },

  computed: {
    ...mapState('dashboardProgressStatistics', [
      'loading', 'riskChart', 'hiddenDangerChart', 'controlProgress', 'personalProgress'
    ]),

    riskLegendItems() {
      const count = this.riskChart.rows.reduce((result, row) => {
        result += row.count
        return result
      }, 0)

      return this.riskChart.rows.map((row, index) => {
        const percent = count > 0 ? ((row.count / count) * 100).toFixed(0) : 0

        return {
          label: row.level,
          value: row.count,
          color: riskColors[index],
          percent
        }
      })
    },

    hiddenDangerLegendItems() {
      const count = this.hiddenDangerChart.rows.reduce((result, row) => {
        result += row.count
        return result
      }, 0)

      return this.hiddenDangerChart.rows.map((row, index) => {
        const percent = count > 0 ? ((row.count / count) * 100).toFixed(0) : 0

        return {
          label: row.level,
          value: row.count,
          color: hiddenDangerColors[index],
          percent
        }
      })
    },

    controlProgressChart() {
      const { finished, unfinished } = this.controlProgress
      const count = finished + unfinished

      return {
        columns: ['type', 'value'],
        rows: [
          { type: '已完成', value: count > 0 ? finished / (finished + unfinished) : 0  }
        ]
      }
    },

    personalProgressChart() {
      return {
        columns: ['type', 'value'],
        rows: [
          { type: '已完成', value: this.personalProgress.finished }
        ]
      }
    },

    controlProgressChartSettings() {
      return {
        dataType: { '已完成': 'percent' },
        seriesMap: {
          '已完成': {
            min: 0,
            max: 1,
            startAngle: 180,
            endAngle: 0,
            radius: '80%',
            center: ['50%', '60%'],
            splitNumber: 2,
            splitLine: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: [[0, '#29BEBD'],[1, '#C8CBD5']]
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        }
      }
    },

    personalProgressChartSettings() {
      const { finished, unfinished } = this.personalProgress
      const finishedPercent = finished / (finished + unfinished)

      return {
        seriesMap: {
          '已完成': {
            min: 0,
            max: finished + unfinished,
            startAngle: 180,
            endAngle: 0,
            radius: '80%',
            center: ['50%', '60%'],
            splitNumber: 2,
            splitLine: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: [[finishedPercent, '#29BEBD'],[1, '#C8CBD5']]
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        }
      }
    },

    controlProgressLegendItems() {
      const { finished, unfinished } = this.controlProgress
      const count = finished + unfinished

      return [
        {
          label: '已完成',
          value: finished,
          percent: count > 0 ? ((finished / count) * 100).toFixed(0) : 0,
          color: '#29BEBD'
        },
        {
          label: '未完成',
          value: unfinished,
          percent: count > 0 ? ((unfinished / count) * 100).toFixed(0) : 0,
          color: '#C8CBD5'
        }
      ]
    },

    personalProgressLegendItems() {
      const { finished, unfinished } = this.personalProgress
      const count = finished + unfinished

      return [
        {
          label: '已完成',
          value: finished,
          percent: count > 0 ? ((finished / count) * 100).toFixed(0) : 0,
          color: '#29BEBD'
        },
        {
          label: '未完成',
          value: unfinished,
          percent: count > 0 ? ((unfinished / count) * 100).toFixed(0) : 0,
          color: '#C8CBD5'
        }
      ]
    }
  },

  methods: {
    ...mapActions('dashboardProgressStatistics', ['loadData']),

    resizeCharts() {
      [1, 2, 3, 4].forEach(num => {
        this.$refs[`chart${num}`].echarts.resize()
      })
    }
  },

  created() {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.progress-statistics {
  margin-top: 30px !important;
  display: flex;
  flex-direction: column;

  > .el-row {
    flex: 1;
    overflow: hidden;

    .el-col {
      height: 100%;
    }
  }

  .chart-wrapper {
    width: 100%;
    height: 100%;

    .legend-column {
      display: flex;
      align-items: center;
    }

    .legend {
      flex: 1;
      .title {
        color: #4C4C4C;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .items {
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 12px;
        color: #333;

        li {
          display: flex;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 8px;
          }
        }

        .label {
          width: 20%;
        }

        .value, .percent {
          width: 16%;
        }

        .icon {
          content: '';
          width: 8px;
          height: 8px;
          display: inline-block;
          margin-right: 8px;

          &.triangle {
            width: 0;
            height: 0;
            border: 6px solid transparent;
            border-bottom-width: 8px;
            margin-top: -6px;
          }
        }
      }
    }

    &.gauge-chart-wrapper .legend {
      .items .icon {
        border-radius: 50%;
      }
    }
  }
}

.screen-drop {
  &.dark-mode {
    .progress-statistics .chart-wrapper .legend {
      .title, .items {
        color: #eee;
      }
    }
  }

  .progress-statistics .chart-wrapper .legend {
    .title {
      font-size: 1.3125em;
    }

    .items {
      font-size: 1.125em;
    }
  }
}
</style>
