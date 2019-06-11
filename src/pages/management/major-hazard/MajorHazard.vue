<template>
  <div class="page">
    <breadcrumb :items="[{ name: isEnterprise ? '重大危险源' : '危险源管理' }]"></breadcrumb>

    <div class="page-main">
      <page-card :scrollable="false" v-loading="list.loading" class="major-hazard-container">
        <data-table :columns="isEnterprise ? tableColumns : tableColumnsGroup"
          :data="list.items"
          :total="list.total"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadListData({ page: $event })">
          <template slot="toolbar">
            <div class="columns">
              <div class="left">
                <el-form :inline="true" :model="searchForm" label-suffix=":" size="small">
                  <el-form-item label="危险源等级">
                    <el-select v-model="searchForm.declareLevel" placeholder="" clearable>
                      <el-option v-for="item in declareLevels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <select-input label="状态" name="status"
                    @input="searchForm.status = $event"
                    :collection="isCancel ? statusSelectOptions2 : isRecord ? statusSelectOptions1 : statusSelectOptions">
                  </select-input>

                  <date-range-input label="上报时间" name="dateRange"
                    @input="searchForm.dateRange = $event">
                  </date-range-input>

                  <string-input label="危险源名称" name="keywords"
                    @input="searchForm.keywords = $event">
                  </string-input>

                  <el-form-item label="所属企业" v-if="!isEnterprise">
                    <el-select v-model="searchForm.companyId" clearable filterable>
                      <el-option v-for="item in companyList"
                        :key="item.id"
                        :label="item.enterpriseName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="search">
                      查询
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right">
                <el-button type="success" size="small" @click="majorHazardForm.show()" v-if="isEnterprise && !isRedirect" style="margin-right: 30px;">
                  新增
                </el-button>
              </div>
            </div>
          </template>

          <template slot="level" slot-scope="{ row }">
            <span :class="['level', `level-${row.declareLevel}` ]">
              {{levelText(row.declareLevel)}}
            </span>
          </template>

          <template slot="status" slot-scope="{ row }">
            <span :class="['status', !isCancel && !isRecord ? `status-${row.status}` : `status-approve-${row.status}` ]">
              {{ isCancel || isRecord ? statusApproveText(row.status) : statusText(row.status)}}
            </span>
          </template>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <div v-if="!isCancel && !isRecord">
              <el-button type="text"
                size="medium"
                @click="majorHazardApplyRecord.show(row.majorHazardCode)">
                申请记录
              </el-button>
              <el-button type="text"
                size="medium"
                @click="majorHazardDetail.show(row.majorHazardId)">
                详情
              </el-button>
              <el-button type="text"
                size="medium"
                @click="majorHazardForm.show(row.majorHazardId)" v-if="row.status === 2 && isEnterprise && !isRedirect">
                重新申情
              </el-button>
              <el-button type="text"
                size="medium"
                @click="majorHazardCancel.show({majorHazardId: row.majorHazardId, majorHazardCode: row.majorHazardCode})" v-if="(row.status === 1 || row.status === 5) && isEnterprise && !isRedirect">
                核销
              </el-button>
            </div>

            <div v-else>
              <el-button type="text"
                size="medium"
                @click="row.status === 3 ? majorHazardApproveCancel.show({cancelAfterVerificationId: row.cancelAfterVerificationId}) : majorHazardApproveDetail.show(row.majorHazardId)"
                v-if="(!row.status || row.status === 0 || row.status === 3)">
                审核
              </el-button>
              <el-button type="text"
                size="medium"
                @click="row.status >= 3 ? majorHazardCancelRecord.show(row.majorHazardCode, type) : majorHazardApproveRecord.show(row.majorHazardCode, type)">
                审核记录
              </el-button>
            </div>
          </div>
        </data-table>
        <!-- 申请危险源 -->
        <major-hazard-form ref="majorHazardForm"></major-hazard-form>
        <!-- 申请、核销危险源记录 -->
        <major-hazard-apply-record ref="majorHazardApplyRecord"></major-hazard-apply-record>
        <!-- 危险源详情 -->
        <major-hazard-detail ref="majorHazardDetail" :is-enterprise="true"></major-hazard-detail>
        <!-- 危险源核销 -->
        <major-hazard-cancel ref="majorHazardCancel" :is-enterprise="isEnterprise" :disabled="false" :is-endit="true"></major-hazard-cancel>

        <!-- 危险源备案审核记录 -->
        <major-hazard-apply-record ref="majorHazardApproveRecord" :is-record="true"></major-hazard-apply-record>
        <!-- 危险源核销审核记录 -->
        <major-hazard-apply-record ref="majorHazardCancelRecord" :is-cancel="true"></major-hazard-apply-record>

        <!-- 危险源核销审核 -->
        <major-hazard-cancel ref="majorHazardApproveCancel" :disabled="true" :is-approve="true"></major-hazard-cancel>
        <!-- 危险源备案审核 -->
        <major-hazard-detail ref="majorHazardApproveDetail" :is-approve="true"></major-hazard-detail>
      </page-card>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import DataTable from '@/components/DataTable'
  import Breadcrumb from '@/components/Breadcrumb'
  import PageCard from '@/components/PageCard'
  import MajorHazardForm from './MajorHazardForm'
  import MajorHazardApplyRecord from './MajorHazardApplyRecord'
  import MajorHazardCancel from './MajorHazardCancel'
  import dayjs from 'dayjs'

  import MajorHazardDetail from './MajorHazardDetail'

  const tableColumns = [
    { title: '危险源名称', name: 'dangerPointName' },
    { title: '危险源等级', name: '__slot:level' },
    { title: '上报人', name: 'declarationRecordName' },
    { title: '联系电话', name: 'phone' },
    { title: '详细地址', name: 'majorHazardAddress' },
    { title: '状态', name: '__slot:status' },
    { title: '上报日期', name: 'declareTime', type: 'date' },
    { title: '操作', name: '__slot:actions', width: 240 }
  ]

  const tableColumnsGroup = [
    { title: '企业名称', name: 'companyName' },
    { title: '危险源名称', name: 'dangerPointName' },
    { title: '危险源等级', name: '__slot:level' },
    { title: '上报人', name: 'declarationRecordName' },
    { title: '联系电话', name: 'phone' },
    { title: '详细地址', name: 'majorHazardAddress' },
    { title: '状态', name: '__slot:status' },
    { title: '上报日期', name: 'declareTime', type: 'date' },
    { title: '操作', name: '__slot:actions'}
  ]

  export default {
    name: 'MajorHazard',

    components: {
      PageCard,
      Breadcrumb,
      DataTable,
      MajorHazardForm,
      MajorHazardApplyRecord,
      MajorHazardDetail,
      MajorHazardCancel
    },

    props: {
      isEnterprise: {
        type: Boolean,
        default: false
      },

      isCancel: {
        type: Boolean,
        default: false
      },

      isRecord: {
        type: Boolean,
        default: false
      },

      isGroup: {
        type: Boolean,
        default: false
      },

      type: {
        type: Number
      },

      isRedirect: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        tableColumns,
        tableColumnsGroup,
        declareLevels: [
          {
            id: 1,
            name: '一级'
          },
          {
            id: 2,
            name: '二级'
          },
          {
            id: 3,
            name: '三级'
          },
          {
            id: 4,
            name: '四级'
          }
        ],
        statusSelectOptions: [
          { label: '申报中', value: 0 },
          { label: '申报通过', value: 1 },
          { label: '申报驳回', value: 2 },
          { label: '核销申请中', value: 3 },
          { label: '已核销', value: 4 },
          { label: '核销驳回', value: 5 }
        ],
        statusSelectOptions1: [
          { label: '申报中', value: 0 },
          { label: '申报通过', value: 1 },
          { label: '申报驳回', value: 2 }
        ],
        statusSelectOptions2: [
          { label: '核销申请中', value: 3 },
          { label: '已核销', value: 4 },
          { label: '核销驳回', value: 5 }
        ],
        companyList: [],
        searchForm: {
          keywords: null,
          dateRange: [],
          declareLevel: null,
          status: null,
          companyId: null
        }
      }
    },

    watch: {
      type (v) {
        this.searchForm = {
          keywords: null,
          dateRange: [],
          declareLevel: null,
          status: null,
          companyId: null
        }
        this.setListParams({type: this.type})
        this.loadListData({ reset: true })
      }
    },

    computed: {
      ...mapState('majorHazard', ['list']),

      majorHazardForm() {
        return this.$refs.majorHazardForm
      },

      majorHazardDetail() {
        return this.$refs.majorHazardDetail
      },

      majorHazardApplyRecord() {
        return this.$refs.majorHazardApplyRecord
      },

      majorHazardApproveRecord() {
        return this.$refs.majorHazardApproveRecord
      },

      majorHazardCancelRecord() {
        return this.$refs.majorHazardCancelRecord
      },

      majorHazardApproveDetail() {
        return this.$refs.majorHazardApproveDetail
      },

      majorHazardCancel() {
        return this.$refs.majorHazardCancel
      },

      majorHazardApproveCancel() {
        return this.$refs.majorHazardApproveCancel
      }
    },

    methods: {
      ...mapMutations('majorHazard', ['setListPageSize', 'setListParams']),
      ...mapActions('majorHazard', ['loadListData', 'filterListData']),
      ...mapActions('getDropdownOption', ['getDropdown', 'getCompanyAll']),

      handlePageSizeChange(pageSize) {
        this.setListPageSize(pageSize)
        this.loadListData()
      },

      search() {
        let [startAt, endAt] = this.searchForm.dateRange || []
        startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
        endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
        this.filterListData({
          keywords: this.searchForm.keywords,
          declareLevel: this.searchForm.declareLevel,
          status: this.searchForm.status,
          companyId: this.searchForm.companyId,
          startAt, endAt
        })
      },

      levelText(level) {
        switch (level) {
        case 1:
          return '一级'
        case 2:
          return '二级'
        case 3:
          return '三级'
        case 4:
          return '四级'
        default:
          return '无'
        }
      },

      statusText(status) {
        switch (status) {
        case 1:
          return '申报通过'
        case 2:
          return '申报驳回'
        case 3:
          return '核销申请中'
        case 4:
          return '已核销'
        case 5:
          return '核销驳回'
        default:
          return '申报中'
        }
      },

      statusApproveText (status) {
        switch (status) {
        case 1:
          return '已通过'
        case 2:
          return '已驳回'
        case 3:
          return '待审核'
        case 4:
          return '已通过'
        case 5:
          return '已驳回'
        default:
          return '待审核'
        }
      }
    },
    updated () {
    },

    async created() {
      this.setListParams({type: this.type})
      this.loadListData({ reset: true })
      if (!this.isEnterprise) {
        this.companyList = await this.getCompanyAll()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .major-hazard-container {
    flex: 1;
    width: 100%;
    .columns {
      .left {
        /deep/ .el-form .el-form-item {
          margin-bottom: 10px !important;
          &:nth-last-child(-n+2) {
            margin-bottom: 0 !important;
          }
        }
      }

      .right {
        align-self: baseline !important;
      }
    }

    .level {
    }

    .status {
      &.status-undefined {
        color: #37A9FA;
      }

      &.status-0, &.status-3 {
        color: #37A9FA;
      }

      &.status-1 {
        color: #59D987;
      }

      &.status-2, &.status-5 {
        color: #F7454A;
      }

      &.status-4 {
        color: #C3C3C3;
      }

      &.status-approve-undefined {
        color: #37A9FA;
      }

      &.status-approve-0, &.status-approve-3 {
        color: #37A9FA;
      }

      &.status-approve-1, &.status-approve-4 {
        color: #59D987;
      }

      &.status-approve-2, &.status-approve-5 {
        color: #F7454A;
      }
    }
  }
</style>
