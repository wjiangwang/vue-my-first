<template>
  <div class="page dashboard-container">
    <div class="page-main" v-loading="risk.loading">
      <div class="content-box">
        <div class="dashboard-top">
          <div class="dashboard-top-l">
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
              ref="chart2"
              width="98%"
              height="100%"
              :grid="riskHiddenDangerGrid"
              legend-position="bottom"
              v-loading="riskHiddenLoading">
            </ve-line>
          </div>
          <div class="dashboard-top-r">
            <div class="data-container">
              <div class="data-item">
                <div>
                  <div class="data-item-num">{{statisticTatol.riskTotal}}</div>
                  <div class="data-item-title">风险点总数</div>
                </div>
              </div>
              <div class="data-item">
                <div>
                  <div class="data-item-num">{{statisticTatol.hiddenTotal}}</div>
                  <div class="data-item-title">隐患点总数</div>
                </div>
              </div>
              <div class="data-item">
                <div>
                  <div class="data-item-num">{{statisticTatol.majorHazardTotal}}</div>
                  <div class="data-item-title">重大风险源</div>
                </div>
              </div>
              <div class="data-item">
                <div>
                  <div class="data-item-num">{{statisticTatol.accidentTotal}}</div>
                  <div class="data-item-title">事故数</div>
                </div>
              </div>
            </div>
            <div class="news-container">
              <div>
                <div>消息通知</div>
                <img src="static/images/more.png" style="cursor:pointer" @click="$router.push({name: 'policies'})">
              </div>
              <ul>
                <li v-if="message && message.length" v-for="item in message">
                  <div>{{item.title}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="dashboard-bottom">
          <div class="chart-container">
            <div class="chart-title">安全风险实时统计</div>
            <div class="chart-data-one">
              <div class="chart-data-title">
                <div>
                  <div
                    class="data-title"
                    :style="{ 'font-size': titleFontSize + 'px', '-webkit-transform': titleFontSize < 12 ? 'scale(0.8)' : 'scale(1)' }"
                  >风险总数</div>
                  <div
                    class="data-name"
                    :style="{ 'font-size': titleDataSize + 'px', '-webkit-transform': titleFontSize < 12 ? 'scale(0.9)' : 'scale(1)' }"
                  >{{total.riskNum}}</div>
                </div>
              </div>
              <ve-ring
                :data="riskData"
                :settings="riskSettings"
                :legend-visible="false"
                height="100%"
                :colors="['#F7454A', '#F49E41', '#F4D341', '#37A9FA', '#DEDEDE']"
                :grid="riskGrid"
                :extend="riskRingExtend"
              ></ve-ring>
            </div>
            <div class="chart-tip">
              <ul style="padding-left: 6%;">
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#F7454A' }"></span>
                  <span class="label">重大风险</span>
                </li>
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#F49E41' }"></span>
                  <span class="label">较大风险</span>
                </li>
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#F4D341' }"></span>
                  <span class="label">一般风险</span>
                </li>
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#37A9FA' }"></span>
                  <span class="label">低风险</span>
                </li>
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#DEDEDE' }"></span>
                  <span class="label">待确定</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-title">安全隐患实时统计</div>
            <div class="chart-data-one">
              <ve-pie
                :data="hiddenDangerData"
                :settings="riskSettings"
                :legend-visible="false"
                height="100%"
                :colors="['#F7454A', '#F49E41', '#DEDEDE']"
                :grid="riskGrid"
                :extend="riskExtend"
              ></ve-pie>
            </div>
            <div class="chart-tip">
              <ul style="justify-content: center;">
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#F7454A' }"></span>
                  <span class="label">重大隐患</span>
                </li>
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#F49E41' }"></span>
                  <span class="label">一般隐患</span>
                </li>
                <li>
                  <span class="icon triangle" :style="{ 'background-color': '#DEDEDE' }"></span>
                  <span class="label">待确定</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-title">风险管控及研判实时进度</div>
            <div class="chart-data-two">
              <div class="chart-data-two-one">
                <div class="chart-data-title">
                  <div>
                    <div
                      class="data-title"
                      :style="{ 'font-size': titleFontSize + 'px', '-webkit-transform': titleFontSize < 12 ? 'scale(0.8)' : 'scale(1)' }"
                    >管控进度</div>
                    <div
                      class="data-name"
                      :style="{ 'font-size': titleDataSize + 'px', '-webkit-transform': titleFontSize < 12 ? 'scale(0.9)' : 'scale(1)' }"
                    >{{total.controlProgress}}%</div>
                  </div>
                </div>
                <ve-ring
                  :data="controlData"
                  :settings="riskSettings"
                  :legend-visible="false"
                  height="100%"
                  :colors="['#37A9FA', '#DEDEDE']"
                  :grid="riskGrid"
                  :extend="promiseExtend"
                ></ve-ring>
              </div>
              <div class="chart-data-two-one">
                <div class="chart-data-title">
                  <div>
                    <div
                      class="data-title"
                      :style="{ 'font-size': titleFontSize + 'px', '-webkit-transform': titleFontSize < 12 ? 'scale(0.8)' : 'scale(1)' }"
                    >承诺进度</div>
                    <div
                      class="data-name"
                      :style="{ 'font-size': titleDataSize + 'px', '-webkit-transform': titleFontSize < 12 ? 'scale(0.9)' : 'scale(1)' }"
                    >{{total.promiseProgress}}%</div>
                  </div>
                </div>
                <ve-ring
                  :data="promiseData"
                  :settings="riskSettings"
                  :legend-visible="false"
                  height="100%"
                  :colors="['#F49E41', '#DEDEDE']"
                  :grid="riskGrid"
                  :extend="promiseExtend"
                ></ve-ring>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-title">安全风险四色分布图</div>
            <!-- <div class="chart-data-two" style="padding-bottom: 15px; box-sizing: border-box;">
              <img :src="planarGraph.url" style="height: 100%; max-width: 100%;" v-if="planarGraph.url">
              <div class="no-planar-graph" v-else>
                <img src="@/assets/icons/no-planar-image.png">
                <div class="hint">未设置平面图</div>
              </div>
            </div> -->
            <planar-graph :is-carousel="true" id="planar-graph" style="height: calc(100% - 60px);"></planar-graph>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import VeLine from 'v-charts/lib/line.common'
  import VePie from 'v-charts/lib/pie.common'
  import VeRing from 'v-charts/lib/ring.common'
  import 'echarts/lib/component/markLine'
  // import 'echarts/lib/component/dataZoom'
  import dayjs from 'dayjs'

  import PlanarGraph from './carousel/PlanarGraph'

  export default {
    name: 'dashboard',

    components: {
      VeLine,
      VePie,
      VeRing,
      PlanarGraph
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
        titleFontSize: 0,
        titleDataSize: 0,
        readonly: true,
        riskHiddenDangerDay: '最近7天',
        total: {
          riskNum: 0,
          promiseProgress: null,
          controlProgress: null,
        },
        risk: {
          riskName: '天然气管道排油堵盲板监控设备',
          loading: false
        },
        riskHiddenDangerData: {
          columns: ['dayDate', 'riskCount', 'hiddenCount'],
          rows: []
        },
        lineChartExtend: {
          yAxis: {
            splitLine: {
              show: true,
              lineStyle: { type: 'dotted' }
            }
          }
        },
        // lineMarkline: {
        //   symbol: 'circle',
        //   data: [{ yAxis: 0 }],
        //   lineStyle: {
        //     color: '#FE6D6D',
        //     type: 'dotted'
        //   }
        // },
        riskHiddenDangerSettings: {
          labelMap: {
            riskCount: '风险点数量',
            hiddenCount: '隐患点数量'
          },
          area: true
        },
        riskHiddenDangerGrid: {
          top: 20,
          right: 25,
          bottom: 40
        },
        riskData: {
          columns: ['title', 'num'],
          rows: []
        },
        riskSettings: {
          label: { show: false },
          labelLine: { show: false },
        },
        riskGrid: {
        },
        riskExtend: {
          series: {
            radius: '90%',
            center: ['50%', '50%']
          }
        },
        riskRingExtend: {
          series: {
            radius: ['70%', '90%'],
            center: ['50%', '50%']
          }
        },
        hiddenDangerData: {
          columns: ['title', 'num'],
          rows: []
        },
        controlData: {
          columns: ['title', 'num'],
          rows: []
        },
        promiseData: {
          columns: ['title', 'num'],
          rows: []
        },
        promiseExtend: {
          series: {
            radius: ['65%', '85%'],
            center: ['50%', '50%']
          }
        },
        message: [],
        statisticTatol: {
          accidentTotal: '',
          hiddenTotal: '',
          majorHazardTotal: '',
          riskTotal: ''
        }
      }
    },

    computed: {
    },

    mounted () {
      this.setTitleFontSize()
    },

    methods: {
      ...mapActions('dashboard', ['getRiskHiddenDangerData', 'getHiddenStatisticalData', 'getProgressData', 'getRiskStatisticalData', 'getMessage', 'getNumStatistics']),
      ...mapActions('enterpriseRiskGraph', { loadPlanarGraphData: 'loadData' }),

      setTitleFontSize () {
        if (window.innerHeight <= window.innerWidth) {
          this.titleFontSize = 0.016 * window.innerHeight
          this.titleDataSize = 0.025 * window.innerHeight
        } else {
          this.titleFontSize = 0.007 * window.innerWidth
          this.titleDataSize = 0.011 * window.innerWidth
        }
      },

      async getRiskHiddenDanger (day = 6) {
        this.riskHiddenLoading = true
        let obj = await this.getRiskHiddenDangerData(day)
        this.riskHiddenDangerData.rows = obj.map((item) => {
          return Object.assign({}, item, { dayDate: dayjs(item['dayDate']).format('M月D日') })
        })
        this.riskHiddenLoading = false
      },

      async gethiddenStatistical () {
        let data = await this.getHiddenStatisticalData()
        this.hiddenDangerData.rows = [
          { title: '重大隐患', num: data['majorHazard'] },
          { title: '一般隐患', num: data['generalHazard'] },
          { title: '待确定隐患', num: data['toBeDetermined'] }
        ]
      },

      async getprogress () {
        let data = await this.getProgressData()
        this.controlData.rows = [
          { title: '已管控', num: data['finished'] },
          { title: '未管控', num: data['unfinished'] }
        ]
        this.promiseData.rows = [
          { title: '承诺', num: data['hasPromised'] },
          { title: '未承诺', num: data['noPromised'] }
        ]
        if (data['finished'] || data['unfinished']) {
          this.total.controlProgress = parseInt((data['finished'] / (data['finished'] + data['unfinished'])) * 100)
        } else {
          this.total.controlProgress = '0'
        }
        if (data['hasPromised'] || data['hasPromised']) {
          this.total.promiseProgress = parseInt((data['hasPromised'] / (data['hasPromised'] + data['noPromised'])) * 100)
        } else {
          this.total.promiseProgress = '0'
        }

      },

      async getRiskStatistical () {
        let data = await this.getRiskStatisticalData()
        this.riskData.rows = [
          { title: '重大风险', num: data['oneRisk'] },
          { title: '较大风险', num: data['twoRisk'] },
          { title: '一般风险', num: data['threeRisk'] },
          { title: '低风险', num: data['fourRisk'] },
          { title: '待确定', num: data['toBeDetermined'] }
        ]
        let totalNum = 0
        for (let key in data) {
          totalNum += data[key]
        }
        this.total.riskNum = totalNum
      },

      handleCommand (command) {
       this.riskHiddenDangerDay = command === 29 ? '最近30天' : '最近7天'
       this.getRiskHiddenDanger(command)
      },
    },

    async created () {
      this.getRiskHiddenDanger()
      this.gethiddenStatistical()
      this.getprogress()
      this.getRiskStatistical()
      this.loadPlanarGraphData()
      this.message = await this.getMessage()
      this.statisticTatol = await this.getNumStatistics()
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

      > .content-box {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        padding: 10px 10px 0 10px;
        height: 100%;
        .dashboard-top {
          box-sizing: border-box;
          height: calc(54% - 20px);
          margin-top: 10px;
          width: 100%;
          display: flex;
          > div {
            margin: 0 10px;
            height: calc(100% - 20px);
            min-height: 200px;
          }
          .dashboard-top-l {
            background-color: white;
            width: calc(75% - 20px);
            padding-bottom: 20px;
            .chart-title {
              margin: auto;
              /*padding-left: 20px;*/
              padding-top: 5px;
              font-size: 14px;
              color: #000;
              display: flex;
              justify-content: space-between;
              width: 90%;
              > :last-child {
                color: #666;
              }
            }
            .ve-line {
              margin: auto;
            }
          }
          .dashboard-top-r {
            width: calc(25% - 20px);
            .data-container {
              width: 100%;
              height: 70%;
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              .data-item {
                width: calc(50% - 10px);
                height: calc(50% - 10px);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                > div {
                  text-align: center;
                }
                .data-item-num {
                  font-size: 32px;
                  margin-bottom: 3px;
                }
                .data-item-title {
                  font-size: 14px;
                }
              }
              > :nth-child(1) {
                background-color: #40bdca;
              }
              > :nth-child(2) {
                background-color: #3f4e6d;
              }
              > :nth-child(3) {
                background-color: #3696fb;
                align-self: flex-end;
              }
              > :nth-child(4) {
                background-color: #ff724f;
                align-self: flex-end;
              }
            }
            .news-container {
              background-color: white;
              width: 100%;
              height: calc(30%);
              margin-top: 20px;
              > :nth-child(1) {
                display: flex;
                justify-content: space-between;
                padding: 5px 20px;
                img {
                  width: 18px;
                  height: 18px;
                }
              }
              ul {
                color: #666;
                margin: 0;
                li {
                  font-size: 13px;
                  > div {
                    width: 60%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }
        .dashboard-bottom {
          height: calc(45% - 25px);
          /*height: 100%;*/
          margin: 0px 10px 0 10px;
          width: 100%;
          display: flex;
          .chart-container {
            width: calc(25% - 15px);
            height: 100%;
            margin-right: 20px;
            background-color: white;
            .chart-title {
              padding: 15px 20px;
              font-size: 14px;
              line-height: 20px;
            }
            .chart-data-one {
              position: relative;
              width: 100%;
              height: calc(100% - 100px);
            }
            .chart-data-two {
              width: 100%;
              height: calc(100% - 50px);
              display: flex;
              justify-content: space-around;
              align-items: center;
              .chart-data-two-one {
                position: relative;
                width: 50%;
                height: 60%;
              }
              .no-planar-graph {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                img {
                  width: 60px;
                  height: auto;
                  margin-bottom: 15px;
                }

                .hint {
                  font-size: 14px;
                  color: #b0b0b0;
                }
              }
            }
            .chart-tip {
              width: 100%;
              height: 50px;
              display: flex;
              align-items: center;
              box-sizing: border-box;
              ul {
                margin: 0;
                padding: 0;
                width: 100%;
                list-style: none;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                > :last-child {
                  margin-right: 0 !important;
                }
                li {
                  margin-right: 25px;
                  width: calc(27% - 6px);
                  font-size: 12px;
                  color: #666;
                  .icon {
                    content: "";
                    width: 10px;
                    height: 10px;
                    display: inline-block;
                    margin-right: 8px;

                    &.triangle {
                      width: 10px;
                      height: 10px;
                    }
                  }
                }
              }
            }
            .chart-data-title {
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              .data-title {
                color: #666;
              }
              .data-name {
                color: #333;
              }
            }
          }
          > :nth-child(4) {
            margin-right: 0px !important;
          }
        }
      }
    }
  }
</style>
