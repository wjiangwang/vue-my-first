<template>
  <div class="hidden-danger-controls" v-loading="list.loading">
    <data-table
      :columns="tableColumns"
      :data="list.items"
      :total="list.total"
      :page-size="list.pageSize"
      :current-page="list.currentPage"
      @page-size-change="handlePageSizeChange"
      @page-change="loadListData({ page: $event })"
    >
      <template slot="toolbar">
        <div class="columns">
          <div class="left">
            <el-form :inline="true" :model="searchForm" label-suffix=":" size="small">
              <select-input
                label="级别"
                name="level"
                @input="searchForm.level = $event"
                :collection="riskLevelSelectOptions"
              ></select-input>
              <select-input
                label="状态"
                name="status"
                @input="searchForm.status = $event"
                :collection="statusSelectOptions"
              ></select-input>
              <date-range-input
                label="整改时间"
                name="dateRange"
                @input="searchForm.dateRange = $event"
              ></date-range-input>
              <string-input label="隐患名称" name="keywords" @input="searchForm.keywords = $event"></string-input>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="right"></div>
        </div>
      </template>

      <template slot="level" slot-scope="{ row }">
        <span
          :class="['level', `level-${row.hiddenDangerLevel}` ]"
        >{{levelText(row.hiddenDangerLevel)}}</span>
      </template>

      <template slot="status" slot-scope="{ row }">
        <span
          :class="['status', `status-${row.hiddenDangerStatus}` ]"
        >{{statusText(row.hiddenDangerStatus)}}</span>
      </template>

      <div slot="actions" slot-scope="{ row }" class="table-actions">
        <el-button type="text" size="medium" @click="controlDetail.show(row.id)">查看</el-button>
      </div>
    </data-table>

    <hidden-danger-control-detail ref="controlDetail"></hidden-danger-control-detail>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import DataTable from '@/components/DataTable'
import HiddenDangerControlDetail from './HiddenDangerControlDetail'
import dayjs from 'dayjs'

const tableColumns = [
  { title: '隐患名称', name: 'hiddenDangerName' },
  { title: '隐患级别', name: '__slot:level' },
  { title: '隐患状态', name: '__slot:status' },
  { title: '整改期限', name: 'rectificationDate', type: 'date' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'HiddenDangerControls',

  components: {
    DataTable,
    HiddenDangerControlDetail
  },

  data () {
    return {
      tableColumns,
      riskLevelSelectOptions: [
        { label: '重大隐患', value: 1 },
        { label: '一般隐患', value: 2 }
      ],
      statusSelectOptions: [
        { label: '待确定', value: 0 },
        { label: '等待整改', value: 1 },
        { label: '整改完成', value: 2 }
      ],
      searchForm: {
        keywords: null,
        dateRange: [],
        level: null,
        status: null
      }
    }
  },

  computed: {
    ...mapState('hiddenDangerControl', ['list']),

    controlDetail () {
      return this.$refs.controlDetail
    }
  },

  methods: {
    ...mapMutations('hiddenDangerControl', ['setListPageSize', 'setListParams']),
    ...mapActions('hiddenDangerControl', ['loadListData', 'filterListData']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      let [startAt, endAt] = this.searchForm.dateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      this.filterListData({
        keywords: this.searchForm.keywords,
        level: this.searchForm.level,
        status: this.searchForm.status,
        startAt, endAt
      })
    },

    levelText (level) {
      switch (level) {
        case 1:
          return '重大隐患'
        case 2:
          return '一般隐患'
        default:
          return '无'
      }
    },

    statusText (status) {
      switch (status) {
        case 0:
          return '待确定'
        case 1:
          return '等待整改'
        case 2:
          return '整改完成'
      }
    }
  },

  created () {
    this.setListParams({
      riskAssessmentId: this.$route.params.id
    })
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.hidden-danger-controls {
  flex: 1;
  margin-top: -14px;
  width: 100%;

  .columns {
    .left {
      /deep/ .el-form .el-form-item {
        margin-bottom: 10px !important;
        &:nth-last-child(-n + 2) {
          margin-bottom: 0 !important;
        }
      }
    }

    .right {
      align-self: flex-end !important;
    }
  }

  .level {
    &.level-1 {
      color: #fea340;
    }

    &.level-2 {
      color: #f4d341;
    }
  }

  .status {
    &.status-3 {
      color: #3add75;
    }
  }
}
</style>
