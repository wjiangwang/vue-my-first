<template>
  <div v-loading="list.loading">
    <el-dialog :visible.sync="visible"
      title="证书信息"
      width="820px"
      :modal="true"
      @close="handleClose">
      <data-table :columns="tableColumns"
        :data="list.items"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        :height="400"
        @page-size-change="handlePageSizeChange"
        @page-change="loadListData({ page: $event })"
        class="certificate-table">
        <template slot="toolbar">
          <div class="columns">
            <div class="left">
              <el-form :inline="true"
                :model="searchForm"
                label-suffix=":"
                size="small">
                <resource-input label="证件类型"
                  name="certificateType"
                  resource-name="certificateType"
                  @input="searchForm.certificateType = $event">
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
            <div class="right" v-if="canEdit">
              <el-button type="success"
                size="small"
                @click="certificateForm.show()">
                新增
              </el-button>
            </div>
          </div>  
        </template>

        <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button type="text"
            size="medium"
            @click="certificateForm.show({ id: row.id, readonly: true })">
            详情
          </el-button>
          <el-button type="text"
            size="medium"
            @click="certificateForm.show({ id: row.id })"
            v-if="canEdit">
            编辑
          </el-button>
          <el-button type="text"
            size="medium"
            class="warn"
            @click="deleteCertificate(row.id)"
            v-if="canEdit">
            删除
          </el-button>
        </div>
      </data-table>
    </el-dialog>

    <employee-certificate-form ref="certificateForm" :employee-id="employeeId">
    </employee-certificate-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import EmployeeCertificateForm from './EmployeeCertificateForm'

const tableColumns = [
  { title: '证书名称', name: 'certificateName' },
  { title: '证书类型', name: 'certificateType' },
  { title: '过期时间', name: 'expirationTime', type: 'date' },
  { title: '证书状态', name: 'status' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'EnterpriseEmployeeCertificates',

  components: {
    DataTable,
    EmployeeCertificateForm
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      visible: true,
      tableColumns,
      searchForm: {
        certificateType: null,
        keywords: null
      }
    }
  },

  computed: {
    ...mapState('employeeCertificate', ['list']),

    employeeId() {
      return parseInt(this.$route.params.employeeId, 10)
    },

    certificateForm() {
      return this.$refs.certificateForm
    }
  },

  methods: {
    ...mapMutations('employeeCertificate', ['setListParams', 'setListPageSize']),
    ...mapActions('employeeCertificate', ['loadListData', 'filterListData', 'delete']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
      this.filterListData(this.searchForm)
    },

    deleteCertificate(id) {
      this.$confirm('确认删除该证书信息？', '确认删除', {
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

    handleClose() {
      this.$router.go(-1)
    }
  },

  created() {
    this.setListParams({ personId: this.$route.params.employeeId })
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.certificate-table {
  margin: -20px -15px;
}

.certificate-table.data-table /deep/ .table {
  border-left-width: 1px;
}
</style>
