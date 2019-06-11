<template>
  <div class="page">
    <breadcrumb :items="[{ name: '事故管理' }]"></breadcrumb>

    <div class="page-main" :scrollable="false" v-loading="list.loading">
      <page-card :scrollable="false" v-loading="list.loading">
        <data-table
          :columns="tableColumns"
          :data="list.items"
          :total="listLength"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadData({ page: $event })"
          style="flex: 1;"
        >
          <template slot="toolbar">
            <div class="columns">
              <div class="left">
                <el-form :inline="true" :model="searchForm" label-suffix=":">
                  <date-range-input label="时间" name="dateRange" @input="dateRange = $event"></date-range-input>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </template>
          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text" size="medium" @click="detail(row.accidentType)">详情</el-button>
          </div>
          <!-- TODO:报告单位 -->
          <div slot="report" slot-scope="{ row }">{{row.report === 1 ? '企业' : '政府'}}</div>
        </data-table>
      </page-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import Breadcrumb from '@/components/Breadcrumb'
import dayjs from 'dayjs'

const tableColumns = [
  { title: '事故类型', name: 'accidentType' },
  { title: '事故损失（万元）', name: 'economicLosses' },
  { title: '事故数量', name: 'erAccidentNum' },
  { title: '受伤人数', name: 'injuredNum' },
  { title: '死亡人数', name: 'deathNum' },
  { title: '赔偿数量', name: 'compensationNum' },
  { title: '处罚数量', name: 'punishmentNum' },
  { title: '操作', name: '__slot:actions' }

]

export default {
  name: 'accidentStatistics',

  components: {
    DataTable,
    PageCard,
    Breadcrumb
  },

  data () {
    return {
      dateRange: [],
      searchForm: {},
      tableColumns,
    }
  },

  computed: {
    ...mapState('contingencyAccidentStatistics', ['list']),

    listLength () {
      return this.list.items.length
    }
  },

  methods: {
    ...mapMutations('contingencyAccidentStatistics', ['setListParams', 'setListPageSize']),
    ...mapActions('contingencyAccidentStatistics', ['loadData', 'filterData', 'delete']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadData()
    },

    search () {
      let [startAt, endAt] = this.dateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      Object.assign(this.searchForm, { startAt, endAt })
      this.filterData(this.searchForm)
    },

    detail (type) {
      this.$router.push({ name: 'contingency-accident-report', params: { type } })

    }
  },

  created () {
    this.loadData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
/deep/ .toolbar {
  .left {
    .el-input {
      padding-bottom: 10px !important;
    }
  }
}
</style>
