<template>
  <div class="page">
    <breadcrumb :items="[{ name: '管理端用户管理' }]"></breadcrumb>

    <div class="page-main">
      <page-card :scrollable="false">
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
                  <resource-input label="角色"
                    resource-name="sysRole"
                    name="roleId"
                    value-prop="value"
                    @input="searchForm.roleId = $event">
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

              <div class="right">
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
              @click="editUserForm.show(row.id)">
              编辑
            </el-button>
            <el-button type="text"
              size="medium"
              @click="changePasswordForm.show(row.id)">
              重置密码
            </el-button>
            <el-button type="text"
              size="medium"
              class="warn"
              @click="deleteUser(row.id)">
              删除
            </el-button>
          </div>
        </data-table>
      </page-card>
    </div>

    <user-form ref="newUserForm"></user-form>
    <user-form ref="editUserForm"></user-form>
    <change-password-form ref="changePasswordForm" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import UserForm from './UserForm'
import ChangePasswordForm from './ChangePasswordForm'

const tableColumns = [
  { title: '账号', name: 'account' },
  { title: '昵称', name: 'nickname' },
  { title: '电话', name: 'telephone' },
  { title: '邮箱', name: 'email' },
  { title: '启用', name: '__slot:status' },
  { title: '角色', name: 'roleName' },
  { title: '区域', name: 'riskDistrictName' },
  { title: '操作', name: '__slot:actions', width: '200px' }
]

export default {
  name: 'AdminUsers',

  components: {
    Breadcrumb,
    DataTable,
    PageCard,
    UserForm,
    ChangePasswordForm
  },

  data() {
    return {
      searchForm: {
        roleId: null,
        keywords: null
      },
      
      tableColumns
    }
  },

  computed: {
    ...mapState('adminUser', ['list']),

    newUserForm() {
      return this.$refs.newUserForm
    },

    editUserForm() {
      return this.$refs.editUserForm
    },

    changePasswordForm() {
      return this.$refs.changePasswordForm
    }
  },

  methods: {
    ...mapMutations('adminUser', ['setListParams', 'setListPageSize']),
    ...mapActions('adminUser', ['loadListData', 'filterListData', 'delete']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
      this.filterListData(this.searchForm)
    },

    deleteUser(id) {
      this.$confirm('确认删除该管理人员？', '确认删除', {
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
    this.loadListData({ reset: true })
  }
}
</script>
