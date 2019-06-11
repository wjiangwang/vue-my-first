<template>
  <div class="dashboard-carousel-item-content special-job-statistics">
    <template v-if="rows && rows.length > 0">
      <el-row v-for="(row, index) in rows"
        :key="index" :gutter="16" class="charts-row">
        <el-col :span="24 / columnCount"
          v-for="(item, itemIndex) in row" :key="itemIndex">
          <special-job-chart v-bind="item"></special-job-chart>
        </el-col>
      </el-row>
    </template>

    <div class="no-data" v-else>
      <img src="@/assets/icons/triangle-info.png">
      <div class="content">
        <div class="title">今日未进行实时作业</div>
      </div>
    </div>
  </div>
</template>

<script>
  import SpecialJobChart from './SpecialJobChart'

  export default {
    name: 'SpecialJobStatistics',

    components: {
      SpecialJobChart
    },

    props: {
      rows: {
        type: Array,
        default: () => []
      },

      columnCount: {
        type: Number,
        default: 2
      }
    }
  }
</script>

<style lang="scss" scoped>
  .special-job-statistics {
    display: flex;
    flex-direction: column;
    /*justify-content: space-between;*/
    margin-bottom: 0 !important;

    .charts-row {
      /deep/ > .el-col {
        margin-bottom: 20px;
        &:nth-child(2n) {
          padding-left: 10px;
        }
        &:nth-child(2n + 1) {
          padding-right: 10px;
        }
      }
    }

    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: rgba(76,76,76,1);
      font-size: 30px;
      margin-top: -30px;

      img {
        width: 126px;
        margin-right: 40px;
      }

      .content {
        background:linear-gradient(180deg, rgba(255,0,0,1) 0%, rgba(235,95,95,1) 100%);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }
    }
  }

  .screen-drop {
    .special-job-statistics {
      .no-data {
        font-size: 2em;
        line-height: 1.406;

        img {
          width: 13%;
        }
      }
    }
  }
</style>
