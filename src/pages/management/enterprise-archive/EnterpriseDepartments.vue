<template>
  <div v-loading="list.loading">
    <el-dialog :visible.sync="visible"
      title="部门组织"
      width="820px"
      :modal="true"
      @close="handleClose">
      <div class="toolbar">
        <div class="left"></div>
        <div class="right">
          <el-button type="success"
            size="small"

            @click="departmentForm.show()">
            新增
          </el-button>
        </div>
      </div>

      <el-table border stripe class="department-table"
        :data="list.items"
        ref="departmentTable"
        height="400">
        <el-table-column
          label="部门名称"
          prop="name">
          <template slot-scope="{ row }">
            <span :class="['department-name', `depth-${row.depth}`]">
              {{row.name}}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="部门描述"
          prop="description">
        </el-table-column>

        <el-table-column
          label="操作"
          width="120px">
          <div slot-scope="{ row }" class="table-actions">
            <el-button type="text"
              size="medium"
              @click="departmentForm.show(row.id)">
              编辑
            </el-button>
            <el-button type="text"
              size="medium"
              class="warn"
              @click="deleteDepartment(row.id)">
              删除
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </el-dialog>

    <department-form ref="departmentForm"
      :enterprise-id="enterpriseId">
    </department-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import DepartmentForm from './DepartmentForm'

export default {
  name: 'EnterpriseDepartments',

  components: {
    DepartmentForm
  },

  data() {
    return {
      visible: true
    }
  },

  computed: {
    ...mapState('enterpriseDepartment', ['list']),

    enterpriseId() {
      return parseInt(this.$route.params.id, 10)
    },

    departmentForm() {
      return this.$refs.departmentForm
    }
  },

  methods: {
    ...mapMutations('enterpriseDepartment', ['setListParams']),
    ...mapActions('enterpriseDepartment', ['loadListData', 'delete']),

    deleteDepartment(id) {
      this.$confirm('确认删除该部门组织？', '确认删除', {
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
    this.setListParams({ enterpriseId: this.enterpriseId })
    this.loadListData()
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    flex: 1;
  }

  .right {
    text-align: right;
    flex-shrink: 0;
  }
}

.department-table {
  .department-name {
    @for $i from 1 through 20 {
      &.depth-#{$i} {
        margin-left: 20px * $i;
        position: relative;
        padding-left: 17px;

        &:before, &:after {
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

  .table-actions .el-button--text {
    padding-top: 0;
    padding-bottom: 0;

    &.warn {
      color: #f56c6c;
      &:hover {
        color: #f78989;
      }
      &:active {
        color: #f56c6c;
      }
    }
  }
}
</style>
