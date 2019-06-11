<template>
  <div class="page risk-assessment-items">
    <breadcrumb :items="breadcrumbItems"></breadcrumb>

    <div class="page-main" v-loading="list.loading">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/bell.png" class="icon">
          <h1>风险点名称：{{risk.riskName}}</h1>
        </div>
        <div class="detail">
          <ul>
            <li>
              <span class="label">一级编码:</span>
              <span class="value">{{risk.oneCoding}}</span>
            </li>
            <li>
              <span class="label">辨识人:</span>
              <span class="value">{{risk.identifyPerson}}</span>
            </li>
            <li>
              <span class="label">辨识日期:</span>
              <span class="value">{{risk.identifyDate | strftime}}</span>
            </li>
            <li>
              <span class="label">审核人:</span>
              <span class="value">{{risk.auditor}}</span>
            </li>
            <li>
              <span class="label">审核日期:</span>
              <span class="value">{{risk.auditDate | strftime}}</span>
            </li>
          </ul>
        </div>

        <div class="actions" v-if="canEdit">
          <a href="javascript:;" class="edit" @click="riskAssessmentForm.show($route.params.id)">
            <img src="@/assets/icons/square-edit.png">
          </a>
        </div>
      </div>

      <div class="content-box">
        <div class="el-card is-never-shadow">
          <data-table :columns="secondLevelColumns"
            :data="list.items"
            :total="list.total"
            :page-size="list.pageSize"
            :current-page="list.currentPage"
            @page-size-change="handlePageSizeChange"
            @page-change="loadListData({ page: $event })"
            :highlight-current-row="true"
            @current-change="handleRowChange">
            <template slot="toolbar">
              <div class="columns">
                <div class="left">
                  二级项列表
                </div>
                <div class="right" v-if="canEdit">
                  <el-button type="success"
                    size="small"

                    @click="secondItemForm.show()">
                    新增
                  </el-button>
                </div>
              </div>
            </template>

            <div class="status" slot="status" slot-scope="{ row: { id, status } }"
              @click="$event.stopPropagation()">
              <el-radio-group size="mini"
                :value="status"
                @input="updateStatus({ id, status: $event })"
                v-if="canEdit">
                <el-radio-button :label="1">在产</el-radio-button>
                <el-radio-button :label="0">停产</el-radio-button>
              </el-radio-group>
              <span v-else :style="{ color: status === 1 ? '#666666' : '#FA5878' }">
                {{status === 1 ? '在产' : '停产'}}
              </span>
            </div>

            <div slot="actions" slot-scope="{ row }" class="table-actions" v-if="canEdit">
              <el-button type="text"
                size="medium"
                @click.stop="secondItemForm.show(row.id)">
                编辑
              </el-button>
              <el-button type="text"
                size="medium"
                class="warn"
                @click.stop="deleteItem(row.id)">
                删除
              </el-button>
            </div>
          </data-table>
        </div>

        <div class="el-card is-never-shadow" v-loading="thirdList.loading">
          <data-table :columns="thirdLevelColumns"
            :data="thirdList.items"
            :total="thirdList.total"
            :page-size="thirdList.pageSize"
            :current-page="thirdList.currentPage"
            @page-size-change="handleThirdPageSizeChange"
            @page-change="loadThirdListData({ page: $event })">
            <template slot="toolbar">
              <div class="columns">
                <div class="left">
                  三级项列表
                </div>
                <div class="right" v-if="canEdit">
                  <el-button type="success"
                    size="small"

                    @click="showThirdItemNewForm">
                    新增
                  </el-button>
                </div>
              </div>
            </template>

            <template slot="level" slot-scope="{ row }">
              {{riskLevelText(row.riskLevel)}}
            </template>

            <div slot="actions" slot-scope="{ row }" class="table-actions">
              <el-button type="text"
                size="medium"
                @click.stop="thirdItemForm.show({ id: row.id, readonly: true })">
                详情
              </el-button>
              <el-button type="text"
                size="medium"
                @click.stop="thirdItemCaseForm.show(row)">
                示例
              </el-button>
              <el-button type="text"
                size="medium"
                @click.stop="thirdItemForm.show({ id: row.id })"
                v-if="canEdit || (!canEdit && row.isSystem === 'N')">
                编辑
              </el-button>
              <el-button type="text"
                size="medium"
                class="warn"
                @click="deleteItem(row.id, { third: true })"
                v-if="canEdit || (!canEdit && row.isSystem === 'N')">
                删除
              </el-button>
            </div>
          </data-table>
        </div>
      </div>
    </div>

    <risk-assessment-form
      ref="riskAssessmentForm"
      :from-sub-level="true"
      :enterprise-id="parseInt(this.$route.params.enterpriseId, 10)"
      @submitted="loadListData">
    </risk-assessment-form>

    <risk-assessment-second-item-form ref="secondItemForm"
      :risk-id="riskId"
      :type="$route.query.type">
    </risk-assessment-second-item-form>

    <risk-assessment-third-item-form ref="thirdItemForm"
      :second-item-id="currentSecondItem.id"
      :type="$route.query.type">
    </risk-assessment-third-item-form>

    <risk-third-item-case-form ref="thirdItemCaseForm"
      :can-edit="canEdit">
    </risk-third-item-case-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import DataTable from '@/components/DataTable'
import RiskAssessmentForm from './RiskAssessmentForm'
import RiskAssessmentSecondItemForm from './RiskAssessmentSecondItemForm'
import RiskAssessmentThirdItemForm from './RiskAssessmentThirdItemForm'
import RiskThirdItemCaseForm from './RiskThirdItemCaseForm'

