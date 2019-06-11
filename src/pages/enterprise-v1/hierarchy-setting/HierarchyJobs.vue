<template>
  <div class="hierarchy-jobs" v-loading="jobsLoading">
    <div class="new-job-action">
      <el-button type="text" @click="showHierarchyJobNewForm">
        <i class="el-icon-plus"></i> 添加{{hierarchyName}}
      </el-button>
    </div>

    <el-tabs type="card" :closable="true"
      v-model="selectedJobId"
      @tab-remove="handleTabRemove">
      <el-tab-pane v-for="job in jobs"
        :key="job.id"
        :name="`${job.id}`"
        class="job-tables-panel">
        <span slot="label" class="tab-label">
          <span class="icon">
            <template v-if="job.structureType === 2">
              <img src="@/assets/icons/regulator.png">
              <img src="@/assets/icons/regulator-highlight.png" class="highlight">
            </template>
            <template v-else>
              <img src="@/assets/icons/timer.png">
              <img src="@/assets/icons/timer-highlight.png" class="highlight">
            </template>
          </span>
          {{job.name}}
          <i class="el-icon-edit" title="编辑" @click.stop="showHierarchyJobEditForm(job)"></i>
        </span>
        <el-row>
          <el-col :span="12">
            <data-table :columns="employeeColumns"
              :data="employeeList.items"
              :total="employeeList.total"
              :page-size="employeeList.pageSize"
              :current-page="employeeList.currentPage"
              @page-size-change="handleEmployeePageSizeChange"
              @page-change="loadEmployeeListData({ page: $event })"
              v-loading="employeeList.loading">
              <template slot="toolbar">
                <div class="columns">
                  <div class="left">
                    {{hierarchyName}}员工
                  </div>
                  <div class="right">
                    <el-button type="danger"
                      size="small"
                      @click="confirmDeleteAllEmployees"
                      v-if="employeeList.items.length > 0">
                      一键移除
                    </el-button>
                    <el-button type="success"
                      size="small"
                      @click="showEmployeeAssignForm">
                      分配员工
                    </el-button>
                  </div>
                </div>
              </template>

              <div slot="actions" slot-scope="{ row }" class="table-actions">
                <el-button type="text"
                  size="medium"
                  class="warn"
                  @click="deleteAssignedEmployee(row.id)">
                  移除
                </el-button>
              </div>
            </data-table>
          </el-col>
          <el-col :span="12" v-if="!hierarchyChanging">
            <data-table v-if="hierarchy === 1"
              :columns="job.structureType === 2 ? realtimeJobColumns : riskColumns"
              :data="riskList.items"
              :total="riskList.total"
              :page-size="riskList.pageSize"
              :current-page="riskList.currentPage"
              @page-size-change="handleRiskPageSizeChange"
              @page-change="loadRiskListData({ page: $event })"
              v-loading="riskList.loading">
              <template slot="toolbar">
                <div class="columns">
                  <div class="left">
                    {{hierarchyName}}{{job.structureType === 2 ? '实时作业' : '风险点'}}
                  </div>
                  <div class="right">
                    <el-button type="danger"
                      size="small"
                      @click="confirmDeleteAllRisks"
                      v-if="riskList.items.length > 0">
                      一键移除
                    </el-button>
                    <el-button type="success"
                      size="small"
                      @click="showRiskAssignForm">
                      {{job.structureType === 2 ? '分配实时作业' : '分配风险点'}}
                    </el-button>
                  </div>
                </div>
              </template>

              <div slot="level" slot-scope="{ row }">
                {{row.riskLevel | riskLevel}}
              </div>

              <div slot="actions" slot-scope="{ row }" class="table-actions">
                <el-button type="text"
                  size="medium"
                  class="warn"
                  @click="deleteAssignedRisk(row.id)">
                  移除
                </el-button>
              </div>
            </data-table>

            <data-table v-else
              :columns="childHierarchyColumns"
              :data="childList.items"
              :total="childList.total"
              :page-size="childList.pageSize"
              :current-page="childList.currentPage"
              @page-size-change="handleChildPageSizeChange"
              @page-change="loadChildListData({ page: $event })"
              v-loading="childList.loading">
              <template slot="toolbar">
                <div class="columns">
                  <div class="left">
                    管理{{childHierarchyName}}
                  </div>
                  <div class="right">
                    <el-button type="success"
                      size="small"
                      @click="showChildAssignForm">
                      分配{{childHierarchyName}}
                    </el-button>
                  </div>
                </div>
              </template>

              <div slot="actions" slot-scope="{ row }" class="table-actions">
                <el-button type="text"
                  size="medium"
                  class="warn"
                  @click="deleteAssignedChild(row.id)">
                  移除
                </el-button>
              </div>
            </data-table>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <hierarchy-job-form :hierarchy="hierarchy"
      ref="hierarchyJobForm"
      @updated="loadTablesData" />

    <assign-form :job-id="parseInt(selectedJobId, 10)"
      assignable-type="employee"
      ref="employeeAssignForm" />

    <assign-form :job-id="parseInt(selectedJobId, 10)"
      assignable-type="risk"
      ref="riskAssignForm"
      v-if="hierarchy === 1" />
    <assign-form :child-hierarchy="childHierarchy"
      :job-id="parseInt(selectedJobId, 10)"
      assignable-type="jobChild"
      ref="childAssignForm"
      v-else />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import HierarchyJobForm from './HierarchyJobForm'
