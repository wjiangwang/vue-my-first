<template>
  <div class="hierarchy-count">
    <div class="hierarchy-count-checkboxes">
      <div class="label">层级设置</div>
      <div class="checkbox-group">
        <div :class="{ checkbox: true, selected: hierarchyCount === currentHierarchyCount }"
          v-for="hierarchyCount in hierarchyCounts"
          :key="hierarchyCount"
          @click="isRedirect ? '' : selectHierarchyCount(hierarchyCount)">
          <i class="el-icon-check"></i> {{hierarchyCount}}级
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Loading } from 'element-ui'

export default {
  name: 'HierarchyCount',

  props: {
    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      hierarchyCounts: [2, 3, 4]
    }
  },

  computed: {
    ...mapState('hierarchyCount', { currentHierarchyCount: 'hierarchyCount' })
  },

  methods: {
    ...mapActions('hierarchyCount', ['updateHierarchyCount']),

    selectHierarchyCount(hierarchyCount) {
      if (hierarchyCount === this.currentHierarchyCount) return

      this.$confirm(
        '修改层级后所有设置的岗位数据会清除，且有进行中的管控流程会全部逾期，确定要修改层级数？',
        '提示',
        {
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning',
          confirmButtonText: '确定修改',
          cancelButtonText: '再考虑一下',
          customClass: 'danger-confirm-dialog',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              const loading = Loading.service({
                target: instance.$el.querySelector('.el-message-box')
              })

              await this.updateHierarchyCount(hierarchyCount)
              loading.close()
              done()
            } else {
              done()
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.hierarchy-count-checkboxes {
  display: flex;
  align-items: center;

  .label {
    font-size: 15px;
    color: #333;
    line-height: 20px;
    margin-right: 20px;
  }

  .checkbox-group {
    display: flex;
    align-items: center;

    .checkbox {
      padding: 6px 30px;
      font-size: 14px;
      color: #666;
      line-height: 19px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      margin-right: 15px;
      border: 1px solid #E4E4E4;
      cursor: pointer;
      &:hover {
        background: #f6f7fb;
      }

      .el-icon-check {
        display: none;
        margin-right: 3px;
      }

      &.selected {
        background: #37A9FA;
        color: #fff;
        border-color: transparent;
        .el-icon-check {
          display: inline;
        }
      }
    }
  }
}

.confirm-dialog .content {
  display: flex;
  align-items: center;

  .el-icon-warning {
    color: #F7454A;
    font-size: 48px;
    margin: 0 16px 0 80px;
  }

  p {
    font-size: 14px;
    color: #333;
    line-height: 20px;
    margin: 0 43px 0 0;
  }
}
</style>

