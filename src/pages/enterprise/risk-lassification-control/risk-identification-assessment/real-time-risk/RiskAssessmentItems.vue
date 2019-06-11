<template>
  <div class="page risk-assessment-items">
    <div class="page-main" v-loading="list.loading">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/bell.png" class="icon">
          <h1>风险点名称：{{risk.riskName}}</h1>
          <h3 style="margin-left: 30px;">一级编码：{{risk.oneCoding}}</h3>
          <el-form :inline="true" :model="searchForm" size="small" class="form-container">
            <el-form-item>
              <el-select v-model="searchForm.riskLevel" placeholder="请选择风险等级" clearable>
                <el-option label="重大风险" value="1"></el-option>
                <el-option label="较大风险" value="2"></el-option>
                <el-option label="一般风险" value="3"></el-option>
                <el-option label="低风险" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
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
                <div class="right" v-if="">
                  <el-button type="success"
                    size="small"
                    v-if="isBackstage"
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
                v-if="canEdit && !isRedirect">
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
                v-if="!isRedirect"
                @click.stop="secondItemForm.show(row.id)">
                编辑
              </el-button>
              <el-button type="text"
                size="medium"
                class="warn"
                v-if="!isRedirect"
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
                <div class="right" v-if="">
                  <el-button type="success"
                    size="small"
                    v-if="isBackstage"
                    @click="showThirdItemNewForm">
                    新增
                  </el-button>
                </div>
              </div>
            </template>

            <template slot="level" slot-scope="{ row }">
              {{riskLevelText(row.riskLevel)}}
            </template>
            <template slot="risk-assessment-r" slot-scope="{ row }">
              {{row.riskAssessmentR}}
              <span v-if="row.minimumL < row.riskAssessmentL" style="color: #fa5878;">↑</span>
            </template>

            <div slot="actions" slot-scope="{ row }" class="table-actions">
              <el-button type="text"
                size="medium"
                @click.stop="thirdItemDetail.show(row.id)">
                详情
              </el-button>
              <!-- <el-button type="text"
                size="medium"
                @click.stop="thirdItemCaseForm.show(row)">
                示例
              </el-button> -->
              <el-button type="text"
                size="medium"
                @click.stop="thirdItemForm.show({ id: row.id })"
                v-if="isBackstage">
                编辑
              </el-button>
              <el-button type="text"
                size="medium"
                class="warn"
                @click="deleteItem(row.id, { third: true })"
                v-if="isBackstage">
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

    <risk-assessment-third-item-detail ref="thirdItemDetail"
      :second-item-id="currentSecondItem.id">
    </risk-assessment-third-item-detail>

    <risk-third-item-case-form ref="thirdItemCaseForm"
      :can-edit="canEdit" :is-redirect="isRedirect">
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
  import RiskAssessmentThirdItemDetail from './RiskAssessmentThirdItemDetail'
  import RiskThirdItemCaseForm from './RiskThirdItemCaseForm'

  const secondLevelColumns = [
    { title: '二级编码', name: 'twoCoding', width: '80px'},
    { title: '二级子项', name: 'name' },
    { title: '是否在产', name: '__slot:status', width: '140px' },
    { title: '操作', name: '__slot:actions', width: '110px' }
  ]

  const thirdLevelColumns = [
    { title: '三级编码', name: 'threeCoding', width: '80px'},
    { title: '三级子项', name: 'name', width: '160px' },
    { title: '风险描述', name: 'riskDescription'},
    { title: '风险等级', name: '__slot:level', width: '100px'},
    { title: '风险评估(R)', name: '__slot:risk-assessment-r', width: '110px' },
    { title: '管控级别', name: 'controlLevel', width: '100px' },
    { title: '操作', name: '__slot:actions', width: '160px' }
  ]

  export default {
    name: 'EnterpriseRiskAssessmentItems',

    components: {
      Breadcrumb,
      DataTable,
      RiskAssessmentForm,
      RiskAssessmentSecondItemForm,
      RiskAssessmentThirdItemForm,
      RiskThirdItemCaseForm,
      RiskAssessmentThirdItemDetail
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
      },

      isRedirect: {
        type: Boolean,
        default: false
      },

      isBackstage: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        secondLevelColumns: this.isBackstage ? secondLevelColumns : secondLevelColumns.slice(0, 3),
        thirdLevelColumns,

        currentSecondItem: {},
        searchForm: {
          riskLevel: ''
        }
      }
    },

    computed: {
      ...mapState('riskSecondItem', ['risk', 'list']),
      ...mapState('riskThirdItem', {
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

      thirdItemDetail() {
        return this.$refs.thirdItemDetail
      },

      thirdItemCaseForm() {
        return this.$refs.thirdItemCaseForm
      }
    },

    methods: {
      ...mapMutations('riskSecondItem', ['setListParams', 'setListPageSize']),
      ...mapActions('riskSecondItem', ['loadListData', 'delete', 'updateStatus', 'filterListData']),
      ...mapMutations('riskThirdItem', {
        setThirdListParams: 'setListParams',
        setThirdListPageSize: 'setListPageSize',
        setThirdListData: 'setListData'
      }),
      ...mapActions('riskThirdItem', {
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
          this.setThirdListParams({ twoSubprojectId: currentRow.id, riskLevel: this.searchForm.riskLevel })
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
            return '重大风险'
          case 2:
            return '较大风险'
          case 3:
            return '一般风险'
          case 4:
            return '低风险'
        }
      },

      search () {
        this.setThirdListData({
          total: 0, items: []
        })
        this.filterListData(this.searchForm)
      }
    },

    created() {
      this.setListParams({
        riskId: this.$route.params.id
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
        /*padding: 24px 20px;*/
        padding: 0px 20px;
        flex-direction: column;
        align-items: flex-start !important;
        position: relative;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        .name {
          display: flex;
          align-items: center;
          /*margin-bottom: 28px;*/

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

          .form-container {
            margin-left: 30px;
            /deep/ .el-form-item {
              margin-bottom: 0px;
            }
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
          /*width: 50%;*/
          &:first-child {
            margin-right: 10px;
            width: 30%;
          }
          &:last-child {
            width: calc(70% - 10px);
          }

          /deep/ .data-table {
            width: 100%;
          }
        }
      }
    }
  }
</style>
