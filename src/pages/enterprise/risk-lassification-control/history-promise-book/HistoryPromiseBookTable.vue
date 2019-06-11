<template>
  <div class="page">
    <page-card class="page-main" :scrollable="false" v-loading="list.loading">
      <div class="enterprise-risk-assessments">
        <data-table
          :columns="tableColumns"
          :data="mockData"
          :total="list.total"
          :border="false"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadListData({ page: $event })"
        >
          <template slot="toolbar">
            <div class="columns">
              <div class="left">
                <el-form :inline="true" :model="searchForm" label-suffix=":" size="small">
                  <string-input
                    placeholder="请输入级别名称"
                    name="keywords"
                    :value="searchForm.keywords"
                    @input="searchForm.keywords = $event"
                  ></string-input>
                  <date-range-input label name="dateRange" @input="searchForm.dateRange = $event"></date-range-input>

                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right"></div>
            </div>
          </template>

          <div class="status" slot="status" slot-scope="{ row: { id, status } }">
            <span
              :style="{ color: status === 0 ? '#666666' : '#FA5878' }"
            >{{status === 0 ? '已完成' : '未复核'}}</span>
          </div>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text" size="medium" @click="handleType(row.id, 'SCL')">详情</el-button>
            <el-button
              type="text"
              size="medium"
              @click="riskAssessmentForm.show(row.id)"
              v-if="!isRedirect"
            >编辑</el-button>
            <el-button
              type="text"
              size="medium"
              class="warn"
              @click="deleteRiskAssessment(row.id)"
              v-if="!isRedirect"
            >删除</el-button>
          </div>
        </data-table>

        <!-- <risk-assessment-form ref="riskAssessmentForm"></risk-assessment-form>
        <risk-assessment-import-form
          ref="riskAssessmentImportForm"
          @import-success="loadListData()"
        ></risk-assessment-import-form>

        <risk-third-item-cases ref="riskThirdItemCases"></risk-third-item-cases>-->
      </div>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
// import RiskAssessmentForm from '../RiskAssessmentForm'
// import RiskAssessmentImportForm from '../RiskAssessmentImportForm'
// import RiskThirdItemCases from '../RiskThirdItemCases'


const tableColumns = [
  { title: '时间', name: 'creatDate' },
  { title: '企业承诺', name: 'promise1' },
  { title: '部门承诺', name: 'promise2' },
  { title: '个人承诺', name: 'promise3' },
  { title: '操作', name: '__slot:actions', width: '280px' }
]

export default {
  name: 'HistoryPromiseBookTable',

  components: {
    PageCard,
    Breadcrumb,
    DataTable,
    // RiskAssessmentForm,
    // RiskAssessmentImportForm,
    // RiskThirdItemCases
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    },
    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      mockData: [
        { creatDate: '2019-3-12', promise1: `${(Math.random() * 30 + 70).toFixed(2)}`, promise2: '95%', promise3: '85%' },
        { creatDate: '2019-3-14', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-3-24', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-3-26', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-3-27', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-3-28', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-4-4', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-4-5', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-4-6', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
        { creatDate: '2019-4-8', promise1: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise2: `${(Math.random() * 30 + 70).toFixed(2)}%`, promise3: `${(Math.random() * 30 + 70).toFixed(2)}%` },
      ],
      tableColumns: tableColumns,
      searchForm: {
        keywords: null,
        dateRange: null
      },

    }
  },

  watch: {

  },

  computed: {
    ...mapState('regionalRisk', ['list']),

    // riskAssessmentForm () {
    //   return this.$refs.riskAssessmentForm
    // },

    // riskAssessmentImportForm () {
    //   return this.$refs.riskAssessmentImportForm
    // },

    // riskThirdItemCases () {
    //   return this.$refs.riskThirdItemCases
    // },
  },

  methods: {
    ...mapMutations('regionalRisk', ['setListParams', 'setListPageSize']),
    ...mapActions('regionalRisk', [
      'loadListData', 'filterListData', 'delete', 'update', 'removeControls', 'updateStatus', 'loadHistogram'
    ]),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      // this.filterListData(this.searchForm)
    },

    deleteRiskAssessment (id) {
      //   this.$confirm('确认删除该风险点？', '确认删除', {
      //     closeOnClickModal: false,
      //     closeOnPressEscape: false,
      //     beforeClose: async (action, instance, done) => {
      //       if (action === 'confirm') {
      //         const loading = Loading.service({
      //           target: instance.$el.querySelector('.el-message-box')
      //         })

      //         await this.delete(id)
      //         loading.close()
      //         done()
      //       } else {
      //         done()
      //       }
      //     }
      //   })
    },


    handleStatusChange (id, status) {
      this.updateStatus({ id, status })
    },

    handleType (id, type) {
      // this.$router.push({ path: id + '/onTime/items?type=' + type })
    },

    sclDetail (id) {
      // this.$router.push({ name: 'risk-control-standing-book', params: { id } })
    },

    iconClick (id, level, type, riskName) {
      //this.$router.push({ name: 'risk-hidden-level-detail', params: { id, level, type, riskName } })
    }
  },

  async created () {
    this.setListParams({ companyId: this.$route.params.id })

    const reset = this.$route.query.reset !== undefined ? this.$route.query.reset : true
    if (!reset) {
      this.searchForm.keywords = this.list.filterParams.keywords
    }

    this.loadListData({ reset })
    await this.loadHistogram()
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  border: 0;
  //margin-top: 20px;
  /deep/ .card-body {
    // padding: 20px 0 0 !important;
    display: flex;
    flex-direction: column;
  }
}
.enterprise-risk-assessments {
  flex: 1;
  margin-top: -14px;
  width: 100%;
  height: 60%;
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
        background: #fa5878;
        &:hover {
          cursor: pointer;
        }
      }

      &.second {
        background: #fea340;
        &:hover {
          cursor: pointer;
        }
      }

      &.third {
        background: #f4d341;
        &:hover {
          cursor: pointer;
        }
      }

      &.fourth {
        background: #37a9fa;
        &:hover {
          cursor: pointer;
        }
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

      &.first .count {
        &:hover {
          cursor: pointer;
        }
      }
      &.first .triangle {
        border-bottom: 25px solid#FEA340;
      }
      &.second .count {
        &:hover {
          cursor: pointer;
        }
      }
      &.second .triangle {
        border-bottom: 25px solid #f4d341;
        &:hover {
          cursor: pointer;
        }
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
}
</style>


