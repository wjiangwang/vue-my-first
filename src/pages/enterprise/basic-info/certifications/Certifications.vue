<template>
  <div class="page">
    <breadcrumb :items="[{ name: titleName }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false" v-loading="list.loading">
      <data-table :columns="tableColumns" style="margin-top: -20px;"
        :data="list.items"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        @page-size-change="handlePageSizeChange"
        @page-change="loadListData({ page: $event })">
        <template slot="toolbar">
          <div class="columns">
            <div class="left"></div>
            <div class="right">
              <el-button type="success"
                size="medium"
                v-if="!isRedirect"
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
            v-if="!isRedirect"
            @click="editCertificationForm.show({ id: row.id })">
            编辑
          </el-button>
          <el-button type="text"
            size="medium"
            class="warn"
            v-if="!isRedirect"
            @click="deleteCertification(row.id)">
            删除
          </el-button>
        </div>
      </data-table>

      <certifications-form ref="newCertificationForm" :certificate-type="certificateType"></certifications-form>
      <certifications-form ref="editCertificationForm" :certificate-type="certificateType"></certifications-form>
    </page-card>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import Breadcrumb from '@/components/Breadcrumb'
  import PageCard from '@/components/PageCard'
  import DataTable from '@/components/DataTable'
  import CertificationsForm from './CertificationsForm'

  const tableColumns = [
    { title: '证书名称', name: 'certificateName' },
    { title: '颁发部门', name: 'licenseOrg' },
    { title: '颁发日期', name: 'licenseDate', type: 'date' },
    { title: '证书到期时间', name: 'expirationTime', type: 'date' },
    { title: '操作', name: '__slot:actions' }
  ]

  export default {
    name: 'Certifications',
    components: {
      PageCard,
      Breadcrumb,
      DataTable,
      CertificationsForm
    },

    props: {
      titleName: {
        type: String
      },

      canEdit: {
        type: Boolean,
        default: false
      },

      certificateType: {
        type: String,
        default: 'ENTERPRISE'
      },

      isRedirect: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        tableColumns
      }
    },

    computed: {
      ...mapState('enterpriseCertification', ['list']),

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

    async created() {
      await this.setListParams({ certificateType: this.certificateType })
      await this.loadListData({ reset: true })
    }
  }
</script>

<style lang="scss" scoped>
.page-main /deep/ .card-body {
  padding: 20px 0 0 !important;
  display: flex;
  flex-direction: column;
}
</style>

