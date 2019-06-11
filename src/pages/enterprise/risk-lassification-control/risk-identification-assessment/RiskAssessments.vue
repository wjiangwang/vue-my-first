<template>
  <div class="page">
    <page-card class="page-main" :scrollable="false" v-loading="list.loading">
      <div class="enterprise-risk-assessments">
        <data-table
          :columns="tableColumns"
          :data="list.items"
          :total="list.total"
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
                    placeholder="请输入名称、一级编码"
                    name="keywords"
                    :value="searchForm.keywords"
                    @input="searchForm.keywords = $event"
                  ></string-input>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right">
                <el-button
                  @click="checkXls"
                  type="text"
                  size="medium"
                  class="button-image-icon check-out-button"
                >
                  <img src="@/assets/icons/file-xls.png" class="icon">
                  校验
                </el-button>
                <el-button
                  @click="leadIn"
                  type="text"
                  size="medium"
                  class="button-image-icon lead-in-button"
                >
                  <img src="@/assets/icons/file-xls.png" class="icon">
                  导入
                </el-button>
                <!--
                  TODO: 导出全部 在一张表上
                :loading=""
                  @click=""
                -->
                <el-button type="text" size="medium" class="button-image-icon">
                  <img src="@/assets/icons/file-xls.png" class="icon">
                  导出
                </el-button>
                <el-button
                  type="success"
                  size="small"
                  v-if="isBackstage"
                  @click="riskAssessmentForm.show()"
                >新增</el-button>
              </div>
            </div>
          </template>
          <div class="risk-level" slot="risk-level" slot-scope="{ row }">
            <span class="count first" @click="iconClick(row.id,1,'risk')">{{row.oneRisk}}</span>
            <span class="count second" @click="iconClick(row.id,2,'risk')">{{row.twoRisk}}</span>
            <span class="count third" @click="iconClick(row.id,3,'risk')">{{row.threeRisk}}</span>
            <span class="count fourth" @click="iconClick(row.id,4,'risk')">{{row.fourRisk}}</span>
          </div>

          <div class="risk" slot="risk" slot-scope="{ row }">
            <div class="wrapper first">
              <span class="triangle"></span>
              <span class="count" @click="iconClick(row.id,1,'hidden')">{{row.majorHidden}}</span>
            </div>
            <div class="wrapper second">
              <span class="triangle"></span>
              <span class="count" @click="iconClick(row.id,2,'hidden')">{{row.generalHidden}}</span>
            </div>
          </div>

          <div class="status" slot="status" slot-scope="{ row: { id, status } }">
            <el-radio-group
              size="mini"
              :value="status"
              @input="handleStatusChange(id, $event)"
              v-if="!isRedirect"
            >
              <el-radio-button :label="1">在产</el-radio-button>
              <el-radio-button :label="0">停产</el-radio-button>
            </el-radio-group>
            <span
              v-else
              :style="{ color: status === 1 ? '#666666' : '#FA5878' }"
            >{{status === 1 ? '在产' : '停产'}}</span>
          </div>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text" size="medium" @click="handleType(row.id)">详情</el-button>
            <el-button type="text" size="medium" @click="sclDetail(row.id)">台账</el-button>
            <el-button
              type="text"
              size="medium"
              @click="riskAssessmentForm.show(row.id)"
              v-if="isBackstage"
            >编辑</el-button>
            <el-button
              type="text"
              size="medium"
              class="warn"
              @click="deleteRiskAssessment(row.id)"
              v-if="isBackstage"
            >删除</el-button>
          </div>
        </data-table>

        <risk-assessment-form ref="riskAssessmentForm"></risk-assessment-form>
        <!-- <risk-assessment-import-form
          ref="riskAssessmentImportForm"
          @import-success="loadListData()"
        ></risk-assessment-import-form> -->
        <import-regional-risk ref="importRegionalRisk"></import-regional-risk>

        <!-- <risk-third-item-cases ref="riskThirdItemCases"></risk-third-item-cases> -->
      </div>
    </page-card>
    <!-- 导入的弹框 -->
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import UploadFile from '@/components/upload/uploadFile'
import DataTable from '@/components/DataTable'
import RiskAssessmentForm from './RiskAssessmentForm'
// import RiskAssessmentImportForm from './RiskAssessmentImportForm'
import ImportRegionalRisk from './ImportRegionalRisk'
// import RiskThirdItemCases from './RiskThirdItemCases'
import VeHistogram from 'v-charts/lib/histogram.common'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'

