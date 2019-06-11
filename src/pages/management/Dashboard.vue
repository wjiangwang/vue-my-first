<template>
  <div class="page dashboard">
    <div class="page-main">
      <div class="topBar">
        <img src="static/images/dashboardBackground.png" alt style="width:100%">
        <div class="title">
          <span>安全生产综合监管系统</span>
          <span class="map-model">
            <span class="left-button" @click="mapModelReduce"></span>
            {{setMapModel}}
            <span class="right-button" @click="mapModelAdd"></span>
          </span>
        </div>
        <span class="time">{{currentTime}}</span>

        <div class="controll-button">
          <div class="account">
            <div class="user">
              <span class="username">{{account.nickname}}</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
            <ul class="menu">
              <router-link tag="li" :to="{ path: '/account' }">
                <img src="@/assets/icons/setting.png" class="setting-icon">
                个人设置
              </router-link>
              <li @click.stop="logout">
                <img src="@/assets/icons/logout.png" class="logout-icon">
                退出登录
              </li>
            </ul>
          </div>
          <div class="fullscreen" title="全屏" @click="fullscreen">全屏</div>
        </div>
      </div>

      <ve-bmap
        height="100%"
        class="map-view"
        :settings="mapSettings"
        :loading="mapDataset.loading"
        :series="mapChartSeries"
        :after-set-option-once="afterMapSet"
        :tooltip="mapTooltip"
        :events="mapChartEvents"
      ></ve-bmap>

      <div class="top">
        <div class="top-left">
          <div class="today">
            <div
              class="item controlled"
              @click="dashboardEnterprises.show({ title: '今日已管控企业', type: 'control', params: { status: 1 } })"
            >
              <div class="value">
                <span>今日已管控</span>
                <span>{{controlStat.hasControl}}</span>
                <span>家</span>
              </div>
              <div class="label"></div>
            </div>

            <div
              class="item not-controlled"
              @click="dashboardEnterprises.show({ title: '今日未管控企业', type: 'control', params: { status: 0 } })"
            >
              <div class="value">
                <span>今日未管控</span>
                <span>{{controlStat.notControl}}</span>
                <span>家</span>
              </div>
              <div class="label"></div>
            </div>
          </div>

          <div class="today controll-num">
            <div class="item today-controlled">
              <div class="value">
                <span>今日管控数量</span>
                <div class="today-controlled-num">
                  <digit-roll :rollDigits="todayControled" :dur="2000"></digit-roll>
                </div>
              </div>
              <div class="label"></div>
            </div>
            <div class="item today-check">
              <div class="value">
                <span>今日复核数量</span>
                <div class="today-check-num">
                  <digit-roll :rollDigits="todayReview" :dur="2000"></digit-roll>
                </div>
              </div>
              <div class="label"></div>
            </div>
            <div class="item today-hidden">
              <div class="value">
                <span>今日隐患数量</span>
                <div class="today-hidden-num">
                  <digit-roll :rollDigits="todayHidden" :dur="3000"></digit-roll>
                </div>
              </div>
              <div class="label"></div>
            </div>
          </div>

          <div class="today">
            <div class="broadcast-title">
              <span>实时企业管控播报</span>
            </div>
            <div class="broadcast-content">
              <vue-seamless-scroll
                :data="broadcastData"
                :class-option="broadcastClassOption"
                class="broadcast-warp"
              >
                <ul class="broadcast-item">
                  <li v-for="(item,index) in broadcastData" :key="index">
                    <span class="title" v-text="item.title"></span>
                  </li>
                </ul>
              </vue-seamless-scroll>
            </div>
          </div>
        </div>
        <div class="top-right" ref="pie">
          <div class="header">
            <div class="title">企业风险统计</div>
            <div class="sum">企业总数：{{riskDoughnutDataset.total}}</div>
          </div>

          <ve-pie
            :data="doughnutCharttData"
            :colors="['#F7454A', '#F49E41', '#F4D341', '#0A7DF2']"
            :settings="doughnutChartSettings"
            height="18.8333vw"
            :loading="riskDoughnutDataset.loading"
            width="100%"
            :extend="doughnutChartExtend"
          ></ve-pie>
        </div>
      </div>

      <div class="bottom">
        <div class="chart-card left-card">
          <div class="card-header">
            <div class="left">企业数量分类统计</div>
          </div>
          <ve-histogram
            style="padding-top:20px"
            :data="riskBarDataset.chartData"
            :loading="riskBarDataset.loading"
            :settings="riskBarDataset.chartSettings"
            :colors="['#4580FF', '#F4D341', '#F49E41', '#FA5878']"
            :extend="riskBarDatasetExtend"
            :legend-visible="false"
            height="7.8125vw"
          ></ve-histogram>
        </div>
        <div class="chart-card right-card">
          <div class="card-header">
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
          <ve-line
            style="padding-top:20px"
            :data="riskLineDataset.chartData"
            :settings="lineChartSettings"
            :colors="['#FFBABA', '#4AB0F9']"
            :extend="riskLineDatasetExtend"
            height="7.8125vw"
            :events="lineChartEvents"
            :legend-visible="false"
            :loading="riskLineDataset.loading"
          ></ve-line>
        </div>
      </div>
    </div>

    <dashboard-enterprises ref="dashboardEnterprises"></dashboard-enterprises>
    <material-and-team ref="materialAndTeam"></material-and-team>
  </div>
