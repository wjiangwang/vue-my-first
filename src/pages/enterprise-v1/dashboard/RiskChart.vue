<template>
  <div class="risk-chart">
    <div class="name">{{name}}</div>

    <el-row class="charts-container">
      <el-col :span="12">
        <el-row class="chart-wrapper">
          <el-col :span="12">
            <div class="chart-title">风险统计</div>

            <ve-ring :data="riskChart"
              :legend-visible="false"
              height="100%"
              :colors="['#F7454A', '#FDB45C', '#FFE031', '#2BB0F8', '#C8CBD5']"
              :settings="chartSettings"
              :extend="chartExtend"
              ref="chart1">
            </ve-ring>
          </el-col>
          <el-col :span="12" class="legend-column">
            <div class="legend">
              <ul class="items">
                <li v-for="(item, index) in riskLegendItems" :key="index">
                  <span class="icon" :style="{ 'background': item.color }"></span>
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
            <div class="chart-title">隐患统计</div>

            <ve-ring :data="hiddenDangerChart"
              :legend-visible="false"
              height="100%"
              :colors="['#F7454A', '#FDB45C', '#C8CBD5']"
              :settings="chartSettings"
              :extend="chartExtend"
              ref="chart2">
            </ve-ring>
          </el-col>
          <el-col :span="12" class="legend-column">
            <div class="legend">
              <ul class="items">
                <li v-for="(item, index) in hiddenDangerLegendItems" :key="index">
                  <span class="icon triangle" :style="{ 'border-bottom-color': item.color }"></span>
                  <span class="value">{{item.value}}</span>
                  <span class="percent">({{item.percent}}%)</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div class="progress">
      <div class="title">
        <div class="left">管控进度</div>
        <div class="right">{{progress}}%</div>
      </div>
      <div class="progress-bar">
        <el-progress :show-text="false"
          :stroke-width="10"
          :percentage="progress"
          color="#30C9C8">
        </el-progress>
      </div>
    </div>

    <resize-observer @notify="resizeCharts" />
  </div>
</template>

<script>
import VeRing from 'v-charts/lib/ring.common'

const riskColors = ['#F7454A', '#FDB45C', '#FFE031', '#2BB0F8', '#C8CBD5']
const hiddenDangerColors = ['#F7454A', '#FDB45C', '#C8CBD5']

export default {
  name: 'RiskChart',

  components: {
    VeRing
  },

  props: {
    name: String,

    progress: {
      type: Number,
      default: 0
    },

    shutdown: {
      type: Boolean,
      default: false
    },

    riskData: {
      type: Object,
      default: {}
    },

    hiddenDangerData: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      chartSettings: {
        label: { show: false },
        labelLine: { show: false },
        radius: ['40%', '70%']
      },

      chartExtend: {
        series: {
          center: ['50%', '50%']
        }
      }
    }
  },

  computed: {
    riskChart() {
      return {
        columns: ['level', 'count'],
        rows: [
          { level: '重大', count: this.riskData.oneRisk },
          { level: '较大', count: this.riskData.twoRisk },
          { level: '一般', count: this.riskData.threeRisk },
          { level: '低', count: this.riskData.fourRisk },
          { level: '待确定', count: this.riskData.toBeDetermined }
        ]
      }
    },

    hiddenDangerChart() {
      return {
        columns: ['level', 'count'],
        rows: [
          { level: '重大', count: this.hiddenDangerData.majorHazard },
          { level: '一般', count: this.hiddenDangerData.generalHazard },
          { level: '待确定', count: this.hiddenDangerData.toBeDetermined }
        ]
      }
    },

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
    }
  },

  methods: {
    resizeCharts() {
      [1, 2].forEach(num => {
        this.$refs[`chart${num}`].echarts.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.risk-chart {
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.17);
  border-radius: 3px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;

  .name {
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    line-height: 21px;
    margin-bottom: 15px;
    color: #4c4c4c;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .charts-container {
    flex: 1;

    .el-col {
      height: 100%;
    }

    .chart-wrapper {
      width: 100%;
      height: 100%;

      .chart-title {
        position: absolute;
        color: #4c4c4c;
        font-size: 12px;
        font-weight: 600;
        line-height: 17px;
        text-align: center;
        top: -10px;
        right: 0;
        left: 0;
      }

      .el-col {
        position: relative;
      }

      .legend-column {
        display: flex;
        align-items: center;
      }

      .legend {
        flex: 1;

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
              margin-bottom: 4px;
            }
          }

          .label {
            width: 20%;
          }

          .value, .percent {
            width: 16%;
            margin-right: 5px;
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
    }
  }

  .progress {
    margin-top: -10px;
    .title {
      font-size: 12px;
      font-weight: 600;
      color: #4c4c4c;
      line-height: 17px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
  }
}

.screen-drop {
  &.dark-mode .risk-chart {
    .name, .chart-title,
    .legend .items,
    .progress .title {
      color: #eee;
    }

    background: #272B34;
  }

  .risk-chart {
    .name {
      font-size: 1.4375em;
      line-height: 2;
    }

    .charts-container .chart-wrapper {
      .chart-title {
        font-size: 1em;
        line-height: 1.385;
      }

      .legend .items {
        font-size: 1em;
        line-height: 1.385;
      }
    }

    .progress .title {
      font-size: 0.875em;
      line-height: 1.385;
    }
  }
}
</style>
