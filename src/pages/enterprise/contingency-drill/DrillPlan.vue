<template>
  <div class="page">
    <div class="page-main" :scrollable="false" v-loading="list.loading">
      <data-table
        :columns="tableColumns"
        :data="list.items"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        @page-size-change="handlePageSizeChange"
        @page-change="loadListData({ page: $event })"
        style="flex: 1;"
      >
        <template slot="toolbar">
          <div class="columns">
            <div class="left">
              <el-form :inline="true" :model="searchForm" label-suffix=":">
                <date-range-input label="演练日期范围" name="dateRange" @input="dateRange = $event"></date-range-input>
                <string-input
                  placeholder="请输入计划名称"
                  name="keywords"
                  @input="searchForm.keywords = $event"
                ></string-input>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="right" v-if="!isManagement && !isRedirect">
              <el-button type="success" size="medium" @click="newDrillPlan.show()">新增</el-button>
            </div>
          </div>
        </template>

        <div slot="status" slot-scope="{ row }">{{row.status === 1 ? '已完成' : '未完成'}}</div>
        <div
          slot="planTime"
          slot-scope="{ row }"
        >{{timeDesc(row.startTime) + ' - ' + timeDesc(row.endTime)}}</div>

        <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button type="text" size="medium" @click="detailDrillPlan.show(row.id)">详情</el-button>
          <el-button
            type="text"
            size="medium"
            @click="editDrillPlan.show(row.id)"
            v-if="!isManagement && !isRedirect"
          >编辑</el-button>
          <el-button
            type="text"
            size="medium"
            class="warn"
            @click="deleteDrillPlan(row.id)"
            v-if="!isManagement && !isRedirect"
          >删除</el-button>
        </div>
      </data-table>
    </div>

    <drill-plan-form ref="newDrillPlan"></drill-plan-form>
    <drill-plan-form ref="editDrillPlan"></drill-plan-form>
    <drill-plan-form :readonly="true" ref="detailDrillPlan"></drill-plan-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import DrillPlanForm from './DrillPlanForm'
import dayjs from 'dayjs'

const tableColumns = [
  { title: '计划名称', name: 'exercisePlanName' },
  { title: '计划状态', name: '__slot:status' },
  { title: '计划演练时间', name: '__slot:planTime' },
  { title: '计划负责人', name: 'head' },
  { title: '负责人电话', name: 'headPhone' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'DrillPlan',

  components: {
    DataTable,
    PageCard,
    DrillPlanForm
  },

  props: {
    isManagement: {
      type: Boolean,
      default: false
    },

    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      dateRange: [],
      searchForm: {
        keywords: null,
      },
      tableColumns
    }
  },

  computed: {
    ...mapState('contingencyDrillPlan', ['list']),

    newDrillPlan () {
      return this.$refs.newDrillPlan
    },

    editDrillPlan () {
      return this.$refs.editDrillPlan
    },
    detailDrillPlan () {
      return this.$refs.detailDrillPlan
    }
  },

  methods: {
    ...mapMutations('contingencyDrillPlan', ['setListParams', 'setListPageSize']),
    ...mapActions('contingencyDrillPlan', ['loadListData', 'filterListData', 'delete']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      let [startAt, endAt] = this.dateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      Object.assign(this.searchForm, { startAt, endAt })
      this.filterListData(this.searchForm)
    },

    deleteDrillPlan (id) {
      this.$confirm('确认删除该装备？', '确认删除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })

            await this.delete(id)
            loading.close()
            done()
          } else {
            done()
          }
        }
      })
    },

    timeDesc (t) {
      return t ? dayjs(t).format('YYYY/MM/DD') : ''
    }
  },

  created () {
    if (this.isManagement) this.setListParams({ companyId: this.$route.params.enterpriseId })
    this.loadListData({ reset: true })
  }
}
</script>
