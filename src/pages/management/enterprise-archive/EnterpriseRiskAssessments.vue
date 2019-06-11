<template>
  <div class="enterprise-risk-assessments" v-loading="list.loading">
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
              <string-input
                placeholder="请输入名称、一级编码"
                name="keywords"
                :value="searchForm.keywords"
                @input="searchForm.keywords = $event">
              </string-input>

              <el-form-item>
                <el-button type="primary"
                  icon="el-icon-search"
                  @click="search">
                  查询
                </el-button>
              </el-form-item>

              <el-form-item v-if="canEdit">
                <el-button type="danger"
                icon="el-icon-delete"
                @click="cleanRiskControls">
                  清空管控记录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="right" v-if="canEdit">
            <el-button type="text"
              size="medium"
              class="button-image-icon"
              @click="riskAssessmentImportForm.show()">
              <img src="@/assets/icons/file-xls.png" class="icon">
              导入
            </el-button>
            <el-button type="success"
              size="medium"
              @click="riskAssessmentForm.show()">
              新增
            </el-button>
          </div>
        </div>
      </template>

      <div class="risk-level" slot="risk-level" slot-scope="{ row }">
        <span class="count first">{{row.oneRisk}}</span>
        <span class="count second">{{row.twoRisk}}</span>
        <span class="count third">{{row.threeRisk}}</span>
        <span class="count fourth">{{row.fourRisk}}</span>
      </div>

      <div class="risk" slot="risk" slot-scope="{ row }">
        <div class="wrapper first">
          <span class="triangle"></span>
          <span class="count">{{row.majorHidden}}</span>
        </div>
        <div class="wrapper second">
          <span class="triangle"></span>
          <span class="count">{{row.generalHidden}}</span>
        </div>
      </div>

      <div class="qrcode" slot="qrcode" slot-scope="{ row }">
        <el-popover
          placement="top"
          title="查看二维码"
          width="200"
          trigger="hover"
          popper-class="risk-qrcode-preview-popover">
          <img :src="row.qrCode" class="qrcode-preview">
          <img :src="row.qrCode" slot="reference">
        </el-popover>
      </div>

      <div class="status" slot="status" slot-scope="{ row: { id, status } }">
        <el-radio-group size="mini"
          :value="status"
          @input="handleStatusChange(id, $event)"
          v-if="canEdit">
          <el-radio-button :label="1">在产</el-radio-button>
          <el-radio-button :label="0">停产</el-radio-button>
        </el-radio-group>
        <span v-else :style="{ color: status === 1 ? '#666666' : '#FA5878' }">
          {{status === 1 ? '在产' : '停产'}}
        </span>
      </div>

      <div slot="actions" slot-scope="{ row }" class="table-actions">
        <el-button type="text"
          size="medium"
          @click="$router.push({ name: 'enterprise-risk-items', params: { enterpriseId, id: row.id }, query: { type: 'JHA' } })">
          JHA
        </el-button>
        <el-button type="text"
          size="medium"
          @click="$router.push({ name: 'enterprise-risk-items', params: { enterpriseId, id: row.id }, query: { type: 'SCL' } })">
          SCL
        </el-button>
        <el-button type="text"
          size="medium"
          @click="riskThirdItemCases.show(row.id)">
          示例
        </el-button>
        <el-button type="text"
          size="medium"
          @click="riskAssessmentForm.show(row.id)"
          v-if="canEdit">
          编辑
        </el-button>
        <el-button type="text"
          size="medium"
          class="warn"
          @click="deleteRiskAssessment(row.id)"
          v-if="canEdit">
          删除
        </el-button>
      </div>
    </data-table>

    <risk-assessment-form
      ref="riskAssessmentForm"
      :enterprise-id="enterpriseId">
    </risk-assessment-form>
    <risk-assessment-import-form
      ref="riskAssessmentImportForm"
      :enterprise-id="enterpriseId"
      @import-success="loadListData()">
    </risk-assessment-import-form>

    <risk-third-item-cases ref="riskThirdItemCases"></risk-third-item-cases>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import RiskAssessmentForm from './RiskAssessmentForm'
