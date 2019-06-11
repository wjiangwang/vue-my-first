<template>
  <div class="enterprise-certifications" v-loading="list.loading">
    <data-table :columns="tableColumns"
      :data="list.items"
      :total="list.total"
      :page-size="list.pageSize"
      :current-page="list.currentPage"
      @page-size-change="handlePageSizeChange"
      @page-change="loadListData({ page: $event })">
      <template slot="toolbar" v-if="canEdit">
        <div class="columns">
          <div class="left"></div>
          <div class="right">
            <el-button type="success"
              size="medium"
              @click="newCertificationForm.show()">
              新增
            </el-button>
          </div>
        </div>
      </template>

      <div slot="actions" slot-scope="{ row }" class="table-actions">
        <el-button type="text"
          size="medium"
          @click="editCertificationForm.show({ id: row.id, readonly: true })">
          详情
        </el-button>
        <el-button type="text"
          size="medium"
          @click="editCertificationForm.show({ id: row.id })"
          v-if="canEdit">
          编辑
        </el-button>
        <el-button type="text"
          size="medium"
          class="warn"
          @click="deleteCertification(row.id)"
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

    <certification-form ref="newCertificationForm"
      :enterprise-id="enterpriseId">
    </certification-form>
    <certification-form ref="editCertificationForm"
      :enterprise-id="enterpriseId">
    </certification-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import CertificationForm from './EnterpriseCertificationForm'

const tableColumns = [
  { type: 'selection', width: '48', align: 'center' },
  { title: '证书名称', name: 'certificateName' },
  { title: '颁发部门', name: 'licenseOrg' },
  { title: '颁发日期', name: 'licenseDate', type: 'date' },
  { title: '证书到期时间', name: 'expirationTime', type: 'date' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'EnterpriseCertifications',

  components: {
    DataTable,
    CertificationForm
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      tableColumns: this.canEdit ? tableColumns : tableColumns.slice(1)
    }
  },

  computed: {
    ...mapState('enterpriseCertification', ['list']),

    enterpriseId() {
      return parseInt(this.$route.params.id, 10)
    },

    newCertificationForm() {
      return this.$refs.newCertificationForm
    },

    editCertificationForm() {
      return this.$refs.editCertificationForm
    }
  },

  methods: {
    ...mapMutations('enterpriseCertification', ['setListParams', 'setListPageSize']),
    ...mapActions('enterpriseCertification', ['loadListData', 'delete']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    deleteCertification(id) {
      this.$confirm('确认删除该证件？', '确认删除', {
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

  created() {
    this.setListParams({ companyId: this.$route.params.id })
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.enterprise-certifications {
  flex: 1;
  margin-top: -14px;
  width: 100%;
}
</style>