</template>

<script>
import 'v-charts/lib/style.css'
import { getSession, clearSession } from '@/modules/authentication'
import screenfull from 'screenfull'
import { mapState, mapActions, mapMutations } from 'vuex'
import DigitRoll from '@huoyu/vue-digitroll'
import dayjs from 'dayjs'
import VeRing from 'v-charts/lib/ring.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import mapStyle from './mapStyle'
import VeBmap from 'v-charts/lib/bmap.common'
import 'echarts/lib/chart/scatter'
import vueSeamlessScroll from '@/components/SeamlessScroll'
import DashboardEnterprises from './DashboardEnterprises'
import WebSocketClass from '@/modules/websocket'
import MaterialAndTeam from './DashboardData/MaterialAndTeam'


export default {
  name: 'Dashboard',

  components: {
    VeRing,
    VeHistogram,
    VeLine,
    VePie,
    VeBmap,
    vueSeamlessScroll,
    DashboardEnterprises,
    MaterialAndTeam,
    DigitRoll
  },


  data () {
    return {
      todayControled: 0,
      todayReview: 0,
      todayHidden: 0,
      pieHeight: 0,
      broadcastData: [],
      ZoomNum: 9,
      mapSettings: {
        key: process.env.BAIDU_MAP_APP_KEY,
        bmap: {
          center: [105.90, 31.50],
          zoom: 9,
          roam: true,
          mapStyle: { styleJson: mapStyle }
        }
      },
      mapTooltip: { show: false },
      ws: null,
      currentTime: '',
      currentTimer: null,
      lineChartSettings: {
        labelMap: {
          risk: '风险点数量',
          hiddenDanger: '隐患点数量'
        },
        area: true
      },

      doughnutChartExtend: {
        grid: { containLabel: true },
        legend: { show: false }
      },

      riskBarDatasetExtend: {
        // legend: { show: false, bottom: 30, textStyle: { color: '#9ED1FF' } },
        grid: { top: 20, bottom: 10 },
        cursor: 'default',
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#9ED1FF',
              width: 1
            }
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#9ED1FF',
              width: 1
            }
          },
          splitLine: {
            lineStyle: {
              color: '#103F6D',
            }
          }
        }
      },

      riskLineDatasetExtend: {
        grid: { top: 20, bottom: 10 },
        cursor: 'default',
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#9ED1FF',
              width: 1
            }
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#9ED1FF',
              width: 1
            }
          },
          splitLine: {
            lineStyle: {
              color: '#103F6D',
            }
          }
        }
      },
      recentControll: [],
      broadcastData: [],
      mapModel: 0,
    }
  },
  computed: {
    ...mapState('dashboard', [
      'controlStat', 'riskDoughnutDataset', 'riskBarDataset', 'riskLineDataset', 'mapDataset', 'materialAndTeamDataset'
    ]),

    setMapModel () {
      switch (this.mapModel) {
        case 0:
          this.clearAllMapData()
          return '大数据分析图'
          break
        case 1:
          this.clearAllMapData()
          return '双控等级地图'
          break
        case 2:
          this.clearAllMapData()
          return '重大危险源图'
          break
        case 3:
          this.clearAllMapData()
          return '安全教育地图'
          break
        case 4:
          this.clearAllMapData()
          this.loadMaterialAndTeamData()
          return '应急救援地图'
          break
        default:
          this.clearAllMapData()
          return '大数据分析图'
      }
    },

    doughnutCharttData () {
      let rows = []
      this.riskDoughnutDataset.items.map((item) => {
        rows.push({ '风险等级': item.label.substring(0, item.label.length - 2), '企业数量': item.count })
      })
      return {
        columns: ['风险等级', '企业数量'],
        rows
      }
    },
    dashboardEnterprises () {
      return this.$refs.dashboardEnterprises
    },

    materialAndTeam () {
      return this.$refs.materialAndTeam
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
    },

    mapChartEvents () {
      return {
        click: (event) => {
          console.log('event--------', event);
          switch (event.seriesName) {
            case "救援物资":
              this.materialAndTeam.show(event.data.info)
              break
            case "救援队伍":
              this.materialAndTeam.show(event.data.info)
              break
            default:
              this.$router.push({ name: 'emap-risk-planar-graph', params: { enterpriseId: event.data.uuid } })
          }
        }
      }
    },

    broadcastClassOption () {
      return {
        step: 0.7,
        limitMoveNum: 2
      }
    },

    // 饼图大小
    doughnutChartSettings () {
      let rich = {
        name: {
          color: "#9ED1FF",
          fontSize: this.pieHeight > 380 ? 14 : 11,
          padding: [5, 4],
          align: 'center'
        },
        num: {
          color: "#9ED1FF",
          align: 'center',
          fontSize: this.pieHeight > 380 ? 14 : 11,
          padding: [5, 0]
        },
        hr: {
          borderColor: '#9ED1FF',
          width: '100%',
          borderWidth: 0.5,
          height: 0,
        }
      }
      return {
        roseType: 'radius',
        radius: this.pieHeight / 5.7,
        offsetY: this.pieHeight / 2,
        labelLine: {
          smooth: true,
          length: this.pieHeight > 380 ? 5 : 1,
          length2: 0,
          lineStyle: {
            color: '#8EBCE7'
          }
        },
        label: {
          normal: {
            formatter: function (params, ticket, callback) {
              return '{name|' + params.name + '}\n{hr|}\n{num|' + params.value + '家' + '}';
            },
            rich: rich
          },
        }

      }
    },
    mapChartSeries () {
      let data = this.mapData
      let size = this.ZoomNum
      let rich = {
        name: {
          color: "#9ED1FF",
          fontSize: this.pieHeight > 380 ? 14 : 11,
          padding: [5, 4],
          align: 'left'
        }
      }
      return [
        {
          name: '管控情况',
          type: 'scatter',
          coordinateSystem: 'bmap',
          zlevel: 1,
          data: this.mapDataset.chartData,
          symbolSize: 6,
          // symbolSize: function (val) {
          //   return val[2] / 10;
          // },

          animationEasingUpdate: 'cubicOut',

          label: {
            normal: {
              borderColor: '#56B0F7',
              borderWidth: 1,
              backgroundColor: 'rgba(1,5,17,0.4)',
              padding: 10,
              align: 'left',
              formatter: function (params, ticket, callback) {
                return '{name|' + '企业名称：' + params.name + '}\n{name|' + '地址：' + params.data.info.address + '}\n{name|' + '主要产品：' + params.data.info.mainProduct + '}';
              },
              rich: rich,
              position: 'top',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#4FDF9F'
            }
          }
        },

        {
          name: '最新管控',
          type: 'effectScatter',

          coordinateSystem: 'bmap',
          data: this.recentControll,
          symbolSize: 17,

          // symbolSize: function (val) {
          //   return val[2] / 10;
          // },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            period: 4,
            scale: 3.5,
          },
          animationEasing: 'cubicOut',
          animationEasingUpdate: 'cubicOut',
          animationDurationUpdate: 600,
          hoverAnimation: true,
          label: {
            normal: {
              borderColor: '#56B0F7',
              borderWidth: 1,
              backgroundColor: 'rgba(1,5,17,0.4)',
              padding: 10,
              align: 'left',
              formatter: function (params, ticket, callback) {
                return '{name|' + '企业名称：' + params.name + '}\n{name|' + '地址：' + params.data.info.address + '}\n{name|' + '主要产品：' + params.data.info.mainProduct + '}';
              },
              rich: rich,
              position: 'top',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#4FDF9F',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        },
        {
          name: '救援物资',
          type: 'scatter',
          coordinateSystem: 'bmap',
          zlevel: 1,
          data: this.materialAndTeamDataset.equipmentMaterial.chartData,
          symbolSize: 15,
          animationEasingUpdate: 'cubicOut',
          label: {
            normal: {
              borderColor: '#56B0F7',
              borderWidth: 1,
              backgroundColor: 'rgba(1,5,17,0.4)',
              padding: 10,
              align: 'left',
              formatter: function (params, ticket, callback) {
                let lableName = params.data.info.map((item) => {
                  return item.equipmentType ? item.equipmentType + '：' + item.equipmentName : '' + '：' + ''
                })
                return '{name|' + lableName.join('\n') + '}';
              },
              rich: rich,
              position: 'top',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#ddb926'
            }
          }
        },
        {
          name: '救援队伍',
          type: 'scatter',
          coordinateSystem: 'bmap',
          zlevel: 1,
          data: this.materialAndTeamDataset.erRescueTeam.chartData,
          symbolSize: 15,
          animationEasingUpdate: 'cubicOut',
          label: {
            normal: {
              borderColor: '#56B0F7',
              borderWidth: 1,
              backgroundColor: 'rgba(1,5,17,0.4)',
              padding: 10,
              align: 'left',
              formatter: function (params, ticket, callback) {
                let lableName = params.data.info.map((item) => {
                  return item.rescueTeamType ? item.rescueTeamName + '：' + item.rescueTeamName : '' + '：' + ''
                })
                return '{name|' + lableName.join('\n') + '}';
              },
              rich: rich,
              position: 'top',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#de5a5a'
            }
          }
        },
      ]
    },

    account () {
      return getSession().user
    },
  },



  methods: {
    ...mapMutations('dashboard', ['setMapLoading']),
    ...mapActions('dashboard', [
      'loadControlStat', 'loadRiskDoughnutData', 'loadRiskBarData', 'loadRiskLineData', 'loadMapData', 'loadMaterialAndTeamData', 'clearAllMapData', 'getTodayControled'
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

    afterMapSet: function (echarts) {
      let bmap = echarts.getModel().getComponent('bmap').getBMap()

      bmap.addEventListener('load', (x, y, z) => {
        console.log('地图加载inginging-------------', x, y, z)
      })

      bmap.addEventListener('tilesloaded', (x, y, z) => {
        //this.setMapLoading(false)
        //console.log('地图加载完成了-------------',x,y,z)
      })

      bmap.addEventListener("zoomend", (e) => {
        console.log(e)
        this.ZoomNum = bmap.getZoom()
      })


    },

    fullscreen () {
      if (screenfull.enabled) screenfull.toggle()
    },

    logout () {
      clearSession()
      this.$router.replace({ name: 'signin' })
    },

    mapModelReduce () {
      this.mapModel = this.mapModel === 0 ? 4 : this.mapModel - 1
    },

    mapModelAdd () {
      this.mapModel = this.mapModel === 4 ? 0 : this.mapModel + 1
    }
  },

  created () {
    this.loadMapData()
    this.loadControlStat()
    this.loadRiskDoughnutData()
    this.loadRiskBarData()
    this.loadRiskLineData()
    this.getTodayControled()
  },

  mounted () {
    this.pieHeight = this.$refs.pie.offsetHeight

    let self = this
    self.currentTimer = setInterval(() => {
      self.currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }, 1000)

    let websocketonmessage = (e) => {
      if (!e.match(/^{/)) return
      let res = JSON.parse(e)
      console.log('WebSocket推送', res)
      this.todayControled = res.amount.controlAmount
      this.todayHidden = res.amount.hiddenTroubleAmount
      this.todayReview = res.amount.reviewAmount

      if (res.company) {

        let itemId
        let itemId2
        if (this.recentControll.length > 9) {
          itemId = this.recentControll[0].itemId
          this.recentControll.shift()
        } else itemId = this.recentControll.length + 1
        this.recentControll.push({ 'name': res.company.enterpriseName, value: [res.company.longitude, res.company.latitude], info: { address: res.company.address, mainProduct: res.company.mainProduct }, uuid: res.company.uuid, itemId })
        console.table(this.recentControll)
        let timer1 = setTimeout(() => {
          for (let index in this.recentControll) {
            if (this.recentControll[index].itemId === itemId) {
              this.recentControll.splice(index, 1)
            }
          }
        }, 30000)


        if (this.broadcastData.length > 9) {
          itemId2 = this.broadcastData[0].itemId2
          this.broadcastData.shift()
        } else itemId2 = this.broadcastData.length + 1
        console.log('最新广播', this.broadcastData)
        this.broadcastData.push({ title: res.broadcast, itemId2 })
        let timer2 = setTimeout(() => {
          for (let index in this.broadcastData) {
            if (this.broadcastData[index].itemId2 === itemId2) {
              this.broadcastData.splice(index, 1)
            }
          }
        }, 30000)

      }
    }

    this.ws = new WebSocketClass('ws://api.staging.sccitysafety.com/websocket', websocketonmessage, '政府首页广播')
    this.ws.connect()
  },

  watch: {
    mapSettings (o, n) {
      console.log('mapSettings', o, n)
    },
    ZoomNum (o, n) {
      console.log('mapZoomNum', o, n)
    }
    // recentControll (oldVal, newVal) {
    //   let last = newVal[newVal.length - 1].itemId
    //   setTimeout(() => {
    //     for (let index in this.recentControll) {
    //       if (item[index].itemId === last) {
    //         this.recentControll.splice(index, 1)
    //       }
    //     }
    //   }, 1000)
    // }
  },

  beforeDestroy () {
    if (this.currentTimer) {
      clearInterval(this.currentTimer)
    }
    this.ws.closeMyself()
  }
}
</script>

<style lang="scss">
@function px2vw($px) {
  @return (100 / 1600 * $px) * 1vw;
}
.today-controlled-num,
.today-check-num,
.today-hidden-num {
  width: 45%;
  position: absolute;
  top: 45%;
  //transform: translateY(-50%);
  right: px2vw(20);
  /deep/.d-roll-wrapper {
    margin: 0;
    .d-roll-item {
      height: px2vw(45) !important;
      .d-roll-bar {
        font-size: px2vw(30);
        div {
          margin: 0 px2vw(5);
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@function px2vw($px) {
  @return (100 / 1600 * $px) * 1vw;
}

.dashboard.page {
  // height: auto !important;
  position: relative;
  .map-view {
    width: 100%;
    height: 100%;
  }
}
.topBar {
  position: absolute;
  top: px2vw(-10);
  z-index: 10;
  img {
    height: px2vw(100);
  }
  .time {
    position: absolute;
    bottom: px2vw(8);
    color: #3ad7fe;
    left: 50%;
    transform: translateX(-50%);
    font-size: px2vw(13);
    line-height: px2vw(16);
  }
  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    position: absolute;
    top: px2vw(25);
    left: 50%;
    transform: translateX(-50%);
    margin: 0 auto;
    span:nth-child(1) {
      font-size: px2vw(15);
      line-height: px2vw(21);
      margin-bottom: px2vw(3);
    }

    .map-model {
      font-size: px2vw(12);
      padding: 0 px2vw(8);
      position: relative;
      @mixin switch-button {
        position: absolute;
        display: inline-block;
        width: 8px;
        height: 100%;
        top: 0;
        &:hover {
          cursor: pointer;
        }
      }
      .left-button {
        @include switch-button;
        right: 100%;
        background: url("../../assets/images/dashboard-switch-left.png") center
          no-repeat;
      }
      .right-button {
        @include switch-button;
        left: 100%;
        background: url("../../assets/images/dashboard-switch-right.png") center
          no-repeat;
      }
    }
  }
  .controll-button {
    .account {
      z-index: 1;
      position: absolute;
      top: px2vw(25);
      right: px2vw(-10);
      // &:hover {
      //   background: rgba(1,5,17,0.4);
      // }
      &:hover > .menu {
        display: block;
      }
      .user {
        display: flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
        padding: 0 px2vw(20);
        padding-left: 0;

        .icon {
          width: px2vw(20);
          height: px2vw(19);
          margin-right: px2vw(15);
        }

        .username {
          color: white;
          font-size: px2vw(12);
          margin-right: px2vw(8);
        }

        .el-icon-caret-bottom {
          color: whitesmoke;
        }
      }

      .menu {
        display: none;
        position: absolute;
        right: px2vw(20);
        color: #333333;
        background: #f6f7fb;
        padding: 0;
        margin: 0;
        list-style: none;
        border-radius: px2vw(2);
        border: 1px solid #e6e6e6;
        border-top: 0;
        box-shadow: 0 px2vw(2) px2vw(12) 0 rgba(0, 0, 0, 0.1);
        width: px2vw(110);
        z-index: 9999;

        li {
          display: flex;
          align-items: center;
          font-size: px2vw(10);
          height: px2vw(30);
          padding: 0 px2vw(12);
          cursor: pointer;
          &:hover {
            background: #e6e6e6;
          }
          &:first-child {
            border-bottom: 1px solid #e6e6e6;
          }

          .setting-icon {
            width: px2vw(9);
            height: px2vw(6);
            margin-right: px2vw(10);
          }

          .logout-icon {
            width: px2vw(8);
            height: px2vw(9);
            margin-right: px2vw(10);
          }
        }
      }
    }
    .fullscreen {
      padding-right: px2vw(20);
      position: absolute;
      top: px2vw(25);
      right: px2vw(100);
      cursor: pointer;
      font-size: px2vw(12);
      color: white;
    }
  }
}
.enterprise-count {
  padding: px2vw(20);
  color: #919090;
  font-size: px2vw(14);
  line-height: px2vw(19);
}

.top {
  .top-left {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: absolute;
    top: px2vw(40);
    padding: 0 px2vw(11);
  }

  .level-charts {
    flex: 1;
    /deep/ .el-card__body {
      display: flex;
      flex-wrap: wrap;
      padding-top: px2vw(10);
      padding-bottom: px2vw(8);
    }

    .chart-wrapper {
      width: 50%;
      color: #333;
      position: relative;

      .legend {
        position: absolute;
        top: px2vw(34);
        left: px2vw(160);

        .label {
          font-size: px2vw(16);
          line-height: px2vw(22);
          font-weight: 500;
          margin-bottom: px2vw(10);
        }

        .value {
          font-size: px2vw(13);
          line-height: px2vw(17);
        }
      }
    }
  }

  .today {
    // width: 270px;
    // height: 170px;
    width: px2vw(250);
    height: px2vw(150);
    margin-left: 0px;
    margin-bottom: px2vw(10);
    background: url("../../assets/images/dashboard-controlled-bg.png") no-repeat;
    background-size: contain;

    .item {
      height: 50%;
      text-align: center;
      color: #fff;
      padding-top: px2vw(18);
      box-sizing: border-box;
      cursor: pointer;

      .value {
        text-align: left;
        position: relative;
        line-height: px2vw(41);

        span {
          font-size: px2vw(14);
          color: #9ed1ff;
          &:nth-child(1) {
            padding: 0 px2vw(10) 0 px2vw(26);
          }

          &:nth-child(2) {
            display: inline-block;
            font-size: px2vw(30);
            color: rgba(255, 255, 255, 1);
            font-weight: 100;
            width: px2vw(100);
            text-align: center;
          }
          &:nth-child(3) {
            position: absolute;
            right: px2vw(40);
            bottom: 0;
          }
        }
      }

      .label {
        font-size: px2vw(14);
        line-height: px2vw(20);
      }
    }

    .today-controlled,
    .today-check,
    .today-hidden {
      span {
        position: absolute;
        top: px2vw(10);
      }
      height: 30%;
      padding-top: px2vw(10);
    }

    .controlled {
      position: relative;
      z-index: 100;
      &::before {
        content: "";
        border-bottom: solid px2vw(2) #18a0f6;
        position: absolute;
        width: 80%;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        height: px2vw(2);
      }
      background-size: 100% 100%;
    }

    .today-controlled,
    .today-check {
      position: relative;
      z-index: 100;
      &::before {
        content: "";
        border-bottom: solid px2vw(1) #18a0f6;
        position: absolute;
        width: 80%;
        left: 50%;
        transform: translateX(-50%);
        bottom: px2vw(-10);
        height: px2vw(2);
      }
      background-size: 100% 100%;
    }

    .not-controlled {
      background-size: 100% 100%;
    }
    .broadcast-title {
      font-size: px2vw(13);
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(158, 209, 255, 1);
      line-height: px2vw(18);
      text-align: left;
      padding: px2vw(8);
    }
    .broadcast-content {
      // padding-top: px2vw(5);
      height: px2vw(100);
      overflow: hidden;
      .broadcast-warp {
        overflow: hidden;
        height: px2vw(107);
        ul {
          list-style: none;
          padding: 0 px2vw(10);
        }
        li {
          padding: px2vw(5) px2vw(3);
          text-align: left;
          line-height: 1;
          display: flex;
          justify-content: space-between;
          font-size: px2vw(13);
          color: #ffffff;
        }
      }
    }
  }
  .top-right {
    background: url("../../assets/images/riskDoughnutDataset-bg.png") no-repeat;
    background-size: contain;
    width: px2vw(270);
    height: px2vw(380);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: absolute;
    top: px2vw(40);
    right: px2vw(11);
    .header {
      font-size: px2vw(13);
      color: rgba(255, 255, 255, 1);
      line-height: px2vw(17);
      .title {
        position: absolute;
        top: px2vw(7);
        left: px2vw(13);
      }
      .sum {
        position: absolute;
        right: px2vw(10);
        top: px2vw(20);
      }
    }
  }
}

.bottom {
  .left-card {
    position: absolute;
    bottom: px2vw(11);
    left: px2vw(11);
  }
  .right-card {
    position: absolute;
    bottom: px2vw(11);
    right: px2vw(11);
  }
  .chart-card {
    background-color: transparent;
    background: url("../../assets/images/dashboard-chart-bg.png") no-repeat;
    background-size: contain;
    width: px2vw(470);
    height: px2vw(199);
    &:first-child {
      margin-right: px2vw(20);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: px2vw(5) px2vw(15);
      .left {
        font-size: px2vw(13);
        color: rgba(255, 255, 255, 1);
        line-height: px2vw(17);
      }

      .right {
        .legend {
          display: inline-flex;
          align-items: center;
          font-size: px2vw(13);
          color: #666666;
          &:first-child {
            margin-right: px2vw(26);
          }

          .color {
            width: px2vw(36);
            height: px2vw(3);
            margin-right: px2vw(4);
          }

          &:first-child .color {
            background: #ffbaba;
          }

          &:last-child .color {
            background: #4ab0f9;
          }
        }
      }
    }
  }
}
</style>
