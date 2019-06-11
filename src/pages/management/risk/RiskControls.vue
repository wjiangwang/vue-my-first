<template>
  <div class="risk-controls" v-loading="list.loading">
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
              <select-input v-if="!$route.params.id"
                label="风险点名称"
                name="riskName"
                @input="searchForm.riskName = $event"
                :collection="riskSelectCollection">
              </select-input>
              <select-input label="类型"
                name="riskType"
                @input="searchForm.riskType = $event"
                :collection="[{ label: 'SCL', value: 'SCL' }, { label: 'JHA', value: 'JHA' }]">
              </select-input>
              <date-range-input label="巡查时间"
                name="dateRange"
                @input="searchForm.dateRange = $event">
              </date-range-input>

              <el-form-item>
                <el-button type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="search">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="right">
            <el-radio-group v-model="upOrDown" size="small"
              @change="handleUpOrDownChange">
              <el-radio-button label="up">
                上升 {{upCount}}
              </el-radio-button>
              <el-radio-button label="down">
                下降 {{downCount}}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <div slot="actions" slot-scope="{ row }" class="table-actions">
        <el-button type="text"
          size="medium"
          @click="controlDetail.show(row.id)">
          查看
        </el-button>
      </div>
    </data-table>

    <risk-control-detail ref="controlDetail"></risk-control-detail>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import DataTable from '@/components/DataTable'
import RiskControlDetail from './RiskControlDetail'
import dayjs from 'dayjs'

const tableColumns = [
  { title: '风险点名称', name: 'riskName' },
  { title: '巡查时间', name: 'inspectionTime', type: 'datetime' },
  { title: '二级子项', name: 'twoName' },
  { title: '三级子项', name: 'threeName' },
  { title: '风险等级', name: 'riskLevel' },
  { title: '掌控周期', name: 'controlCycle' },
  { title: '巡检人', name: 'inspectionName' },
  { title: '巡检意见', name: 'inspectorOpinion' },
  { title: '复核人', name: 'reviewName' },
  { title: '管控级别', name: 'controlPeriod' },
  { title: '复核时间', name: 'reviewDate', type: 'datetime' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'RiskControls',

  components: {
    DataTable,
    RiskControlDetail
  },

  data() {
    return {
      tableColumns: this.$route.params.id ? tableColumns.slice(1) : tableColumns,
      riskSelectCollection: [],
      searchForm: {
        riskName: null,
        riskType: null,
        dateRange: []
      },
      upOrDown: 'up'
    }
  },

  computed: {
    ...mapState('riskControl', ['list', 'upCount', 'downCount']),

    controlDetail() {
      return this.$refs.controlDetail
    }
  },

  methods: {
    ...mapMutations('riskControl', ['setListPageSize', 'setListParams']),
    ...mapActions('riskControl', ['loadListData', 'filterListData', 'loadRiskNames']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
      let [startAt, endAt] = this.searchForm.dateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      this.filterListData({
        riskName: this.searchForm.riskName,
        riskType: this.searchForm.riskType,
        startAt, endAt
      })
    },

    handleUpOrDownChange(value) {
      this.setListParams({ upOrDown: value })
      this.loadListData()
    }
  },

  async created() {
    this.setListParams({
      riskAssessmentId: this.$route.params.id,
      upOrDown: 'up'
    })
    this.loadListData({ reset: true })

    if (!this.$route.params.id) {
      const result = await this.loadRiskNames()
      this.riskSelectCollection = result.map(item => ({
        label: item.riskName,
        value: item.riskName
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.risk-controls {
  flex: 1;
  margin-top: -10px;
  width: 100%;
}
</style>
