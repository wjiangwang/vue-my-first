<template>
  <div class="dashboard-carousel-item-content risk-statistics">
    <div class="summary">
      共{{totalCount}}个风险点
      <span class="running"><i>{{runningCount}}</i> 个运营</span>
      <span class="shutdown"><i>{{shutdownCount}}</i> 个停用</span>
    </div>

    <el-row v-for="(row, index) in rows" :key="index" :gutter="16">
      <el-col :span="24 / columnCount"
        v-for="(item, itemIndex) in row" :key="itemIndex">
        <risk-chart v-bind="item" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RiskChart from './RiskChart'

export default {
  name: 'RiskStatistics',

  components: {
    RiskChart
  },

  props: {
    rows: {
      type: Array,
      default: () => []
    },
    columnCount: {
      type: Number,
      default: 2
    },

    totalCount: Number,
    runningCount: Number,
    shutdownCount: Number
  }
}
</script>

<style lang="scss" scoped>
.risk-statistics {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 0;
  padding-bottom: 0;

  .summary {
    position: absolute;
    top: -17px;
    right: 28px;
    color: #4c4c4c;
    font-size: 13px;

    .running {
      margin: 0 18px;
      i {
        font-size: 16px;
        color: #59D987;
      }
    }

    .shutdown i {
      color: #FA5878;
      font-size: 16px;
    }
  }

  > .el-row {
    flex: 1;
    overflow: hidden;
    padding: 8px 0;
    min-height: 180px;
    .el-col {
      height: 100%;
    }
  }
}

.screen-drop {
  &.dark-mode {
    .risk-statistics .summary {
      color: #eee;
    }
  }

  .risk-statistics .summary {
    font-size: 1.25em;
    line-height: 1.3;

    i {
      font-size: 1em;
    }
  }
}
</style>