import RiskAssessmentImportForm from './RiskAssessmentImportForm'
import RiskThirdItemCases from './RiskThirdItemCases'

const tableColumns = [
  { title: '一级编码', name: 'oneCoding' },
  { title: '风险点名称', name: 'riskName' },
  { title: '风险等级', name: '__slot:risk-level' },
  { title: '隐患排查', name: '__slot:risk', width: '120px' },
  { title: '二维码', name: '__slot:qrcode', width: '100px' },
  { title: '是否在产', name: '__slot:status', width: '140px' },
  { title: '操作', name: '__slot:actions', width: '230px' }
]

export default {
  name: 'EnterpriseRiskAssessments',

  components: {
    DataTable,
    RiskAssessmentForm,
    RiskAssessmentImportForm,
    RiskThirdItemCases
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      tableColumns: tableColumns,

      searchForm: {
        keywords: null
      }
    }
  },

  computed: {
    ...mapState('regionalRisk', ['list']),

    enterpriseId() {
      return parseInt(this.$route.params.id, 10)
    },

    riskAssessmentForm() {
      return this.$refs.riskAssessmentForm
    },

    riskAssessmentImportForm() {
      return this.$refs.riskAssessmentImportForm
    },

    riskThirdItemCases() {
      return this.$refs.riskThirdItemCases
    }
  },

  methods: {
    ...mapMutations('regionalRisk', ['setListParams', 'setListPageSize']),
    ...mapActions('regionalRisk', [
      'loadListData', 'filterListData', 'delete', 'update', 'removeControls', 'updateStatus'
    ]),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
      this.filterListData(this.searchForm)
    },

    deleteRiskAssessment(id) {
      this.$confirm('确认删除该风险点？', '确认删除', {
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

    cleanRiskControls() {
      this.$confirm('确认清空管控数据？', '确认清空', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })

            await this.removeControls(this.$route.params.id)
            loading.close()
            done()

            this.$message({
              message: '管控数据清空成功',
              type: 'success'
            })
          } else {
            done()
          }
        }
      })
    },

    handleStatusChange(id, status) {
      this.updateStatus({ id, status })
    }
  },

  created() {
    this.setListParams({ companyId: this.$route.params.id })

    const reset = this.$route.query.reset !== undefined ? this.$route.query.reset : true
    if (!reset) {
      this.searchForm.keywords = this.list.filterParams.keywords
    }

    this.loadListData({ reset })
  }
}
</script>

<style lang="scss" scoped>
.enterprise-risk-assessments {
  flex: 1;
  margin-top: -14px;
  width: 100%;

  .risk-level {
    .count {
      width: 25px;
      height: 25px;
      margin-right: 5px;
      color: #fff;
      display: inline-block;
      text-align: center;
      line-height: 25px;
      font-size: 13px;

      &.first {
        background: #FA5878;
      }

      &.second {
        background: #FEA340;
      }

      &.third {
        background: #F4D341;
      }

      &.fourth {
        background: #37A9FA;
      }
    }
  }

  .risk {
    display: flex;
    align-items: center;

    .wrapper {
      margin-right: 10px;
      position: relative;
      width: 25px;
      height: 25px;

      .triangle {
        position: absolute;
        top: -12.5px;
        width: 0;
        height: 0;
        border: 12.5px solid transparent;
      }

      &.first .triangle {
        border-bottom: 25px solid#FEA340;
      }

      &.second .triangle {
        border-bottom: 25px solid #F4D341;
      }

      .count {
        position: absolute;
        color: #fff;
        line-height: 25px;
        top: 5px;
        width: 100%;
        text-align: center;
        font-size: 13px;
      }
    }
  }

  .qrcode {
    img {
      width: 25px;
      height: 25px;
    }
  }
}
</style>

<style lang="scss">
.risk-qrcode-preview-popover {
  img.qrcode-preview {
    width: 100%;
  }
}
</style>

