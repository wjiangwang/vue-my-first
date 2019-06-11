<template>
  <el-dialog
    title="作业历史"
    :visible.sync="visible"
    @close="clear"
    class="task-history-records-dialog"
  >
    <data-table
      :height="400"
      v-loading="historyList.loading"
      :columns="tableColumns"
      :data="historyList.items"
      :total="historyList.total"
      :page-size="historyList.pageSize"
      :current-page="historyList.currentPage"
      @page-size-change="handlePageSizeChange"
      @page-change="loadHistory({ page: $event })"
      :show-bottom-bar="false"
    >
      <template slot="status" slot-scope="{ row }">
        <!-- TODO: 详情接口 -->
        <el-button type="text" size="medium" @click="controlDetail.show(row.id)">详情</el-button>
        <!-- <span :class="['status', `status-${row.status}` ]">
          {{statusText(row.status)}}
        </span>-->
      </template>
    </data-table>
    <risk-control-detail ref="controlDetail"></risk-control-detail>
  </el-dialog>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RiskControlDetail from '@/pages/management/risk/RiskControlDetail'
import PageCard from '@/components/PageCard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'

const tableColumns = [
  { title: '作业时间', name: 'createDate', type: 'date' },
  { title: '作业地点', name: 'riskName' },
  { title: '作业类型', name: 'twoName' },
  { title: '作业岗位', name: 'structureName' },
  { title: '操作', name: '__slot:status' }
]

export default {
  name: 'TaskHistory',

  components: {
    PageCard,
    Breadcrumb,
    DataTable,
    RiskControlDetail
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
      visible: false,
      tableColumns: tableColumns,
      searchForm: {
        keywords: ''
      }
    }
  },

  computed: {
    ...mapState('realTimeRisk', ['historyList']),

    controlDetail () {
      return this.$refs.controlDetail
    }
  },

  methods: {
    ...mapMutations('realTimeRisk', ['setHistoryListPageSize']),
    ...mapActions('realTimeRisk', [
      'loadHistory']),

    async show (id) {
      this.visible = true
      await this.loadHistory(id)
    },

    handlePageSizeChange (pageSize) {
      this.setHistoryListPageSize(pageSize)
      this.loadHistory()
    },

    statusText (status) {
      switch (status) {
        case 1:
          return '已完成'
        case 2:
          return '逾期'
        default:
          return '进行中'
      }
    },

    clear () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.task-history-records-dialog {
  .el-dialog {
    width: 1000px;
    .data-table {
      .toolbar {
        display: none;
      }
      .table {
        border-left-width: 1px;
      }
    }
  }
}
</style>
