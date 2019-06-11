<template>
  <div class="page">
    <breadcrumb :items="[{ name: '监控模块' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
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
                    placeholder="请输入风险点名称、一级编码"
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
                </el-form>
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
              popper-class="enterprise-risk-qrcode-preview-popover">
              <img :src="row.qrCode" class="qrcode-preview">
              <img :src="row.qrCode" slot="reference">
            </el-popover>
          </div>

          <div class="status" slot="status" slot-scope="{ row: { id, status } }">
            <span :style="{ color: status === 1 ? '#666666' : '#FA5878' }">
              {{status === 1 ? '在产' : '停产'}}
            </span>
          </div>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text"
              size="medium"
              @click="handleMonitor(row.id)">
              查看监控设备
            </el-button>
          </div>
        </data-table>

        <!-- <risk-assessment-form
          ref="riskAssessmentForm"
          :enterprise-id="enterpriseId">
        </risk-assessment-form>
        <risk-assessment-import-form
          ref="riskAssessmentImportForm"
          :enterprise-id="enterpriseId"
          @import-success="loadListData()">
        </risk-assessment-import-form> -->

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
  // import RiskAssessmentForm from './RiskAssessmentForm'
  // import RiskAssessmentImportForm from './RiskAssessmentImportForm'
  // import RiskThirdItemCases from './RiskThirdItemCases'

  const tableColumns = [
    { title: '一级编码', name: 'oneCoding' },
    { title: '风险点名称', name: 'riskName' },
    { title: '风险分级', name: '__slot:risk-level',width: '190px' },
    { title: '隐患排查', name: '__slot:risk', width: '120px' },
    { title: '二维码', name: '__slot:qrcode', width: '100px' },
    { title: '是否在产', name: '__slot:status', width: '140px' },
    { title: '监控设备', name: 'monitor' },
    { title: '操作', name: '__slot:actions', width: '230px' }
  ]

  export default {
    name: 'monitor',

    components: {
      PageCard,
      Breadcrumb,
      DataTable
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
      ...mapState('regionalRisk', ['list'])
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

      handleMonitor (id) {
        this.$router.push({ path: this.$resolveRoutePath('monitoring/equipment/' + id) })
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
  .page-main /deep/ .card-body {
    padding: 20px 0 0 !important;
    display: flex;
    flex-direction: column;
  }
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
  .enterprise-risk-qrcode-preview-popover {
    img.qrcode-preview {
      width: 100%;
    }
  }
</style>