const secondLevelColumns = [
  { title: '二级编码', name: 'twoCoding' },
  { title: '二级子项', name: 'name' },
  { title: '是否在产', name: '__slot:status', width: '140px' },
  { title: '操作', name: '__slot:actions', width: '110px' }
]

const thirdLevelColumns = [
  { title: '三级编码', name: 'threeCoding' },
  { title: '三级子项', name: 'name' },
  { title: '级别', name: '__slot:level' },
  { title: '操作', name: '__slot:actions', width: '190px' }
]

export default {
  name: 'EnterpriseRiskAssessmentItems',

  components: {
    Breadcrumb,
    DataTable,
    RiskAssessmentForm,
    RiskAssessmentSecondItemForm,
    RiskAssessmentThirdItemForm,
    RiskThirdItemCaseForm
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    },

    breadcrumbs: {
      type: Array,
      default() { return [] }
    },

    isGroup: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      secondLevelColumns: this.canEdit ? secondLevelColumns : secondLevelColumns.slice(0, 3),
      thirdLevelColumns,

      currentSecondItem: {}
    }
  },

  computed: {
    ...mapState('enterpriseRiskSecondItem', ['risk', 'list']),
    ...mapState('enterpriseRiskThirdItem', {
      thirdList: 'list'
    }),

    breadcrumbItems() {
      if (this.breadcrumbs.length && this.breadcrumbs[0].route.path) {
        this.breadcrumbs[0].route.path = this.$resolveRoutePath(this.breadcrumbs[0].route.path)
      }
      return this.breadcrumbs.length ? this.breadcrumbs : [
        this.isGroup ? { name: '一企一档', route: { name: 'enterprise-archive', query: { reset: false } } } : { name: '一企一档', route: { name: 'enterprise-archives', query: { reset: false } } },
        {
          name: '企业详情',
          route: {
            name: 'enterprise-risk-assessments',
            params: { id: this.$route.params.enterpriseId },
            query: { reset: false }
          }
        },
        {
          name: this.$route.query.type === 'JHA' ?
            '风险辨识评估表（JHA+LEC）' : '安全检查辨识表（SCL+LS）'
        }
      ]
    },

    riskId() {
      return parseInt(this.$route.params.id, 10)
    },

    riskAssessmentForm() {
      return this.$refs.riskAssessmentForm
    },

    secondItemForm() {
      return this.$refs.secondItemForm
    },

    thirdItemForm() {
      return this.$refs.thirdItemForm
    },

    thirdItemCaseForm() {
      return this.$refs.thirdItemCaseForm
    }
  },

  methods: {
    ...mapMutations('enterpriseRiskSecondItem', ['setListParams', 'setListPageSize']),
    ...mapActions('enterpriseRiskSecondItem', ['loadListData', 'delete', 'updateStatus']),
    ...mapMutations('enterpriseRiskThirdItem', {
      setThirdListParams: 'setListParams',
      setThirdListPageSize: 'setListPageSize',
      setThirdListData: 'setListData'
    }),
    ...mapActions('enterpriseRiskThirdItem', {
      loadThirdListData: 'loadListData',
      deleteThirdItem: 'delete'
    }),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    handleThirdPageSizeChange(pageSize) {
      this.setThirdListPageSize(pageSize)
      this.loadThirdListData()
    },

    handleRowChange(currentRow) {
      this.currentSecondItem = currentRow || {}

      if (currentRow) {
        this.setThirdListParams({ twoSubprojectId: currentRow.id })
        this.loadThirdListData()
      } else {
        this.setThirdListData({
          total: 0, items: []
        })
      }
    },

    showThirdItemNewForm() {
      if (this.currentSecondItem.id) {
        this.thirdItemForm.show()
      } else {
        this.$alert('请选择二级项', '提示')
      }
    },

    deleteItem(id, { third = false } = {}) {
      this.$confirm(`确认删除该${third ? '三级项' : '二级项'}？`, '确认删除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })

            third ? await this.deleteThirdItem(id) : await this.delete(id)
            loading.close()
            done()
          } else {
            done()
          }
        }
      })
    },

    riskLevelText(level) {
      switch (level) {
      case 1:
        return '重大隐患'
      case 2:
        return '较大风险'
      case 3:
        return '一般风险'
      case 4:
        return '低风险'
      }
    }
  },

  created() {
    this.setListParams({
      riskId: this.$route.params.id,
      type: this.$route.query.type
    })
    this.setThirdListData({
      total: 0, items: []
    })
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.risk-assessment-items {
  box-sizing: border-box;

  .page-main {
    display: flex;
    flex-direction: column;

    > .el-card {
      margin: 20px 0 0 20px;
      padding: 24px 20px;
      flex-direction: column;
      align-items: flex-start !important;
      position: relative;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      .name {
        display: flex;
        align-items: center;
        margin-bottom: 28px;

        .icon {
          width: 34px;
          height: 34px;
          margin-right: 8px;
        }

        h1 {
          font-size: 22px;
          line-height: 30px;
          margin: 0;
        }
      }

      .detail {
        font-size: 13px;
        color: #333;
        line-height: 17px;

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            display: inline-block;
            margin-right: 30px;
          }
        }
      }

      .actions {
        position: absolute;
        top: 14px;
        right: 35px;

        .edit img {
          width: 19px;
          height: 18px;
        }
      }
    }

    > .content-box {
      flex: 1;
      display: flex;
      padding: 10px 0 0 20px;

      .el-card {
        display: flex;
        width: 50%;
        &:first-child {
          margin-right: 10px;
        }

        /deep/ .data-table {
          width: 100%;
        }
      }
    }
  }
}
</style>
