<template>
  <div class="page">
    <breadcrumb :items="breadcrumbItems"></breadcrumb>

    <div class="page-main">
      <page-card :scrollable="false"
        v-loading="list.loading">
        <data-table :columns="tableColumns"
          :data="list.items"
          :total="list.total"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadListData({ page: $event })"
          style="flex: 1;">
          <template slot="toolbar">
            <div class="columns">
              <div class="left">
                <el-form :inline="true" :model="searchForm" label-suffix=":">
                  <resource-input label="级别"
                    resource-name="sysControlLevel"
                    name="controlLevelId"
                    value-prop="value"
                    @input="searchForm.controlLevelId = $event">
                  </resource-input>
                  <string-input placeholder="请输入账号、昵称"
                    name="keywords"
                    @input="searchForm.keywords = $event">
                  </string-input>

                  <el-form-item>
                    <el-button type="primary"
                      icon="el-icon-search"
                      size="medium"
                      @click="search">
                      查询
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>

              <div class="right" v-if="!isRedirect">
                <el-button type="success"
                  size="medium"
                  @click="newUserForm.show()">
                  新增
                </el-button>
              </div>
            </div>
          </template>

          <template slot="status" slot-scope="{ row }">
            {{row.status === 1 ? '是' : '否'}}
          </template>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text"
              size="medium"
              v-if="!isRedirect"
              @click="editUserForm.show(row.id)">
              编辑
            </el-button>
            <el-button type="text"
              size="medium"
              class="warn"
              v-if="!isRedirect"
              @click="deleteUser(row.id)">
              删除
            </el-button>
          </div>
        </data-table>
      </page-card>
    </div>

    <user-form ref="newUserForm"
      :enterprise-id="enterpriseId">
    </user-form>

    <user-form ref="editUserForm"
      :enterprise-id="enterpriseId">
    </user-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import UserForm from './UserForm'

const tableColumns = [
  { title: '账号', name: 'account' },
  { title: '昵称', name: 'nickname' },
  { title: '电话', name: 'telephone' },
  { title: '邮箱', name: 'email' },
  { title: '启用', name: '__slot:status' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'EnterpriseUsers',

  components: {
    Breadcrumb,
    DataTable,
    PageCard,
    UserForm
  },

  props: {
    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      searchForm: {
        controlLevelId: null,
        keywords: null
      },

      tableColumns
    }
  },

  computed: {
    ...mapState('enterpriseUser', ['list']),
    breadcrumbItems() {
      if (window.__APP_EDITION__ === 'MANAGEMENT') {
        return [
          { name: '企业端用户管理', route: { name: 'enterprise-user-index', query: { reset: false } } },
          { name: `${this.$route.query.name}人员管理` }
        ]
      } else {
        return [{ name: '人员配置' }]
      }
    },

    enterpriseId() {
      return parseInt(this.$route.params.id, 10)
    },

    newUserForm() {
      return this.$refs.newUserForm
    },

    editUserForm() {
      return this.$refs.editUserForm
    }
  },

  methods: {
    ...mapMutations('enterpriseUser', ['setListParams', 'setListPageSize']),
    ...mapActions('enterpriseUser', ['loadListData', 'filterListData', 'delete']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
      this.filterListData(this.searchForm)
    },

    deleteUser(id) {
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
    }
  },

  created() {
    this.setListParams({ companyId: this.$route.params.id })
    this.loadListData({ reset: true })
  }
}
</script>
