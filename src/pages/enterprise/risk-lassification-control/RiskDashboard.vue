<template>
  <div class="page dashboard-container">
    <div class="page-main" v-loading="risk.loading">
      <scroll-view style="height:100%;width:100%">
        <div class="content-box">
          <section class="section-1">
            <div class="chart-container">
              <div class="chart-title">风险统计</div>
              <div class="chart-data-one">
                <ve-ring
                  :data="riskData"
                  :settings="riskSettings"
                  :legend-visible="true"
                  height="100%"
                  :colors="['#F7454A', '#F49E41', '#F4D341', '#37A9FA', '#DEDEDE']"
                  :extend="riskRingExtend('risk')"
                ></ve-ring>
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-title">隐患统计</div>
              <div class="chart-data-one">
                <ve-ring
                  :data="hiddenDangerData"
                  :settings="riskSettings"
                  :legend-visible="true"
                  height="100%"
                  :colors="['#F7454A', '#F49E41', '#DEDEDE']"
                  :extend="riskRingExtend('hidden')"
                ></ve-ring>
              </div>
            </div>
            <div class="chart-progress-container chart-container">
              <div class="chart-title">
                <span>当前管控进度</span>
                <span>当前承诺进度</span>
              </div>
              <div class="chart-two-container">
                <div class="chart-data-one">
                  <ve-gauge
                    :data="controlData"
                    :after-set-option="controlDataChartEvent"
                    height="100%"
                    :extend="controlProgressExtend('管控','#30C9C8')"
                  ></ve-gauge>
                </div>

                <div class="chart-data-one">
                  <ve-gauge
                    :data="promiseData"
                    :after-set-option="controlDataChartEvent"
                    height="100%"
                    :extend="controlProgressExtend('承诺','#37A9FA')"
                  ></ve-gauge>
                </div>
              </div>
            </div>
          </section>
          <section class="section-2">
            <div class="chart-container">
              <div class="chart-title">区域风险统计</div>
              <ve-histogram
                height="100%"
                :after-set-option="riskHistogramChartEvent"
                :data="riskHistogramChartData"
                :data-zoom="riskHistogramChartDataZoom"
                :settings="riskHistogramChartSettings"
                :extend="riskHistogramChartExtend"
                :colors="riskHistogramChartColors"
              ></ve-histogram>
            </div>
          </section>
          <section class="section-2">
            <div class="chart-container">
              <div class="chart-title">区域隐患统计</div>
              <ve-histogram
                height="100%"
                :after-set-option="hiddenHistogramCharEvent"
                :data="hiddenHistogramChartData"
                :data-zoom="riskHistogramChartDataZoom"
                :settings="hiddenHistogramChartSettings"
                :extend="riskHistogramChartExtend"
                :colors="hiddenHistogramChartColors"
              ></ve-histogram>
            </div>
          </section>
          <section class="section-4">
            <div class="chart-container">
              <div class="chart-title">
                <div>风险隐患趋势图</div>
                <div style="cursor:pointer">
                  <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{riskHiddenDangerDay}}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="6">最近7天</el-dropdown-item>
                      <el-dropdown-item :command="29">最近30天</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <ve-line
                :data="riskHiddenDangerData"
                :settings="riskHiddenDangerSettings"
                :colors="['#FFBABA', '#4AB0F9']"
                :extend="lineChartExtend"
                height="100%"
                :grid="riskHiddenDangerGrid"
                v-loading="riskHiddenLoading"
              ></ve-line>
            </div>
          </section>
          <section class="section-5">
            <div class="section-5-inner-container-1">
              <div class="chart-container">
                <div class="chart-title">作业风险柱状比较图</div>
                <ve-histogram
                  height="100%"
                  :data="jobRiskChartData"
                  :after-set-option="riskWorkCharEvent"
                  :data-zoom="fakeRiskHistogramChartDataZoom"
                  :settings="fakeRiskHistogramChartSettings"
                  :extend="fakeRiskHistogramChartExtend"
                  :colors="jobRiskChartColors"
                ></ve-histogram>
              </div>
            </div>
            <div class="section-5-inner-container-2">
              <el-carousel
                trigger="click"
                height="100%"
                :interval="8000"
                class="dashbord-carousel"
                v-if="specialData.length"
              >
                <el-carousel-item v-for="specials in specialData" :key="specials.id">
                  <div class="chart-container">
                    <div class="chart-title">特殊作业实时播报</div>
                    <ul class="real-time-broadcast-container">
                      <li
                        class="real-time-broadcast"
                        v-for="(item,index) in specials.rows"
                        :key="index"
                      >
                        <div class="real-time-broadcast-left">
                          <div class="progress-warp">
                            <el-progress
                              :text-inside="true"
                              :stroke-width="18"
                              :percentage="proportionDesc(item, 1)"
                              color="#F7454A"
                            ></el-progress>
                            <div class="progress-num">{{item.oneRisk}}</div>
                          </div>
                          <div class="progress-warp">
                            <el-progress
                              :text-inside="true"
                              :stroke-width="18"
                              :percentage="proportionDesc(item, 2)"
                              color="#FEA340"
                            ></el-progress>
                            <div class="progress-num">{{item.twoRisk}}</div>
                          </div>
                          <div class="progress-warp">
                            <el-progress
                              :text-inside="true"
                              :stroke-width="18"
                              :percentage="proportionDesc(item, 3)"
                              color="#F4D341"
                            ></el-progress>
                            <div class="progress-num">{{item.threeRisk}}</div>
                          </div>
                          <div class="progress-warp">
                            <el-progress
                              :text-inside="true"
                              :stroke-width="18"
                              :percentage="proportionDesc(item, 4)"
                              color="#37A9FA"
                            ></el-progress>
                            <div class="progress-num">{{item.fourRisk}}</div>
                          </div>
                        </div>
                        <div class="real-time-broadcast-right">
                          <div class="real-time-broadcast-title">{{item.name}}</div>
                          <div class="real-time-broadcast-job">岗位：{{item.structureName}}</div>
                          <div class="real-time-broadcast-position">地点：{{item.jobSite}}</div>
                          <div class="real-time-broadcast-people">申请人：{{item.nickname}}</div>
                          <div class="real-time-broadcast-time">申请时间：{{timeDesc(item.createDate)}}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </el-carousel-item>
              </el-carousel>
              <div class="no-data" v-else>
                <img src="@/assets/icons/triangle-info.png">
                <div class="content">
                  <div class="title">今日未进行实时作业</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import VeGauge from 'v-charts/lib/gauge.common'
