<template>
  <div class="page">
    <breadcrumb :items="[{ name: '管理端角色管理' }]"></breadcrumb>

    <div class="page-main">
      <page-card :scrollable="false" v-loading="loading">
        <div class="roles-container">
          <div class="roles">
            <div class="title">
              <div class="left">角色列表</div>
              <el-button type="success" size="small" @click="newRoleForm.show()">新增角色</el-button>
            </div>

            <scroll-view class="list">
              <div
                :class="{ role: true, active: role.selected }"
                v-for="role in roles"
                :key="role.id"
                @click="handleRoleClick(role.id)"
              >
                <div class="name">{{role.name}}</div>
                <div class="actions" v-if='role.id!==1'>
                  <a href="javascript:;" @click="editRoleForm.show(role.id)">
                    <img src="@/assets/icons/edit.png">
                  </a>
                  <a href="javascript:;" @click.stop="deleteRole(role.id)">
                    <img src="@/assets/icons/trash.png">
                  </a>
                </div>
              </div>
            </scroll-view>
          </div>

          <div class="permissions">
            <div class="title">权限</div>
            <el-table
              border
              stripe
              class="permission-table"
              :data="permissions"
              ref="permissionTable"
              @select="handlePermissionSelect"
              @selection-change="handlePermissionChange"
              height="200"
            >
              <el-table-column type="selection" width="48" align="center" :selectable='isSuperManagement'></el-table-column>

              <el-table-column label="菜单名称" prop="name" header-align="center">
                <template slot-scope="{ row }">
                  <span :class="['permission-name', `depth-${row.sort}`]">{{row.name}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </page-card>
    </div>

    <role-form ref="newRoleForm"></role-form>
    <role-form ref="editRoleForm"></role-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import ScrollView from '@/components/ScrollView'
import PageCard from '@/components/PageCard'
import RoleForm from './RoleForm'

export default {
  name: 'AdminRoles',

  components: {
    Breadcrumb,
    ScrollView,
    PageCard,
    RoleForm
  },

  data () {
    return {
      loading: true,
      superManagement: false
    }
  },

  computed: {
    ...mapState('adminRole', ['roles', 'permissions']),

    newRoleForm () {
      return this.$refs.newRoleForm
    },

    editRoleForm () {
      return this.$refs.editRoleForm
    }
  },

  methods: {
    ...mapMutations('adminRole', ['updateRoleSelected']),
    ...mapActions('adminRole', [
      'loadInitialData', 'loadRolePermissions', 'updateRolePermissions', 'delete'
    ]),

    isSuperManagement(){
      return !this.superManagement
    },

    async handleRoleClick (roleId) {
      this.superManagement = roleId === 1 ? true : false
      this.loading = true
      this.updateRoleSelected({ roleId })

      await this.loadRolePermissions(roleId)
      this.permissions.forEach(permission => {
        this.$refs.permissionTable.toggleRowSelection(permission, permission.selected)
      })

      this.loading = false
    },

    async handlePermissionSelect (selection, row) {
      if (this.loading) return
      const role = this.roles.find(role => role.selected)
      if (!role) return

      const selected = selection.findIndex(s => s.id === row.id) !== -1
      const selectedPermissions = selection.slice(0)

      switch (row.sort) {
        case 0:
          this.permissions.filter(p => p.parentId === row.id).forEach(p => {
            this.$refs.permissionTable.toggleRowSelection(p, selected)
            switch (selected) {
              case true:
                if (selectedPermissions.findIndex(s => s.id === p.id) === -1) {
                  selectedPermissions.push(p)
                }
                break

              case false:
                selectedPermissions.splice(selectedPermissions.findIndex(s => s.id === p.id), 1)
                break
            }
          })
          break

        case 1:
          const parentPermission = this.permissions.find(p => p.id === row.parentId)
          if (selected) {
            this.$refs.permissionTable.toggleRowSelection(parentPermission, true)
            selectedPermissions.push(parentPermission)
          } else {
            const isSiblings = selectedPermissions.findIndex(p => p.parentId === row.parentId) !== -1
            if (!isSiblings) {
              this.$refs.permissionTable.toggleRowSelection(parentPermission, false)
              selectedPermissions.splice(selectedPermissions.findIndex(s => s.id === parentPermission.id), 1)
            }
          }
          break
      }


      // if (row.code === 'system') {
      //   if (selected) {
      //     this.permissions.filter(p => p.sort === 1).forEach(p => {
      //       this.$refs.permissionTable.toggleRowSelection(p, true)
      //       if (selectedPermissions.findIndex(s => s.id === p.id) === -1) {
      //         selectedPermissions.push(p)
      //       }
      //     })
      //   } else {
      //     selection.filter(p => p.sort === 1).forEach(p => {
      //       this.$refs.permissionTable.toggleRowSelection(p, false)
      //       selectedPermissions.splice(selectedPermissions.findIndex(s => s.id === p.id), 1)
      //     })
      //   }
      // } else if (selected && row.sort === 1) {
      //   if (selection.findIndex(select => select.code === 'system') === -1) {

      //     const systemPermission = this.permissions.find(p => p.id === row.parentId)
      //    // const systemPermission = this.permissions.find(p => p.code === 'system')

      //     this.$refs.permissionTable.toggleRowSelection(systemPermission, true)
      //     selectedPermissions.push(systemPermission)
      //   }
      // }

      this.loading = true
      await this.updateRolePermissions({
        roleId: role.id,
        permissions: selectedPermissions
      })

      this.loading = false
    },

    async handlePermissionChange (selection) {
      if (this.loading) return

      const role = this.roles.find(role => role.selected)
      if (!role) return

      if (selection.length === 0 || selection.length === this.permissions.length) {
        this.loading = true

        await this.updateRolePermissions({
          roleId: role.id,
          permissions: selection
        })

        this.loading = false
      }
    },

    deleteRole (id) {
      this.$confirm('确认删除该角色？', '确认删除', {
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

  async created () {
    await this.loadInitialData()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.roles-container {
  display: flex;
  height: 100%;
}

.roles {
  width: 260px;
  height: 100%;
  border-right: 1px solid #ececec;
  flex-basis: 260px;
  flex-shrink: 0;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 10px 11px 0;
    border-bottom: 1px solid #eaeaea;

    .left {
      font-size: 16px;
      font-weight: 500;
      border-left: 4px solid #37a9fa;
      padding-left: 8px;
      line-height: 24px;
    }
  }

  .list {
    height: calc(100vh - 55px);

    .role {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 18px 7px 12px;
      cursor: pointer;

      &:hover,
      &.active {
        background: #d2eeff;
      }

      .name {
        flex: 1;
        font-size: 14px;
        color: #666;
      }

      .actions {
        a {
          display: inline-block;
          width: 28px;
          height: 28px;
          margin-left: 4px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.permissions {
  flex: 1;
  display: flex;
  flex-direction: column;

  .title {
    padding: 16px 14px;
    border-bottom: 1px solid #eaeaea;
    font-weight: 500;
  }

  .permission-table {
    border-top: 0;
    border-left: 0;
    flex: 1;

    .permission-name {
      @for $i from 1 through 9 {
        &.depth-#{$i} {
          margin-left: 20px * $i;
          position: relative;
          padding-left: 17px;

          &:before,
          &:after {
            content: "";
            width: 9px;
            height: 10px;
            border-left: 1px solid #9b9b9b;
            border-bottom: 1px solid #9b9b9b;
            position: absolute;
            margin-right: 17px;
            top: 0;
            left: 0;
          }

          &:after {
            top: 10px;
            height: 5px;
            border-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
