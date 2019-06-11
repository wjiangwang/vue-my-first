<template>
  <div class="page">
    <page-card class="page-main" :scrollable="false" v-loading="list.loading">
      <div class="risk-promise-progress-table">
        <data-table
          :style="'height:'+sectionHeight"
          :columns="tableColumns1"
          :data="mockData"
          class="risk-promise-progress-table-1"
          :border="false"
          :showBottomBar="false"
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
                  <el-select v-model="searchForm.job" placeholder="请选择级别" clearable size="small">
                    <el-option
                      v-for="item in jobOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
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
        <!-- TODO:岗位及以上显示三种  -->
        <data-table
          v-if="type===2"
          class="risk-promise-progress-table-2"
          :columns="tableColumns3"
          :style="'height:'+sectionHeight"
          :data="list.items"
          :border="false"
          :showBottomBar="false"
          :total="list.total"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadListData({ page: $event })"
        >
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
        <!-- ----------- -->
        <data-table
          class="risk-promise-progress-table-3"
          :columns="tableColumns2"
          :style="'height:'+sectionHeight"
          :data="mockData"
          :border="false"
          :total="list.total"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadListData({ page: $event })"
        >
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



const tableColumns3 = [
  { title: '复核内容', name: 'riskName' },
  { title: '复核人', name: 'riskName' },
  { title: '复核结果', name: '__slot:risk-level' },
  { title: '工作流', name: '__slot:status', width: '200px' },
  { title: '操作', name: '__slot:actions', width: '200px' }
]
const tableColumns2 = [
  { title: '管控部位', name: 'xx1', width: '200px' },
  { title: '风险描述', name: 'xx5' },
  { title: '逾期时间', name: 'xx6' },
  { title: '工作流', name: 'xx4', width: '200px' },
  { title: '操作', name: '__slot:actions', width: '200px' }
]

export default {
  name: 'RiskPromiseProgressTable',

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
      // 两种情况 type
      mockData: [
        { xx1: '转化区（转化作业）', xx2: '毛晓蓝', xx3: '管控完成', xx4: '(配电岗位)->(配电班组)', xx5: '缓冲罐体可能变形、泄漏', xx6: '2019-4-8' },
        { xx1: '甲醇厂区', xx2: '李俊贤', xx3: '管控完成', xx4: '(化检验岗位)->(化检验班组)->(合众化工)', xx5: '温度仪表可能损坏，读数可能不正常', xx6: '2019-4-8' },
        { xx1: '变、配电室', xx2: '索怀财', xx3: '管控完成', xx4: '(水处理岗位)', xx5: '气柜柜位可能超限', xx6: '2019-4-8' },
        { xx1: '煤气气柜', xx2: '苟小平', xx3: '管控完成', xx4: '(转化合成岗位)->(甲醇班组)', xx5: '仪表可能损坏，读数可能不正常。', xx6: '2019-4-8' },
        { xx1: '甲醇罐区', xx2: '雷波', xx3: '管控完成', xx4: '(甲醇车间)->(合众化工)', xx5: '缓冲罐罐体完好无损坏，连接管线无泄漏、无破损。', xx6: '2019-4-8' },
        { xx1: '空分区', xx2: '李春霞', xx3: '管控完成', xx4: '(甲醇班组)->(甲醇车间)->(合众化工)', xx5: '消防水带箱配件缺失', xx6: '2019-4-8' },
        { xx1: '转化区（转化作业）', xx2: '张莉', xx3: '管控完成', xx4: '(配电岗位)->(配电班组)', xx5: '温度仪表可能损坏，读数可能不正常', xx6: '2019-4-8' },
      ],
      type: 1,
      tableColumns3,
      tableColumns2,
      searchForm: {
        keywords: null,
        job: null
      },
      jobOptions: [
        {
          label: '岗位',
          value: 1
        },
        {
          label: '班组',
          value: 2
        },
        {
          label: '部门',
          value: 3
        },
        {
          label: '公司',
          value: 4
        }
      ],
    }
  },

  watch: {

  },

  computed: {
    ...mapState('regionalRisk', ['list']),

    sectionHeight () {
      return this.type === 1 ? '50%' : '33%'
    },

    tableColumns1 () {
      return this.type === 1 ? [
        { title: '管控部位', name: 'xx1', width: '200px' },
        { title: '管控人', name: 'xx2' },
        { title: '管控结果', name: 'xx3' },
        { title: '工作流', name: 'xx4', width: '200px' },
        { title: '操作', name: '__slot:actions', width: '200px' }
      ] : [
          { title: '复核内容', name: 'riskName' },
          { title: '复核人', name: 'riskName' },
          { title: '复核结果', name: '__slot:risk-level' },
          { title: '工作流', name: '__slot:status', width: '200px' },
          { title: '操作', name: '__slot:actions', width: '200px' }
        ]
    }
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
      // this.setListPageSize(pageSize)
      // this.loadListData()
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
    // await this.loadHistogram()
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
.risk-promise-progress-table {
  flex: 1;
  margin-top: -14px;
  width: 100%;
  height: 60%;
  .risk-promise-progress-table-2,
  .risk-promise-progress-table-3 {
    /deep/ .toolbar {
      display: none;
    }
  }

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