import AssignForm from './AssignForm'

const employeeColumns = [
  { title: '账号', name: 'account' },
  { title: '昵称', name: 'nickname' },
  { title: '电话', name: 'telephone' },
  { title: '操作', name: '__slot:actions', width: '70px' }
]

const riskColumns = [
  { title: '编号', name: 'threeCoding' },
  { title: '三级子项', name: 'name' },
  { title: '级别', name: '__slot:level' },
  { title: '操作', name: '__slot:actions', width: '70px' }
]

const realtimeJobColumns = [
  { title: '编号', name: 'threeCoding' },
  { title: '作业类型', name: 'name' },
  { title: '操作', name: '__slot:actions', width: '70px' }
]

export default {
  name: 'HierarchyJobs',

  components: {
    DataTable,
    HierarchyJobForm,
    AssignForm
  },

  props: {
    hierarchy: Number
  },

  data() {
    return {
      selectedJobId: '0',
      employeeColumns,
      riskColumns,
      realtimeJobColumns,
      hierarchyChanging: false
    }
  },

  computed: {
    ...mapState('hierarchyCount', ['hierarchyCount']),
    ...mapState('hierarchyJob', { jobsLoading: 'loading', jobs: 'items' }),
    ...mapState('hierarchyJobEmployee', { employeeList: 'list' }),
    ...mapState('hierarchyJobRisk', { riskList: 'list' }),
    ...mapState('hierarchyJobChild', { childList: 'list' }),

    hierarchyName() {
      switch (this.hierarchy) {
      case 1:
        return '岗位'
      case 2:
        return '班组'
      case 3:
        return '部门'
      case 4:
        return '公司'
      }
    },

    childHierarchy() {
      switch (this.hierarchy) {
      case 2:
        return 1
      case 3:
        switch (this.hierarchyCount) {
        case 3:
          return 1
        case 4:
          return 2
        }
      case 4:
        switch (this.hierarchyCount) {
        case 2:
          return 1
        case 3:
          return 3
        case 4:
          return 3
        }
      }
    },

    childHierarchyName() {
      switch (this.childHierarchy) {
      case 1:
        return '岗位'
      case 2:
        return '班组'
      case 3:
        return '部门'
      }
    },

    childHierarchyColumns() {
      return [
        { title: this.childHierarchyName, name: 'name' },
        { title: '操作', name: '__slot:actions' }
      ]
    }
  },

  methods: {
    ...mapActions('hierarchyJob', { loadJobs: 'loadListData', deleteJob: 'delete' }),
    ...mapActions('hierarchyJobEmployee', {
      loadEmployeeListData: 'loadListData',
      deleteEmployee: 'delete',
      deleteAllEmployees: 'deleteAll'
    }),
    ...mapMutations('hierarchyJobEmployee', {
      setEmployeeListParams: 'setListParams',
      setEmployeeListPageSize: 'setListPageSize'
    }),
    ...mapActions('hierarchyJobRisk', {
      loadRiskListData: 'loadListData',
      deleteRisk: 'delete',
      deleteAllRisks: 'deleteAll'
    }),
    ...mapMutations('hierarchyJobRisk', {
      setRiskListParams: 'setListParams',
      setRiskListPageSize: 'setListPageSize'
    }),
    ...mapActions('hierarchyJobChild', {
      loadChildListData: 'loadListData',
      deleteChild: 'delete'
    }),
    ...mapMutations('hierarchyJobChild', {
      setChildListParams: 'setListParams',
      setChildListPageSize: 'setListPageSize'
    }),

    async loadData() {
      await this.loadJobs({ hierarchy: this.hierarchy })
    },

    loadTablesData() {
      if (this.selectedJobId) {
        this.setEmployeeListParams({ jobId: this.selectedJobId })
        this.loadEmployeeListData()

        if (this.hierarchy === 1) {
          this.setRiskListParams({ jobId: this.selectedJobId })
          this.loadRiskListData()
        } else {
          this.setChildListParams({ jobId: this.selectedJobId })
          this.loadChildListData()
        }
      }
    },

    showHierarchyJobNewForm() {
      this.$refs.hierarchyJobForm.show()
    },

    showHierarchyJobEditForm(job) {
      this.$refs.hierarchyJobForm.show(job)
    },

    handleTabRemove(jobId) {
      const job = this.jobs.find(job => job.id === parseInt(jobId, 10))

      this.$confirm(
        `删除${job.name}后，所有针对${job.name}设置的数据都会清除且无法恢复，确定删除${job.name}？`,
        '提示',
        {
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning',
          confirmButtonText: '确定删除',
          confirmButtonClass: 'el-button--danger',
          customClass: 'danger-confirm-dialog',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              const loading = Loading.service({
                target: instance.$el.querySelector('.el-message-box')
              })

              await this.deleteJob({ id: jobId, hierarchy: this.hierarchy })
              loading.close()
              done()
            } else {
              done()
            }
          }
        }
      )
    },

    deleteAssignedEmployee(id) {
      this.deleteAssignable({
        params: { id, jobId: this.selectedJobId },
        methodName: 'deleteEmployee',
        message: `确认移除该${this.hierarchyName}员工？`
      })
    },

    deleteAssignedRisk(id) {
      const job = this.jobs.find(job => job.id === parseInt(this.selectedJobId, 10))
      this.deleteAssignable({
        params: { id, jobId: this.selectedJobId },
        methodName: 'deleteRisk',
        message: job && job.structureType === 2 ? '确认移除该岗位实时作业？' : '确认移除该岗位风险点？'
      })
    },

    deleteAssignedChild(id) {
      this.deleteAssignable({
        params: { id },
        methodName: 'deleteChild',
        message: `确认移除该${this.childHierarchyName}？`
      })
    },

    confirmDeleteAllEmployees() {
      this.deleteAssignable({
        params: { jobId: this.selectedJobId },
        methodName: 'deleteAllEmployees',
        message: '确认移除全部员工？'
      })
    },

    confirmDeleteAllRisks() {
      const job = this.jobs.find(job => job.id === parseInt(this.selectedJobId, 10))
      this.deleteAssignable({
        params: { jobId: this.selectedJobId },
        methodName: 'deleteAllRisks',
        message: job && job.structureType === 2 ? '确认移除全部实时作业？' : '确认移除全部风险点？'
      })
    },

    deleteAssignable({ params, methodName, message }) {
      this.$confirm(message, '确认移除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })

            await this[methodName](params)
            loading.close()
            done()
          } else {
            done()
          }
        }
      })
    },

    handleEmployeePageSizeChange(pageSize) {
      this.setEmployeeListPageSize(pageSize)
      this.loadEmployeeListData()
    },

    handleRiskPageSizeChange(pageSize) {
      this.setRiskListPageSize(pageSize)
      this.loadRiskListData()
    },

    handleChildPageSizeChange(pageSize) {
      this.setChildListPageSize(pageSize)
      this.loadChildListData()
    },

    showEmployeeAssignForm() {
      this.$refs.employeeAssignForm.show()
    },

    showRiskAssignForm() {
      this.$refs.riskAssignForm.show()
    },

    showChildAssignForm() {
      this.$refs.childAssignForm.show()
    }
  },

  created() {
    this.loadData()
  },

  watch: {
    async '$route'() {
      this.hierarchyChanging = true
      await this.loadData()
      this.hierarchyChanging = false
    },

    jobs(jobs) {
      this.selectedJobId = jobs.length ? `${jobs[0].id}` : null
    },

    selectedJobId(jobId) {
      if (parseInt(jobId, 10)) this.loadTablesData()
    }
  }
}
</script>

