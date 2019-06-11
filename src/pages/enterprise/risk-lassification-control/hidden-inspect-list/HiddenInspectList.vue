<template>
  <div class="page">
    <breadcrumb :items="[{ name: '隐患排查清单' }]"></breadcrumb>
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
                    placeholder="请输入区域、一级编码"
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
                <el-button type="text" size="medium" class="button-image-icon">
                  <img src="@/assets/icons/file-xls.png" class="icon">
                  导出
                </el-button>
              </div>
            </div>
          </template>
          <div class="risk-level" slot="risk-level" slot-scope="{ row }">
            <span
              class="count first"
              @click="iconClick(row.id,1,'risk',row.riskName)"
            >{{row.oneRisk}}</span>
            <span
              class="count second"
              @click="iconClick(row.id,2,'risk',row.riskName)"
            >{{row.twoRisk}}</span>
            <span
              class="count third"
              @click="iconClick(row.id,3,'risk',row.riskName)"
            >{{row.threeRisk}}</span>
            <span
              class="count fourth"
              @click="iconClick(row.id,4,'risk',row.riskName)"
            >{{row.fourRisk}}</span>
          </div>

          <div class="risk" slot="risk" slot-scope="{ row }">
            <div class="wrapper first">
              <span class="triangle"></span>
              <span
                class="count"
                @click="iconClick(row.id,1,'hidden',row.riskName)"
              >{{row.majorHidden}}</span>
            </div>
            <div class="wrapper second">
              <span class="triangle"></span>
              <span
                class="count"
                @click="iconClick(row.id,2,'hidden',row.riskName)"
              >{{row.generalHidden}}</span>
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
            <span v-else :style="{ color: status === 1 ? '#666666' : '#FA5878' }"
            >{{status === 1 ? '在产' : '停产'}}</span>
          </div>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text" size="medium" @click="handleType(row.id, 'SCL')">详情</el-button>
            <el-button type="text" size="medium" @click="sclDetail(row.id)">台账</el-button>
          </div>
        </data-table>

        <risk-assessment-form ref="riskAssessmentForm"></risk-assessment-form>
        <risk-assessment-import-form
          ref="riskAssessmentImportForm"
          @import-success="loadListData()"
        ></risk-assessment-import-form>

        <!-- <risk-third-item-cases ref="riskThirdItemCases"></risk-third-item-cases> -->
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
import RiskAssessmentForm from '../risk-identification-assessment/RiskAssessmentForm'
import RiskAssessmentImportForm from '../risk-identification-assessment/RiskAssessmentImportForm'
// import RiskThirdItemCases from '../RiskThirdItemCases'


const tableColumns = [
  { title: '编码', name: 'oneCoding', width: '130px' },
  { title: '排查区域', name: 'riskName' },
  { title: '风险等级', name: '__slot:risk-level' },
  { title: '隐患数量', name: '__slot:risk', width: '120px' },
  { title: '是否在产', name: '__slot:status', width: '180px' },
  { title: '操作', name: '__slot:actions', width: '160px' }
]

export default {
  name: 'HiddenInspectList',

  components: {
    PageCard,
    Breadcrumb,
    DataTable,
    RiskAssessmentForm,
    RiskAssessmentImportForm
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

      tableColumns: tableColumns,
      searchForm: {
        keywords: null
      },

    }
  },

  watch: {

  },

  computed: {
    ...mapState('hiddenInspectList', ['list']),

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
    ...mapMutations('hiddenInspectList', ['setListParams', 'setListPageSize']),
    ...mapActions('hiddenInspectList', [
      'loadListData', 'filterListData', 'delete', 'update', 'updateStatus'
    ]),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
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
       this.$router.push({ path: id + '/detail/items?type=' + type })
    },

    sclDetail (id) {
       this.$router.push({ path: `hidden-book/${id}`})
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
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  border: 0;
  //margin-top: 20px;
  /deep/ .card-body {
    padding: 20px 0 0 !important;
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


