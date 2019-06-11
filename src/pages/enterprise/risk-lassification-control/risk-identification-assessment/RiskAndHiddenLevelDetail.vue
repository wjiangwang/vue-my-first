<template>
  <div class="page">
    <page-card class="page-main" :scrollable="false" v-loading="riskLevelList.loading">
      <div class="teal-time-risk-assessments">
        <div class="el-card is-never-shadow top-card">
          <div class="name">
            <img src="@/assets/icons/risk.png" class="icon">
            <h1>{{riskNameDesc}}</h1>
          </div>
        </div>

        <data-table
          :columns="tableColumns"
          :data="riskLevelList.items"
          :total="riskLevelList.total"
          :page-size="riskLevelList.pageSize"
          :current-page="riskLevelList.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadRiskLevelList({ page: $event })"
        >
          <div slot="risk-level" slot-scope="{ row }">
            {{riskLevelText(row.riskLevel)}}
          </div>
          <div slot="hidden-danger-status" slot-scope="{ row }" v-if="$route.query.type === 'hidden'">
            {{hiddenStatusText(row.hiddenDangerStatus)}}
          </div>
          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button v-if="$route.query.type === 'hidden'" type="text" size="medium" @click="controlDetail.show(row.id)">详情</el-button>
            <el-button v-else type="text" size="medium" @click="thirdItemDetail.show(row.id)">详情</el-button>
          </div>
        </data-table>
      </div>
    </page-card>

    <!-- <real-time-risk-form ref="realTimeRiskForm"></real-time-risk-form>
    <task-history ref="taskHistory"></task-history>-->
    <risk-assessment-third-item-detail ref="thirdItemDetail"></risk-assessment-third-item-detail>
    <hidden-danger-control-detail ref="controlDetail"></hidden-danger-control-detail>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import PageCard from '@/components/PageCard'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import DataTable from '@/components/DataTable'
  import RiskAssessmentThirdItemDetail from './RiskAssessmentThirdItemDetail'
  import HiddenDangerControlDetail from '../check-control-book/HiddenDangerControlDetail'

  const tableColumns = [
    { title: '二级子项', name: 'twoName' },
    { title: '三级子项', name: 'threeName' },
    { title: '风险等级', name: '__slot:risk-level' },
    { title: '管控手段', name: 'controlMeans' },
    { title: '管控周期', name: 'controlPeriod' },
    { title: '管控级别', name: 'controlLevel' },
    { title: '风险评估（L）', name: 'riskAssessmentL' },
    { title: '风险评估（S）', name: 'riskAssessmentS' },
    { title: '风险评估（R）', name: 'riskAssessmentR' },
    { title: '操作', name: '__slot:actions' }
  ]

  const hiddentableColumns = [
    { title: '隐患名称', name: 'hiddenDangerName' },
    { title: '隐患级别', name: '__slot:risk-level' },
    { title: '隐患状态', name: '__slot:hidden-danger-status' },
    { title: '整改期限', name: 'rectificationDate', type: 'date' },
    { title: '操作', name: '__slot:actions' }
  ]

  export default {
    name: 'xxRealTimeRisk',

    components: {
      PageCard,
      Breadcrumb,
      DataTable,
      RiskAssessmentThirdItemDetail,
      HiddenDangerControlDetail
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
        tableColumns: this.$route.query.type === 'hidden' ? hiddentableColumns : tableColumns,
        searchForm: {
          keywords: ''
        }
      }
    },

    computed: {
      ...mapState('regionalRisk', ['riskLevelList']),

      riskNameDesc () {
        let name
        switch (this.$route.query.type) {
          case 'risk':
            switch (parseInt(this.$route.query.level)) {
              case 1:
                name = this.$route.query.riskName + '—— 重大风险'
                break
              case 2:
                name = this.$route.query.riskName + '—— 较大风险'
                break
              case 3:
                name = this.$route.query.riskName + '—— 一般风险'
                break
              case 4:
                name = this.$route.query.riskName + '—— 低风险'
                break
            }
            break
          case 'hidden':
            switch (parseInt(this.$route.query.level)) {
              case 1:
                name = this.$route.query.riskName + '—— 重大隐患'
                break
              case 2:
                name = this.$route.query.riskName + '—— 一般隐患'
                break
            }
        }
        return name
      },

      thirdItemDetail() {
        return this.$refs.thirdItemDetail
      },

      controlDetail() {
        return this.$refs.controlDetail
      }
    },

    methods: {
      ...mapMutations('regionalRisk', ['setRiskLevelListParams', 'setRiskLevelListPageSize']),
      ...mapActions('regionalRisk', [
        'loadRiskLevelList']),

      handlePageSizeChange (pageSize) {
        this.setRiskLevelListPageSize(pageSize)
        this.loadRiskLevelList()
      },

      riskLevelText (level) {
        if (this.$route.query.type === 'risk') {
          switch (level) {
            case 1:
              return '重大风险'
            case 2:
              return '较大风险'
            case 3:
              return '一般风险'
            default:
              return '低风险'
            }
        } else {
          switch (level) {
            case 1:
              return '重大隐患'
            case 2:
              return '一般隐患'
            default:
              return '无'
            }
        }
      },

      hiddenStatusText (status) {
        switch (status) {
          case 1:
            return '整改中'
          case 2:
            return '整改完成'
          default:
            return '待确定'
          }
      }
    },

    async created () {
      this.setRiskLevelListParams({
        riskId: this.$route.query.id,
        riskLevel: this.$route.query.level,
        type: this.$route.query.type
      })
      await this.loadRiskLevelList()
    }
  }
</script>

<style lang="scss" scoped>
  .page-main {
    border: 0;
    margin: 0;
    /deep/ .card-body {
      padding: 20px 0 0 !important;
      display: flex;
      flex-direction: column;
    }
  }
  .teal-time-risk-assessments {
    flex: 1;
    margin-top: -14px;
    width: 100%;
    height: 100%;
    .top-card {
      margin: 20px 0 0 20px;
      padding: 14px 20px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .name {
      display: flex;
      align-items: center;

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
    .data-table {
      height: calc(100% - 134px) !important;
    }
  }
</style>

<style lang="scss">
.real-time-search {
  .el-form-item__content {
    .el-input {
      .el-input__inner {
        width: 190px;
      }
    }
  }
}
</style>