<style lang="scss" scoped>
.hierarchy-jobs {
  position: relative;
  height: 100%;

  .new-job-action {
    position: absolute;
    right: 0;
    z-index: 1;
  }

  /deep/ .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      padding-right: 80px;

      .el-tabs__item:focus.is-active.is-focus:not(:active) {
        box-shadow: none;
      }

      .el-tabs__item {
        .tab-label {
          .icon {
            img {
              width: 13px;
              height: 13px;
              vertical-align: middle;
              margin-top: -2px;
            }
            img.highlight {
              display: none;
            }
          }

          .el-icon-edit {
            width: 0;
            overflow: hidden;
            margin-left: 5px;
            font-size: 12px;
            vertical-align: middle;
            transition: all .3s cubic-bezier(.645,.045,.355,1);
          }
        }

        &.is-active, &:hover {
          .tab-label {
            .icon img {
              display: none;
              &.highlight {
                display: inline;
              }
            }

            .el-icon-edit {
              width: 14px;
            }
          }
        }
      }
    }

    .el-tabs__content {
      flex: 1;
    }
  }

  .job-tables-panel {
    position: relative;
    height: 100%;
    &:before {
      content: ' ';
      display: block;
      position: absolute;
      left: 50%;
      top: -15px;
      bottom: 0;
      border-left: 1px solid #E3E3E3;
    }

    .el-row {
      height: 100%;

      .el-col {
        height: 100%;
      }

      .el-col:first-child {
        padding-right: 20px;
      }

      .el-col:last-child {
        padding-left: 20px;
      }
    }

    /deep/ .data-table {
      .toolbar {
        padding-left: 0;
        padding-right: 0;

        .columns .left {
          font-size: 14px;
          color: #666666;
          line-height: 19px;
        }
      }

      .bottom-bar {
        padding-right: 0;
        .el-pagination {
          padding-right: 0;

          .el-pagination__total {
            margin-right: 0;
          }
        }
      }

      /deep/ .table {
        border-left-width: 1px;
      }
    }
  }
}
</style>

