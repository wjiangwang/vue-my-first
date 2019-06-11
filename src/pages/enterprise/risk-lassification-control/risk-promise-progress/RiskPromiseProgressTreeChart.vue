<template>
  <div class="risk-promise-progress-tree-chart" v-loading="loading">
    <div class="tree-lenged">
      <div class="promise">
        <span></span> 已承诺
      </div>
      <div class="unpromise">
        <span></span>未承诺
      </div>
    </div>
    <div class="search-warp">
      <el-form :inline="true" :model="searchForm" label-suffix=":" size="small">
        <date-input label name="datePick" @input="datePick = $event"></date-input>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <ve-tree
      :extend="chartExtend"
      :tooltip-formatter="tooltipFormatter"
      :height="'100%'"
      class="tree-chart"
    />
  </div>
</template>

<script>
import VeTree from 'v-charts/lib/tree.common'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RiskPromiseProgressTreeChart',

  components: {
    VeTree
  },
  data () {
    return {
      datePick: '',
      searchForm: null
    }
  },
  computed: {
    ...mapState('hierarchyTree', ['loading', 'items']),

    chartData () {
      let value = this.items.length > 1 ? [{
        name: '全公司',
        children: this.items
      }] : this.items

      value[0].children[0].itemStyle = {
        color: '#a6cf65',
      };
      value[0].children[0].lineStyle = {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#e45a67'
          }, {
            offset: 1, color: '#a6cf65'
          }],
        },

      }

      return value
      // return {
      //   columns: ['name', 'value'],
      //   rows: [
      //     {
      //       name: 'tree1',
      //       value
      //     }
      //   ]
      // }
    },

    chartExtend () {
      return {
        legend: {
          show: true
        },
        series: {
          type: 'tree',
          data: this.chartData,
          symbol: 'circle',
          itemStyle: {
            color: '#e45a67',
            borderColor: 'rgb(0,0,0,0)'
          },
          symbolSize: 15,
          orient: 'vertical',
          //orient: 'horizontal',

          label: {
            normal: {
              distance: 10,
              position: 'top',
              verticalAlign: 'middle',
              align: 'middle',
            }
          },

          leaves: {
            label: {
              normal: {
                position: 'bottom',
                verticalAlign: 'middle',
                align: 'middle',
              }
            }
          },
          left: '5%',
          top: '12%',
          bottom: '12%',
          right: '5%',
          tooltip: {
            padding: 15,
          }

        }
      }
    }
  },

  methods: {
    ...mapActions('hierarchyTree', ['loadItems']),

    tooltipFormatter (v) {
      return [
        v.marker + `${v.data.name}` + `——未承诺`,
        v.marker + '管控进度——50%',
      ].join('<br>')
    },

    search () {

    }
  },

  async created () {
    await this.loadItems()
  }
}
</script>
<style lang="scss">
.risk-promise-progress-tree-chart {
  position: relative;
  .tree-lenged {
    position: absolute;
    top: 10px;
    left: 10px;
    .promise {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      span {
        margin-right: 5px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #a6cf65;
      }
    }
    .unpromise {
      @extend .promise;
      span {
        background-color: #e45a67;
      }
    }
  }
  .search-warp {
    z-index: 2;
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px 20px 0 0;
  }
  .tree-chart {
    padding-top: 20px;
  }
}
</style>
