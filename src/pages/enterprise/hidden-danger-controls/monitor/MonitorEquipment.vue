<template>
  <div class="page monitor-equipment-detail">
    <breadcrumb :items="[{ name: '监控模块', route: {path: $resolveRoutePath('monitoring/monitor')} }, { name: '监控设备' }]"></breadcrumb>

    <div class="page-main" v-loading="risk.loading">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/bell.png" class="icon">
          <h1>风险点名称：{{risk.riskName}}</h1>
        </div>
      </div>

      <div class="content-box">
        <div class="chart-container">
          <div>
            <div class="chart-title">
              <img src="static/images/temperature.png">
              温度计-UI6721631238
            </div>
            <ve-line
              :data="temperatureData"
              :settings="temperatureSettings"
              width="96%"
              height="100%"
              :colors="['#FEA340']"
              ref="chart1"
              :legend-visible="false"
              :grid="{ top: 40 }"
              :tooltip="temperatureChartTooltip">
            </ve-line>
          </div>
          <div>
            <div class="chart-title chart-title-voltage-current">
              <div>
                <img src="static/images/voltageCurrent.png">
                电流电压表-UA2737243
              </div>
              <div>
                <span></span>
                电流
                <span></span>
                电压
              </div>
            </div>
            <ve-line
              :data="voltageCurrentData"
              :settings="voltageCurrentSettings"
              :colors="['#339DF3', '#5867C3']"
              ref="chart2"
              width="96%"
              height="100%"
              :grid="voltageCurrentGrid"
              :legend-visible="false"
              :tooltip="voltageCurrentChartTooltip">
            </ve-line>
          </div>
          <div>
            <div class="chart-title">
              <img src="static/images/monitor.png">
              摄像机-234566898
            </div>
            <div class="video-container">
              <video src="https://lab.kaifa.fun/imgs/154538276472091K888piChdI.mp4" autoplay="autoplay" height="200" width="420" loop="loop" controls="controls"></video>
              <!-- <video src="http://shuangkong.oss-cn-qingdao.aliyuncs.com/hazard-attachment/1545359570810/79k888piC6bM.mp4" controls="controls" loop="loop" autoplay="autoplay" height="200" width="420"></video> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import VeLine from 'v-charts/lib/line.common'
  import 'echarts/lib/component/tooltip'
  import each from 'lodash/each'

  export default {
    name: 'monitorEquipment',

    components: {
      VeLine,
      Breadcrumb
    },

    props: {
      canEdit: {
        type: Boolean,
        default: true
      },

      breadcrumbs: {
        type: Array,
        default() { return [] }
      }
    },

    data() {
      return {
        risk: {
          riskName: '天然气管道排油堵盲板监控设备',
          loading: false
        },
        voltageCurrentSettings: {
          axisSite: { right: ['voltage'] },
          yAxisType: [ 'KMB', 'KMB' ],
          yAxisName: [ '电流单位：A', '电压单位：V' ],
          metrics: ['current', 'voltage'],
          labelMap: {
            current: '电流',
            voltage: '电压'
          },
          area: true
        },
        voltageCurrentData: {
          columns: ['date', 'current', 'voltage'],
          rows: [
            {date: '11:22', current: 6.32, voltage: 220},
            {date: '11:23', current: 3.56, voltage: 230},
            {date: '11:24', current: 0.12, voltage: 180},
            {date: '11:25', current: 5.00, voltage: 250},
            {date: '11:26', current: 1.78, voltage: 200},
            {date: '11:27', current: 2.34, voltage: 301},
          ]
        },
        voltageCurrentGrid: {
          left: 50,
          top: 40
        },
        temperatureSettings: {
          yAxisType: [ 'KMB' ],
          yAxisName: [ '℃' ],
          labelMap: {
            temperature: '温度'
          },
          area: true
        },
        temperatureData: {
          columns: ['date', 'temperature'],
          rows: [
            {date: '11:22', temperature: 120},
            {date: '11:23', temperature: 100},
            {date: '11:24', temperature: 80},
            {date: '11:25', temperature: 160},
            {date: '11:26', temperature: 90},
            {date: '11:27', temperature: 106},
          ]
        }
      }
    },

    computed: {
      // ...mapState('enterpriseRiskSecondItem', ['risk', 'list']),
      // ...mapState('enterpriseRiskThirdItem', { thirdList: 'list' }),
      voltageCurrentChartTooltip() {
        return {
          trigger: 'axis',
          formatter: (params, ticket, callback) => {
            let date = ''
            if (params.length) {
              date = params[0].axisValueLabel
            }
            let content = `<div>${date}</div>`
            each(params, (item) => {
              content += `<div>
                <div style="display: flex; align-items: center;">
                  ${ item.marker}
                  <div>${item.seriesName}：</div>
                  <div>${item.data[1]}${ item.seriesName === '电压' ? ' V' : ' A'}</div>
                  </div>
              </div>`
            })
            return content
          }
        }
      },

      temperatureChartTooltip() {
        return {
          formatter: (params, ticket, callback) => {
            return `<div>${params.data[0]}</div>${params.marker}<span>${params.seriesName}</span><span style="margin-left: 5px;">${params.data[1]} ℃</span>`
          }
        }
      }
    },

    mounted () {},

    methods: {
      // ...mapMutations('enterpriseRiskSecondItem', ['setListParams', 'setListPageSize']),
      // ...mapActions('enterpriseRiskSecondItem', ['loadListData', 'delete', 'updateStatus']),
      // ...mapMutations('enterpriseRiskThirdItem', {
      //   setThirdListParams: 'setListParams',
      //   setThirdListPageSize: 'setListPageSize',
      //   setThirdListData: 'setListData'
      // }),
      // ...mapActions('enterpriseRiskThirdItem', {
      //   loadThirdListData: 'loadListData',
      //   deleteThirdItem: 'delete'
      // }),
    },

    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .monitor-equipment-detail {
    box-sizing: border-box;

    .page-main {
      display: flex;
      flex-direction: column;

      > .el-card {
        margin: 20px 0 0 20px;
        padding: 24px 20px;
        flex-direction: column;
        align-items: flex-start !important;
        position: relative;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        .name {
          display: flex;
          align-items: center;

          .icon {
            width: 34px;
            height: 34px;
            margin-right: 8px;
          }

          h1 {
            font-size: 22px;
            line-height: 30px;
            margin: 0;
          }
        }

        .detail {
          font-size: 13px;
          color: #333;
          line-height: 17px;

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              display: inline-block;
              margin-right: 30px;
            }
          }
        }

        .actions {
          position: absolute;
          top: 14px;
          right: 35px;

          .edit img {
            width: 19px;
            height: 18px;
          }
        }
      }

      > .content-box {
        flex: 1;
        display: flex;
        padding: 10px 0 0 20px;
        .chart-container {
          padding-top: 10px;
          background-color: white;
          height: 100%;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          overflow-y: auto;
          > div {
            box-sizing: border-box;
            width: 50%;
            height: 50%;
            min-height: 200px;
            > .chart-title {
              height: 40px;
              font-size: 14px;
              color: #4c4c4c;
              display: flex;
              align-items: center;
              img {
                margin-left: 15px;
                margin-right: 10px;
              }
            }
            .chart-title-voltage-current {
              justify-content: space-between;
              > div {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
              }
              > :last-child {
                justify-content: flex-end;
                padding-right: 60px;
                span {
                  font-size: 12px;
                  width: 10px;
                  height: 10px;
                  margin-left: 20px;
                  margin-right: 5px;
                  background-color: #339DF3;
                }
                > :last-child {
                  background-color: #5867C3;
                }
              }
            }
            .ve-line {
              margin: auto;
            }
            .video-container {
              display: flex;
              justify-content: center;
            }
          }
        }
      }
    }
  }
</style>
