<template>
  <div class="enterprise-employees" v-loading="list.loading">
    <data-table :columns="tableColumns"
      :data="list.items"
      :total="list.total"
      :page-size="list.pageSize"
      :current-page="list.currentPage"
      @page-size-change="handlePageSizeChange"
      @page-change="loadListData({ page: $event })">
      <template slot="toolbar">
        <div class="columns">
          <div class="left">
            <el-form :inline="true"
              :model="searchForm"
              label-suffix=":"
              size="small">
              <resource-input label="学历"
                name="education"
                resource-name="educationBackground"
                @input="searchForm.education = $event">
              </resource-input>
              <resource-input label="状态"
                name="status"
                resource-name="companyStatus"
                @input="searchForm.status = $event">
              </resource-input>
              <string-input label="姓名"
                name="keywords"
                @input="searchForm.keywords = $event">
              </string-input>

              <el-form-item>
                <el-button type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="search">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="right">
            <el-button type="text"
              size="medium"
              class="button-image-icon"
              :loading="exporting"
              @click="exportEmployees">
              <img src="@/assets/icons/file-xls.png" class="icon">
              导出
            </el-button>
            <el-button type="primary"
              size="medium"
              @click="$router.push({ name: 'enterprise-departments' })"
              v-if="canEditDepartments">
              部门组织
            </el-button>
            <el-button type="success"
              size="medium"

              @click="newEmployeeForm.show()"
              v-if="canEdit">
              新增
            </el-button>
          </div>
        </div>
      </template>

      <div slot="actions" slot-scope="{ row }" class="table-actions">
        <el-button type="text"
          size="medium"
          @click="$router.push({ name: 'enterprise-employee-certificates', params: { employeeId: row.id } })">
          证书
        </el-button>
        <el-button type="text"
          size="medium"
          @click="editEmployeeForm.show({ id: row.id, readonly: true })">
          详情
        </el-button>
        <el-button type="text"
          size="medium"
          @click="editEmployeeForm.show({ id: row.id })"
          v-if="canEdit">
          编辑
        </el-button>
        <el-button type="text"
          size="medium"
          class="warn"
          @click="deleteEmployee(row.id)"
          v-if="canEdit">
          删除
        </el-button>
      </div>

      <template slot="bottom-left-bar" v-if="false">
        <el-button size="small">
          批量删除
        </el-button>
      </template>
    </data-table>

    <employee-form ref="newEmployeeForm" :enterprise-id="enterpriseId"></employee-form>
    <employee-form ref="editEmployeeForm" :enterprise-id="enterpriseId"></employee-form>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import EmployeeForm from './EnterpriseEmployeeForm'

const tableColumns = [
  { type: 'selection', width: '48', align: 'center' },
  { title: '姓名', name: 'name' },
  { title: '性别', name: 'sex' },
  { title: '民族', name: 'national' },
  { title: '学历', name: 'education' },
  { title: '年龄', name: 'age' },
  { title: '籍贯', name: 'nativePlace' },
  { title: '操作', name: '__slot:actions', width: '210px' }
]

export default {
  name: 'EnterpriseEmployees',

  components: {
    DataTable,
    EmployeeForm
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    },
    canEditDepartments: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      searchForm: {},
      exporting: false,
      tableColumns
    }
  },

  computed: {
    ...mapState('enterpriseEmployee', ['list']),

    enterpriseId() {
      return parseInt(this.$route.params.id, 10)
    },

    newEmployeeForm() {
      return this.$refs.newEmployeeForm
    },

    editEmployeeForm() {
      return this.$refs.editEmployeeForm
    }
  },

  methods: {
    ...mapMutations('enterpriseEmployee', ['setListParams', 'setListPageSize']),
    ...mapActions('enterpriseEmployee', ['loadListData', 'filterListData', 'delete', 'export']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
      this.filterListData(this.searchForm)
    },

    deleteEmployee(id) {
      this.$confirm('确认删除该企业人员？', '确认删除', {
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

    async exportEmployees() {
      this.exporting = true

      const response = await this.export({ enterpriseId: this.$route.params.id })
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/vnd.ms-excel' })
      )
      const link = document.createElement('a')

      const disposition = response.headers['content-disposition']
      let filename = '企业人员信息'
      if (disposition) {
          const matches = disposition.match(/filename="(.+)"/)
          if (matches.length === 2) filename = matches[1]
      }

      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      this.exporting = false
    }
  },

  created() {
    this.setListParams({ companyId: this.$route.params.id })
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.enterprise-employees {
  flex: 1;
  margin-top: -14px;
  width: 100%;

  .columns {
    .left {
      flex-basis: 860px !important;
      flex-grow: unset !important;
    }

    .right {
      align-self: flex-end !important;
    }
  }
}
</style>
