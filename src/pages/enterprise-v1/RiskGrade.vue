<template>
  <div class="page">
    <breadcrumb :items="[{ name: '整体风险' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <div class="table-wrapper">
        <el-table class="table"
          :data="items"
          size="small"
          :border="true"
          :span-method="mergeCells"
          height="200">
          <el-table-column label="类别" prop="typeName"></el-table-column>
          <el-table-column label="项目" prop="projectName"></el-table-column>
          <el-table-column label="评估内容" prop="name" min-width="300px"></el-table-column>
          <el-table-column label="扣分/加分" width="80px">
            <span slot-scope="{ row }" :class="{ score: true, positive: row.isPoints === 0 }">
              <template v-if="row.isPoints === 0">加分</template>
              <template v-else>扣分</template>
            </span>
          </el-table-column>
          <el-table-column label="分值"
            :render-header="renderScoreHeader"
            width="140px">
            <template slot-scope="{ row }">
              <el-input type="number"
                :value="row.score"
                size="mini"
                @input="updateItemScore({ itemId: row.id, score: $event })"
                v-if="editable">
              </el-input>
              <span v-else
                :class="{ score: true, positive: row.isPoints === 0 }">
                {{row.score}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="form-buttons" slot="footer" v-if="editable">
        <el-button type="primary"
          size="small"
          style="width: 90px;"
          :loading="submitting"
          @click="submit">
          提交
        </el-button>
      </div>
    </page-card>

    <div class="attachment">
      <img src="@/assets/icons/attachment.png">
      <span class="filename">整体风险参考文件.docx</span>
      <a href="https://shuangkong.oss-cn-qingdao.aliyuncs.com/%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3%E6%96%87%E4%BB%B6%2F%E6%95%B4%E4%BD%93%E9%A3%8E%E9%99%A9.docx"
        target="_blank"
        class="el-button el-button--text el-button--medium">
        <span>点击下载</span>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'EnterpriseRiskGrade',

  components: {
    PageCard,
    Breadcrumb
  },

  data() {
    return {
      submitting: false
    }
  },

  computed: {
    ...mapState('enterpriseRiskGrade', ['loading', 'items', 'totalScore', 'editable'])
  },

  methods: {
    ...mapMutations('enterpriseRiskGrade', ['updateItemScore']),
    ...mapActions('enterpriseRiskGrade', ['loadData', 'updateScore']),

    async submit() {
      try {
        const confirmed = await this.$confirm('提交后不可修改，确定提交？', '提示', {
          type: 'info'
        })

        if (confirmed === 'confirm') {
          this.submitting = true
          await this.updateScore()

          this.submitting = false
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        }
      } catch (error) {}
    },

    mergeCells({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const items = this.items.filter(item => item.typeId === row.typeId)
        const itemIndex = items.findIndex(item => item.id === row.id)

        if (itemIndex === 0) {
          return { rowspan: items.length, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      } else if (columnIndex === 1) {
        const items = this.items.filter(item => item.projectId === row.projectId)
        const itemIndex = items.findIndex(item => item.id === row.id)

        if (itemIndex === 0) {
          return { rowspan: items.length, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },

    renderScoreHeader(h, { column }) {
      if (!this.loading) {
        let color
        if (this.totalScore >= 90) {
          color = '#37A9FA'
        } else if (this.totalScore >= 75) {
          color = '#F4D341'
        } else if (this.totalScore >= 60) {
          color = '#FEA340'
        } else {
          color = '#FA5878'
        }

        return h('span', [
          column.label,
          '（总分：',
          h('span', { style: { color } }, `${this.totalScore}`),
          '）'
        ])
      }
    }
  },

  created() {
    this.loadData(this.$route.params.id)
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table {
  flex: 1;
  width: 100%;
  border-left-width: 0;
  border-top-width: 0;

  /deep/ thead th {
    background: #f5f7fa;
  }

  /deep/ .el-table__body-wrapper {
    min-height: 400px;
  }

  .score {
    color: #FEA340;

    &.positive {
      color: #59D987;
    }
  }
}

.page {
  position: relative;

  .attachment {
    position: absolute;
    top: 18px;
    right: 20px;
    z-index: 2;
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 16px;
      margin-right: 8px;
    }

    .filename {
      font-size: 13px;
      color: #666;
      margin-right: 8px;
    }

    a.el-button {
      font-size: 13px;
      text-decoration: none;
      padding: 0;
    }
  }
}
</style>

