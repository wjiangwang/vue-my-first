<template>
  <div class="plan-card-form" v-loading="list.loading">
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
              <!-- <date-range-input label="编制时间" name="dateRange" @input="dateRange = $event"></date-range-input> -->
              <string-input
                label
                placeholder="请输入名称"
                name="keywords"
                @input="searchForm.keywords = $event"
              ></string-input>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="right" v-if="isEdit && !isRedirect">
            <el-button type="success" @click="newPlanCardForm.show()" size="medium">新增</el-button>
          </div>
        </div>
      </template>

      <div class="disposal-card-num" slot="disposalCardNum" slot-scope="{ row }">{{row.id}}</div>
      <div slot="actions" slot-scope="{ row }" class="table-actions">
        <el-button type="text" size="medium" @click="planCardDetail.show(row.id)">查看</el-button>
        <el-button
          type="text"
          v-if="isEdit && !isRedirect"
          size="medium"
          @click="editPlanCardForm.show(row.id)"
        >编辑</el-button>
        <el-button
          type="text"
          v-if="isEdit && !isRedirect"
          size="medium"
          @click="deletePlanCard(row.id)"
          class="warn"
        >删除</el-button>
      </div>
    </data-table>

    <plan-card-form-detail :readonly="true" ref="planCardDetail"></plan-card-form-detail>
    <plan-card-form-detail ref="newPlanCardForm"></plan-card-form-detail>
    <plan-card-form-detail ref="editPlanCardForm"></plan-card-form-detail>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PlanCardFormDetail from './PlanCardFormDetail'
import dayjs from 'dayjs'

const tableColumns = [
  { title: '处置卡名称', name: 'disposalCardName' },
  { title: '持卡人数', name: '__slot:disposalCardNum' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'PlanCardForm',

  components: {
    DataTable,
    PlanCardFormDetail
  },

  props: {
    isEdit: {
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
      tableColumns,
      dateRange: [],
      searchForm: {
        keywords: null,
      },
    }
  },

  computed: {
    ...mapState('contingencyPlanCard', ['list']),

    planCardDetail () {
      return this.$refs.planCardDetail
    },
    newPlanCardForm () {
      return this.$refs.newPlanCardForm
    },

    editPlanCardForm () {
      return this.$refs.editPlanCardForm
    },
  },

  methods: {
    ...mapMutations('contingencyPlanCard', ['setListParams', 'setListPageSize']),
    ...mapActions('contingencyPlanCard', [
      'loadListData', 'filterListData', 'delete', 'update', 'removeControls', 'updateStatus'
    ]),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      let [startAt, endAt] = this.dateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      this.filterListData({
        keywords: this.searchForm.keywords,
        startAt, endAt
      })
    },

    deletePlanCard (id) {
      this.$confirm('确认删除该应急处置卡？', '确认删除', {
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
    }
  },

  created () {
    this.setListParams({ riskAssessmentId: 789 })
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.plan-card-form {
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

  .disposal-card-num {
    color: #fea340;
  }
}
</style>