import VeRing from 'v-charts/lib/ring.common'
import ScrollView from '@/components/ScrollView'
import VeHistogram from 'v-charts/lib/histogram.common'
// import Vebar from 'v-charts/lib/bar.common'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'
import dayjs from 'dayjs'


export default {
  name: 'RiskDashboard',

  components: {
    VeLine,
    VePie,
    VeRing,
    VeGauge,
    VeHistogram,
    // Vebar,
    ScrollView
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    },

    breadcrumbs: {
      type: Array,
      default () { return [] }
    }
  },

  data () {
    return {
      riskHiddenLoading: false,
      readonly: true,
      riskHiddenDangerDay: '最近7天',
      risk: {
        loading: false
      },
      lineChartExtend: {
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: { type: 'dotted' }
          }
        },
        legend: {
          show: true,
          top: 0,
          right: 40
        },
        series: [{
        }],

      },
      riskHiddenDangerSettings: {
        labelMap: {
          riskCount: '风险点数量',
          hiddenCount: '隐患点数量'
        },
        area: true
      },
      riskHiddenDangerGrid: {
        top: 40,
        right: 25,
        bottom: 20
      },
      riskSettings: {
        label: { show: false },
        labelLine: { show: false },
      },
      statisticTatol: {
        accidentTotal: '',
        hiddenTotal: '',
        majorHazardTotal: '',
        riskTotal: ''
      },
      fakeRiskHistogramChartExtend: {
        legend: {
          right: 20,
          itemWidth: 15,
          itemHight: 15,
          itemGap: 17,
        },
        grid: {
          left: 5,
          bottom: 20,
          top: 40
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0E0E0E',
              width: 1
            }
          },
          axisLabel: { show: true, showMinLabel: true, interval: 0 },
          type: 'category',
          axisTick: { show: false },
          data: [],
          max: 'dataMax'
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0E0E0E',
              width: 1
            }
          }
        }
      },
      riskHistogramChartExtend: {
        legend: {
          right: 20,
          itemWidth: 15,
          itemHight: 15,
          itemGap: 17,
        },
        grid: {
          bottom: 40,
          top: 40
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#0E0E0E',
              width: 1
            }
          },
          splitLine: { show: true, interval: 0 },
          axisLabel: { show: true, showMinLabel: true, interval: 0 },
          type: 'category',
          axisTick: { show: false },
          data: [],
          max: 'dataMax'
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0E0E0E',
              width: 1
            }
          }
        },
      },
      riskHistogramChartColors: ['#F7454A', '#F49E41', '#F4D341', '#37A9FA', '#DEDEDE'],
      jobRiskChartColors: ['#F7454A', '#F49E41', '#F4D341', '#37A9FA'],
      hiddenHistogramChartColors: ['#F7454A', '#F4D341', '#DEDEDE']
    }
  },

  computed: {
    ...mapState('riskDashboard', ['total', 'riskData', 'hiddenDangerData', 'controlData', 'promiseData', 'riskHiddenchartXAxisData', 'riskHistogramChartData', 'riskHistogramTotalNum', 'hiddenHistogramChartData', 'hiddenHistogramTotalNum', 'riskHiddenDangerData', 'jobRiskChartData', 'jobRiskTotalNum', 'jobRiskXAxisData', 'specialData']),

    fakeRiskHistogramChartSettings () {
      return {
        stack: { '风险点总数': ['oneRisk', 'twoRisk', 'threeRisk', 'fourRisk'] },
        labelMap: {
          'riskName': '风险点名称',
          'oneRisk': '重大风险',
          'twoRisk': '较大风险',
          'threeRisk': '一般风险',
          'fourRisk': '低风险'
        },
        legendName: {
          '重大风险': `重大风险（总计${this.jobRiskTotalNum.oneRiskNum}）`,
          '较大风险': `较大风险（总计${this.jobRiskTotalNum.twoRiskNum}）`,
          '一般风险': `一般风险（总计${this.jobRiskTotalNum.threeRiskNum}）`,
          '低风险': `低风险（总计${this.jobRiskTotalNum.fourRiskNum}）`,
        }
      }
    },

    riskHistogramChartSettings () {
      return {
        labelMap: {
          'riskName': '风险点名称',
          'oneRisk': '重大风险',
          'twoRisk': '较大风险',
          'threeRisk': '一般风险',
          'fourRisk': '低风险',
          'toBeDetermined': '未分级'
        },
        legendName: {
          '重大风险': `重大风险（总计${this.riskHistogramTotalNum.oneRiskNum}）`,
          '较大风险': `较大风险（总计${this.riskHistogramTotalNum.twoRiskNum}）`,
          '一般风险': `一般风险（总计${this.riskHistogramTotalNum.threeRiskNum}）`,
          '低风险': `低风险（总计${this.riskHistogramTotalNum.fourRiskNum}）`,
          '未分级': `未分级（总计${this.riskHistogramTotalNum.toBeDeterminedNum}）`
        }
      }
    },

    hiddenHistogramChartSettings () {
      return {
        labelMap: {
          'riskName': '风险点名称',
          'majorHidden': '重大隐患',
          'generalHidden': '一般隐患',
          'toBeDetermined': '待确定隐患',

        },
        legendName: {
          '重大隐患': `重大隐患（总计${this.hiddenHistogramTotalNum.majorHiddenNum}）`,
          '一般隐患': `一般隐患（总计${this.hiddenHistogramTotalNum.generalHiddenNum}）`,
          '待确定隐患': `待确定隐患（总计${this.hiddenHistogramTotalNum.toBeDeterminedNum}）`,
        }
      }
    },

    riskHistogramChartDataZoom () {
      let end = this.riskHistogramChartData.rows.length && this.riskHistogramChartData.rows.length > 8 ? 50 : 100
      return [
        {
          height: 20,
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end
        }
      ]
    },

    fakeRiskHistogramChartDataZoom () {
      let end = this.jobRiskChartData.rows.length && this.jobRiskChartData.rows.length > 8 ? 60 : 100
      return [
        {
          width: 20,
          type: 'inside',
          show: true,
          yAxisIndex: [0],
          start: 0,
          end
        }
      ]
    }
  },

  mounted () {

  },

  methods: {
    ...mapActions('riskDashboard', ['getRiskStatisticalData', 'getHiddenStatisticalData', 'getProgressData', 'getRiskHiddenTotal', 'getRiskHiddenTrend', 'getJobRisk', 'getSpecialJobBroadcast']),

    async getRiskHiddenDanger (day = 6) {
      this.riskHiddenLoading = true
      await this.getRiskHiddenTrend(day)
      this.riskHiddenLoading = false
    },

    handleCommand (command) {
      this.riskHiddenDangerDay = command === 29 ? '最近30天' : '最近7天'
      this.getRiskHiddenDanger(command)
    },

    controlProgressExtend (name, color) {
      let floatNum
      switch (name) {
        case '管控':
          floatNum = this.controlData.rows[0] ? this.controlData.rows[0].num / 100 : 0
          break
        case '承诺':
          floatNum = this.promiseData.rows[0] ? this.promiseData.rows[0].num / 100 : 0
          break
        default:
          floatNum = 0
      }
      let rich = {
        name: {
          color: "rgba(0,0,0,0.85)",
          fontSize: 20,
          padding: [12, 4],
          align: 'center',
          fontWeight: '550'
        },
        num: {
          color: color,
          align: 'center',
          fontSize: 25,
          padding: [5, 0]
        },
      }
      return {
        tooltip: {
          show: false
        },
        series: {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          splitNumber: 4,
          splitLine: { show: true },
          axisLine: {
            show: true,
            lineStyle: {
              color: [[floatNum, color], [1, '#C8CBD5']]
            }
          },
          detail: {
            formatter: function (v) {
              return '{num|' + v + '%' + '}\n{name|' + name + '进度}';
            },
            rich: rich,
            offsetCenter: [0, '85%'],
          }
        }
      }
    },

    //chart-1
    riskRingExtend (v) {
      let text = v === 'risk' ? `风险总数\n${this.total.riskNum}` : `隐患总数\n${this.total.hiddenNum}`
      return {
        legend: {
          top: '83%',
          itemWidth: 15,
          itemHeight: 15,
        },
        title: {
          text: text,
          top: '35%',
          left: 'center',
        },
        series: {
          radius: ['50%', '70%'],
          center: ['50%', '40%']
        }
      }
    },
    //点击图表事件
    riskHistogramChartEvent (Echart) {
      Echart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (Echart.containPixel('grid', pointInPixel)) {
          // let xIndex = Echart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX,
          // params.offsetY])[0];
          // console.log(xIndex)
          this.$router.push({
            name: 'risk-assessments-area-risk',
          })
        }
      })
    },

    controlDataChartEvent (Echart) {
      Echart.getZr().on('click', params => {
        this.$router.push({
          name: 'risk-promise-progress',
        })
      })
    },

    hiddenHistogramCharEvent (Echart) {
      Echart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (Echart.containPixel('grid', pointInPixel)) {
          this.$router.push({
            name: 'hidden-danger-list',
          })
        }
      })
    },

    riskWorkCharEvent (Echart) {
      Echart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (Echart.containPixel('grid', pointInPixel)) {
          this.$router.push({
            name: 'real-time-risk-assessment',
          })
        }
      })
    },

    proportionDesc (item, index) {
      console.log(item)
      const total = item.oneRisk + item.twoRisk + item.threeRisk + item.fourRisk
      switch (index) {
        case 1:
          return total ? parseFloat(((item.oneRisk / total) * 100).toFixed(2)) : 0
        case 2:
          return total ? parseFloat(((item.twoRisk / total) * 100).toFixed(2)) : 0
        case 3:
          return total ? parseFloat(((item.threeRisk / total) * 100).toFixed(2)) : 0
        case 4:
          return total ? parseFloat(((item.fourRisk / total) * 100).toFixed(2)) : 0
        default:
          return 0
      }
    },

    timeDesc (t) {
      return t ? dayjs(t).format('YYYY-MM-DD') : ''
    }
  },

  async created () {
    this.getRiskHiddenDanger()
    await this.getRiskStatisticalData()
    await this.getHiddenStatisticalData()
    await this.getProgressData()
    await this.getRiskHiddenTotal()
    await this.getJobRisk()
    await this.getSpecialJobBroadcast()
  },
  watch: {
    riskHiddenchartXAxisData (v) {
      this.riskHistogramChartExtend.xAxis.data = v
    },

    jobRiskXAxisData (v) {
      this.fakeRiskHistogramChartExtend.yAxis.data = v
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  box-sizing: border-box;

  .page-main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;

    .content-box {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      padding: 15px 15px 0 15px;
      height: 100%;

      .section-1 {
        width: 100%;
        height: 324px;
        margin-bottom: 10px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        .chart-container {
          width: 30%;
          height: 100%;
          // margin-right: 20px;
          background-color: white;
          .chart-title {
            padding: 15px 20px;
            font-size: 15px;
            line-height: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
          }
          .chart-data-one {
            height: 85%;
          }
        }
        .chart-progress-container {
          width: 40%;
          .chart-title {
            span:nth-child(1) {
              display: inline-block;
              width: 50%;
            }
          }
          .chart-two-container {
            display: flex;
            height: 100%;
          }
          .chart-data-one {
            height: 85%;
            width: 50%;
          }
        }
      }
      .section-2 {
        width: 100%;
        height: 324px;
        margin-bottom: 10px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        .chart-container {
          width: 100%;
          height: 90%;
          background-color: white;
          .chart-title {
            padding: 15px 20px;
            font-size: 15px;
            line-height: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }
      .section-4 {
        width: 100%;
        height: 324px;
        margin-bottom: 10px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        .chart-container {
          width: 100%;
          height: 90%;
          background-color: white;
          .chart-title {
            :nth-child(1) {
              margin-right: 10px;
            }
            display: flex;
            padding: 15px 20px;
            font-size: 15px;
            line-height: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }
      .section-5 {
        width: 100%;
        height: 400px;
        margin-bottom: 20px;
        display: flex;
        .section-5-inner-container-1 {
          height: 100%;
          background: rgba(255, 255, 255, 1);
          width: 50%;
          margin-right: 5px;
        }
        .section-5-inner-container-2 {
          .dashbord-carousel {
            height: 100%;
            /deep/ .el-carousel__button {
              background: #4e0606;
            }
          }
          .no-data {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: rgba(76, 76, 76, 1);
            font-size: 30px;
            margin-top: -30px;

            img {
              width: 126px;
              margin-right: 40px;
            }

            .content {
              background: linear-gradient(
                180deg,
                rgba(255, 0, 0, 1) 0%,
                rgba(235, 95, 95, 1) 100%
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
          background: rgba(255, 255, 255, 1);
          height: 100%;
          width: 50%;
          margin-left: 5px;
          ul,
          li {
            padding: 0;
            margin: 0;
            list-style: none;
          }
          .real-time-broadcast-container {
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 1%;
            box-sizing: border-box;
            .real-time-broadcast {
              display: flex;
              width: 49%;
              padding: 10px 5px;
              height: 45%;
              border: 2px solid #eee;
              border-radius: 4px;
              box-sizing: border-box;
              .real-time-broadcast-left {
                width: 50%;
                display: flex;
                padding-right: 25px;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                .progress-warp {
                  width: 70%;
                  position: relative;
                  .progress-num {
                    width: 20px;
                    position: absolute;
                    top: 0;
                    right: -25px;
                  }
                }
              }
              .real-time-broadcast-right {
                width: 45%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                font-size: 14px;
                .real-time-broadcast-title {
                  font-weight: 550;
                  font-size: 16px !important;
                }
              }
            }
          }
        }
        .chart-container {
          width: 100%;
          height: 90%;
          background-color: white;
          .chart-title {
            display: flex;
            padding: 15px 20px;
            font-size: 15px;
            line-height: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
            :nth-child(1) {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
