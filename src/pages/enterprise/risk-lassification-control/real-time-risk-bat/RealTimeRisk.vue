<template>
  <div class="page">
    <page-card class="page-main" :scrollable="false" v-loading="list.loading">
      <div class="teal-time-risk-assessments">
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
                  <string-input
                    placeholder="请输入二级编码、作业类型"
                    name="keywords"
                    :value="searchForm.keywords"
                    @input="searchForm.keywords = $event"
                    class="real-time-search"
                  ></string-input>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </template>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text" size="medium" @click="handleType(row.id, 'JHA')">详情</el-button>
            <!-- TODO: 啥台账 -->
            <el-button type="text" size="medium">台账</el-button>

            <el-button type="text" size="medium" @click="taskHistory.show(row.id)">作业历史</el-button>
            <!-- <el-button
              type="text"
              size="medium"
              @click="realTimeRiskForm.show(row.id)"
              v-if="!isRedirect"
            >编辑</el-button>
            <el-button
              type="text"
              size="medium"
              class="warn"
              @click="deleteRiskAssessment(row.id)"
              v-if="!isRedirect"
            >删除</el-button> -->
          </div>
        </data-table>
      </div>
    </page-card>

    <real-time-risk-form ref="realTimeRiskForm"></real-time-risk-form>
    <task-history ref="taskHistory"></task-history>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import RealTimeRiskForm from './RealTimeRiskForm'
import TaskHistory from './TaskHistory'

const tableColumns = [
  { title: '编码', name: 'twoCoding',width: '130px' },
  { title: '作业类型', name: 'name' },
  { title: '风险等级', name: '__slot:risk-level' },
  { title: '隐患排查', name: '__slot:risk', width: '120px' },
  { title: '作业状态', name: '__slot:status', width: '180px' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'RealTimeRisk',

  components: {
    PageCard,
    Breadcrumb,
    DataTable,
    RealTimeRiskForm,
    TaskHistory
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
      tableColumns: tableColumns,
      searchForm: {
        keywords: ''
      }
    }
  },

  computed: {
    ...mapState('realTimeRisk', ['list']),

    realTimeRiskForm () {
      return this.$refs.realTimeRiskForm
    },

    taskHistory () {
      return this.$refs.taskHistory
    }
  },

  methods: {
    ...mapMutations('realTimeRisk', ['setListPageSize']),
    ...mapActions('realTimeRisk', [
      'loadListData', 'filterListData', 'delete']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },

    deleteRiskAssessment (id) {
      this.$confirm('确认删除该作业类型？', '确认删除', {
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

    handleType (id, type) {
      this.$router.push({ path: id + '/realTime/items?type=' + type })
    }
  },

  async created () {
    const reset = this.$route.query.reset !== undefined ? this.$route.query.reset : true
    if (!reset) {
      this.searchForm.keywords = this.list.filterParams.keywords
    }

    this.loadListData({ reset })
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  border: 0;
  margin:0;
  /deep/ .card-body {
   // padding: 20px 0 0 !important;
    display: flex;
    flex-direction: column;
  }
}
.teal-time-risk-assessments {
  flex: 1;
  margin-top: -14px;
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.real-time-search {
  .el-form-item__content {
    .el-input {
      .el-input__inner {
        width: 190px;
      }
    }
  }
}
</style>

