<template>
  <div class="special-job-chart">
    <el-table :data="[{ items, address }]"
      :border="true"
      size="medium"
      :show-overflow-tooltip="true"
      :cell-style="{ 'vertical-align': 'top' }"
      style="width: 100%;">
      <el-table-column :label="name">
        <div class="chart" slot-scope="{ row }">
          <div class="item"
            v-for="(item, index) in row.items"
            :key="index">
            <el-progress :show-text="false"
              :stroke-width="12"
              :percentage="item.percent"
              :color="item.color">
            </el-progress>

            <div class="text">{{item.count}} ({{item.percent}}%)</div>
          </div>
        </div>
      </el-table-column>

      <el-table-column label="作业地点"
        prop="address"
        width="250px">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const colors = ['#F7454A', '#FDB45C', '#FFE031', '#2BB0F8', '#C8CBD5']

export default {
  name: 'SpecialJobChart',

  props: {
    name: String,

    item: {
      type: Object,
      default: {}
    },

    address: String
  },

  computed: {
    totalCount() {
      return this.item.oneRisk + this.item.twoRisk + this.item.threeRisk + this.item.fourRisk
    },

    items() {
      return ['one', 'two', 'three', 'four'].map((key, index) => {
        const count = this.item[`${key}Risk`]

        return {
          count,
          percent: this.totalCount > 0 ? parseFloat((count * 100 / this.totalCount).toFixed(2)) : 0,
          color: colors[index]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.special-job-chart {
  /deep/ .el-table .el-table__header th {
    background: #E8E9EF;
    color: #4c4c4c;
  }

  .chart .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    /deep/ .el-progress {
      flex: 1;
      margin-right: 10px;

      .el-progress-bar__outer,
      .el-progress-bar__inner {
        border-radius: 0;
      }
    }

    .text {
      width: 120px;
    }
  }
}

.screen-drop {
  &.dark-mode .special-job-chart {
    /deep/ .el-table {
      color: #eee;

      tr {
        background: #272B35;
      }
    }

    /deep/ .el-table .el-table__header th {
      background: #3A3E46;
      color: #eee;
      border-color: #111;
    }

    /deep/ {
      .el-table--border, .el-table--group {
        border-color: #111;
      }

      .el-table--border td {
        border-right-color: #111;
      }

      .el-table td {
        border-bottom-color: #111;
      }

      .el-table--border::after, .el-table--group::after, .el-table::before {
        background-color: #111;
      }
    }

    .chart .item {
      color: #eee;
    }
  }

  .special-job-chart {
    /deep/ .el-table .el-table__header th {
      font-size: 1.25em;
      padding-top: 0.75em;
      padding-bottom: 0.75em;
    }

    /deep/ .el-table .el-table__row .cell {
      font-size: 1.125em;
      line-height: 1.385;
    }

    .chart .item {
      margin-bottom: 1.25em;
      &:first-child {
        margin-top: 1.25em;
      }
    }
  }
}
</style>