const tableColumns = [
  { title: '编码', name: 'oneCoding', width: '130px' },
  { title: '风险点名称', name: 'riskName' },
  { title: '风险等级', name: '__slot:risk-level' },
  { title: '隐患排查', name: '__slot:risk', width: '120px' },
  { title: '是否在产', name: '__slot:status', width: '180px' },
  { title: '操作', name: '__slot:actions', width: '280px' }
]

export default {
  name: 'RiskAssessments',

  components: {
    VeHistogram,
    PageCard,
    Breadcrumb,
    UploadFile,
    DataTable,
    RiskAssessmentForm,
    ImportRegionalRisk,
    // RiskAssessmentImportForm
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
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

  data () {
    return {
      totalNum: {
        oneRiskNum: 0,
        twoRiskNum: 0,
        threeRiskNum: 0,
        fourRiskNum: 0,
      },
      tableColumns: tableColumns,
      searchForm: {
        keywords: null
      },
      chartData: {
        columns: ['riskName', 'oneRisk', 'twoRisk', 'threeRisk', 'fourRisk'],
        rows: []
      },
      chartExtend: {
        legend: {
          right: 20,
          itemWidth: 15,
          itemHight: 15,
          itemGap: 17,
        },
        grid: {
          bottom: 40,
          top: 40
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#0E0E0E',
              width: 1
            }
          },
          splitLine: { show: true, interval: 0 },
          axisLabel: { show: true, showMinLabel: true, interval: 0 },
          type: 'category',
          axisTick: { show: false },
          data: [],
          max: 'dataMax'
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0E0E0E',
              width: 1
            }
          }
        },
      },
      chartColors: ['#F7454A', '#F49E41', '#F4D341', '#37A9FA'],
    }
  },

  watch: {
    chartDataRows () {
      this.loadHistogramMsg()
    }
  },

  computed: {
    ...mapState('regionalRisk', ['list']),

    importRegionalRisk () {
      return this.$refs.importRegionalRisk
    },
    riskAssessmentForm () {
      return this.$refs.riskAssessmentForm
    },

    // riskAssessmentImportForm () {
    //   return this.$refs.riskAssessmentImportForm
    // },

    riskThirdItemCases () {
      return this.$refs.riskThirdItemCases
    },
    chartSettings () {
      return {
        labelMap: {
          'riskName': '风险点名称',
          'oneRisk': '重大风险',
          'twoRisk': '较大风险',
          'threeRisk': '一般风险',
          'fourRisk': '低风险'
        },
        legendName: {
          '重大风险': `重大风险（总计${this.totalNum.oneRiskNum}）`,
          '较大风险': `较大风险（总计${this.totalNum.twoRiskNum}）`,
          '一般风险': `一般风险（总计${this.totalNum.threeRiskNum}）`,
          '低风险': `低风险（总计${this.totalNum.fourRiskNum}）`,
        }
      }
    },

    dataZoom () {
      let end = this.chartData.rows.length && this.chartData.rows.length > 6 ? 30 : 100
      return [
        {
          height: 20,
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end
        }
      ]
    }
  },

  methods: {
    ...mapMutations('regionalRisk', ['setListPageSize']),
    ...mapActions('regionalRisk', [
      'loadListData', 'filterListData', 'delete', 'update', 'updateStatus'
    ]),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },

    leadIn () {
      this.importRegionalRisk.show()
    },
    checkXls () {
      this.importRegionalRisk.check()
    },

    deleteRiskAssessment (id) {
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

    cleanRiskControls () {
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

    handleStatusChange (id, status) {
      this.updateStatus({ id, status })
    },

    handleType (id) {
      this.$router.push({ path: id + '/onTime/items' })
    },

    sclDetail (id) {
      this.$router.push({ name: 'risk-control-standing-book', params: { id } })
    },

    iconClick (id, level, type) {
      // this.$router.push({ path: 'onTime/risk-hidden-level-detail', query: { id, level, type, riskName } })
    }
  },

  async created () {
    const reset = this.$route.query.reset !== undefined ? this.$route.query.reset : true
    if (!reset) {
      this.searchForm.keywords = this.list.filterParams.keywords
    }

    this.loadListData({ reset })
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  border: 0;
  margin: 0;
  /deep/ .card-body {
    /*padding: 20px 0 0 !important;*/
    display: flex;
    flex-direction: column;
  }
}
.lead-in-button {
  /deep/ span {
    color: #67c23a !important;
  }
}
.check-out-button {
  /deep/ span {
    color: #e6a23c !important;
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

  .qrcode {
    img {
      width: 25px;
      height: 25px;
    }
  }
}
</style>

<style lang="scss">
.enterprise-risk-qrcode-preview-popover {
  img.qrcode-preview {
    width: 100%;
  }
}
</style>

