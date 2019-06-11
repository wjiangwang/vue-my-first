<template>
  <div class="page">
    <page-card class="page-main" :scrollable="false">
      <div class="chart-warp">
        <ve-histogram class="chart" :settings="chartSettings" :extend="chartExtend" height="100%"></ve-histogram>
        <!-- <ve-histogram
          class="chart"
          height="100%"
          :data="chartData"
          :data-zoom="dataZoom"
          :settings="chartSettings"
          :extend="chartExtend"
          :colors="chartColors"
        ></ve-histogram>-->
      </div>
    </page-card>
  </div>
</template>

<script>
import PageCard from '@/components/PageCard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import VeHistogram from 'v-charts/lib/histogram.common'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'

export default {
  name: 'RiskPlanarGraphJob',

  components: {
    VeHistogram,
    PageCard
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    },
    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      mapData: [

      ],
      totalNum: {
        oneRiskNum: 0,
        twoRiskNum: 0,
        threeRiskNum: 0,
        fourRiskNum: 0,
      },
      searchForm: {
        keywords: null
      },
      chartColors: ['#F7454A', '#F49E41', '#F4D341', '#37A9FA'],
    }
  },

  watch: {
    // chartDataRows () {
    //   this.loadHistogramMsg()
    // }
  },

  computed: {
    // ...mapState('regionalRisk', ['list', 'chartDataRows']),

    chartSettings () {
      return {

      }
    },

    dataZoom () {
      let end = this.chartData.rows.length && this.chartData.rows.length > 6 ? 30 : 100
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
    chartExtend () {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (obj) {
            let val = '';
            for (let i = 0; i < obj.length; i++) {
              let item = obj[i];
              let level = ''
              switch (item.color) {
                case '#19d4ae':
                  level = '重大危险等级'
                  break;
                case "#5ab1ef":
                  level = '一般风险等级'
                  break;
                case "#c4b4e4":
                  level = '低风险等级'
                  break;
                case "#d87a80":
                  level = '一般隐患'
                  break;
              }
              if (item.value) val += item.marker + item.seriesName + ':&nbsp&nbsp' + level + '<br/>';
            }
            return obj[0].axisValue + '<br/>' + val;

          }
        },

        legend: {
          right: 20,
          itemWidth: 15,
          itemHight: 15,
          itemGap: 17,
        },
        grid: {

        },
        xAxis: {
          type: 'category',
          data: ['企业合规性', '二', '三', '四', '五', '六', '七']

        },
        yAxis: {
        },
        series: [
          {
            name: '电工证',
            type: 'bar',
            stack: '种类',
            data: [1, 0, 1, 1, 1, 1, 1]
          },
          {
            name: '质量',
            type: 'bar',
            stack: '种类',
            data: [1, 0, 0, 0, 1, 1, 1]
          },
          {
            name: '环境',
            type: 'bar',
            stack: '种类',
            data: [1, 0, 1, 1, 1, 1, 1]
          },
          {
            name: '安全',
            type: 'bar',
            stack: '种类',
            data: [1, 0, 1, 1, 1, 1, 1]
          },
          {
            name: '纳税',
            type: 'bar',
            stack: '种类',
            data: [1, 1, 1, 1, 1, 1, 1]
          },
          {
            name: '噪声控制',
            type: 'bar',
            stack: '种类',
            data: [1, 1, 1, 1, 1, 1, 1]
          },
          {
            name: '资源消耗',
            type: 'bar',
            stack: '种类',
            data: [1, 1, 1, 1, 1, 1, 1]
          },
        ]
      }
    }
  },

  methods: {
    // ...mapMutations('regionalRisk', ['setListParams', 'setListPageSize']),
    // ...mapActions('regionalRisk', [
    //   'loadListData', 'filterListData', 'delete', 'update', 'removeControls', 'updateStatus', 'loadHistogram'
    // ]),
    loadHistogramMsg () {
    }
  },

  async created () {

  }
}
</script>

<style lang="scss" scoped>
.chart-warp {
  height: 100%;
  .chart {
    padding: 20px 400px;
  }
}
</style>
