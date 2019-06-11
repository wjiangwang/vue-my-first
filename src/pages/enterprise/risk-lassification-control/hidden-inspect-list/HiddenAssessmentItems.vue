<template>
  <div class="page risk-assessment-items">
    <breadcrumb :items="[{ name: '隐患排查清单',route:{ name: 'hidden-inspect-list'}},{name:'详情'}]"></breadcrumb>

    <div class="page-main" v-loading="list.loading">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/bell.png" class="icon">
          <h1>隐患排查区域名称：{{risk.riskName}}</h1>
          <h3 style="margin-left: 30px;">一级编码：{{risk.oneCoding}}</h3>
          <el-form :inline="true" :model="searchForm" size="small" class="form-container">
            <el-form-item>
              <el-select v-model="searchForm.hiddenLevel" placeholder="请选择排查方式" clearable>
                <el-option label="日常隐患排查" value="1"></el-option>
                <el-option label="综合隐患排查" value="2"></el-option>
                <el-option label="专业隐患排查" value="3"></el-option>
                <el-option label="季节隐患排查" value="4"></el-option>
                <el-option label="全厂隐患排查" value="5"></el-option>
                <el-option label="重大及节假日隐患排查" value="6"></el-option>
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
          <data-table
            :columns="secondLevelColumns"
            :data="list.items"
            :total="list.total"
            :page-size="list.pageSize"
            :current-page="list.currentPage"
            @page-size-change="handlePageSizeChange"
            @page-change="loadListData({ page: $event })"
            :highlight-current-row="true"
            @current-change="handleRowChange"
          >
            <template slot="toolbar">
              <div class="columns">
                <div class="left">二级项列表</div>
                <div class="right" v-if="canEdit">
                </div>
              </div>
            </template>

             <div class="status" slot="status" slot-scope="{ row: { id, status } }"
              @click="$event.stopPropagation()">
              <span :style="{ color: status === 1 ? '#666666' : '#FA5878' }">
                {{status === 1 ? '在产' : '停产'}}
              </span>
            </div>
          </data-table>
        </div>

        <div class="el-card is-never-shadow" v-loading="thirdList.loading">
          <data-table
            :columns="thirdLevelColumns"
            :data="thirdList.items"
            :total="thirdList.total"
            :page-size="thirdList.pageSize"
            :current-page="thirdList.currentPage"
            @page-size-change="handleThirdPageSizeChange"
            @page-change="loadThirdListData({ page: $event })"
          >
            <template slot="toolbar">
              <div class="columns">
                <div class="left">三级项列表</div>
                <div class="right" v-if="canEdit">
                </div>
              </div>
            </template>

            <template slot="control-period" slot-scope="{ row }">
              {{controlPeriodDesc(row.controlPeriod)}}
            </template>

            <template slot="level" slot-scope="{ row }">
              {{hiddenLevelText(row.hiddenJudgeLevel)}}
            </template>

            <div slot="actions" slot-scope="{ row }" class="table-actions">
              <el-button
                type="text"
                size="medium"
                @click.stop="thirdItemDetail.show(row.id)"
              >详情</el-button>
            </div>
          </data-table>
        </div>
      </div>
    </div>

     <hidden-third-item-detail
      ref="thirdItemDetail"
      :second-item-id="currentSecondItem.id"
      :type="$route.query.type"
    ></hidden-third-item-detail>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import Breadcrumb from '@/components/Breadcrumb'
  import DataTable from '@/components/DataTable'
  import HiddenThirdItemDetail from './HiddenThirdItemDetail'

  const secondLevelColumns = [
    { title: '二级编码', name: 'twoCoding', width: '80px'},
    { title: '排查项目', name: 'name' },
    { title: '是否在产', name: '__slot:status', width: '140px' },
  ]

  const thirdLevelColumns = [
    { title: '三级编码', name: 'threeCoding', width: '80px' },
    { title: '排查内容', name: 'name', width: '200px' },
    { title: '排查标准', name: 'identifyEvaluationStandard' },
    { title: '排查方式', name: '__slot:control-period', width: '120px' },
    { title: '隐患级别', name: '__slot:level' , width: '100px'},
    { title: '操作', name: '__slot:actions', width: '100px' }
  ]

  export default {
    name: 'HiddenAssessmentItems',

    components: {
      Breadcrumb,
      DataTable,
      HiddenThirdItemDetail
    },

    props: {
      canEdit: {
        type: Boolean,
        default: true
      },

      breadcrumbs: {
        type: Array,
        default () { return [] }
      },

      isGroup: {
        type: Boolean,
        default: false
      },

      isRedirect: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        secondLevelColumns: this.canEdit ? secondLevelColumns : secondLevelColumns.slice(0, 3),
        thirdLevelColumns,

        currentSecondItem: {},
        searchForm: {
          hiddenLevel: ''
        }
      }
    },

    computed: {
      ...mapState('riskSecondItem', ['risk', 'list']),
      ...mapState('riskThirdItem', {
        thirdList: 'list'
      }),

      riskId () {
        return parseInt(this.$route.params.id, 10)
      },

      riskAssessmentForm () {
        return this.$refs.riskAssessmentForm
      },

      secondItemForm () {
        return this.$refs.secondItemForm
      },

      thirdItemForm () {
        return this.$refs.thirdItemForm
      },

      thirdItemDetail () {
        return this.$refs.thirdItemDetail
      },

      thirdItemCaseForm () {
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

      handlePageSizeChange (pageSize) {
        this.setListPageSize(pageSize)
        this.loadListData()
      },

      handleThirdPageSizeChange (pageSize) {
        this.setThirdListPageSize(pageSize)
        this.loadThirdListData()
      },

      handleRowChange (currentRow) {
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

      hiddenLevelText (level) {
        switch (level) {
          case 1:
            return '重大隐患'
          case 2:
            return '一般隐患'
          default:
            return '无'
        }
      },

      controlPeriodDesc (value) {
        if (value.indexOf('日') > -1) {
          return '日常隐患排查'
        } else if (value.indexOf('周') > -1) {
          return '综合隐患排查'
        } else if (value.indexOf('月') > -1) {
          return '专业隐患排查'
        } else if (value.indexOf('季') > -1) {
          return '季节隐患排查'
        } else if (value.indexOf('年') > -1) {
          return '全厂隐患排查'
        } else {
          return '无'
        }
      },

      search () {
        this.setThirdListData({
          total: 0, items: []
        })
        this.filterListData(this.searchForm)
      }
    },

    created () {
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
