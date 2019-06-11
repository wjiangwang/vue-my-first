<template>
  <div class="page">
    <div class="page-main" :scrollable="false" v-loading="list.loading">
      <data-table
        :columns="tableColumn"
        :data="list.items"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        @page-size-change="handlePageSizeChange"
        @page-change="loadListData({ page: $event })"
        style="flex: 1;"
      >
        <template slot="toolbar">
          <div class="columns">
            <div class="left">
              <el-form :inline="true" :model="searchForm" label-suffix=":">
                <el-form-item label="企业" v-if="isManagement">
                  <el-select v-model="searchForm.compony" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in dropDown.componySelect"
                      :key="item.index"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <date-range-input
                  label="总结时间"
                  name="summaryDateRange"
                  @input="summaryDateRange = $event"
                ></date-range-input>
                <string-input
                  placeholder="请输入演练名称"
                  name="keywords"
                  @input="searchForm.keywords = $event"
                ></string-input>

                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="right" v-if="!isManagement && !isRedirect">
              <el-button type="success" size="medium" @click="newDrillSummary.show()">新增</el-button>
            </div>
          </div>
        </template>

        <div slot="economicLosses" slot-scope="{ row }" style="color:#FEA340">{{row.economicLosses}}</div>

        <div slot="attachment" slot-scope="{ row }">
          <el-button
            type="text"
            v-if="row.attachment"
            style="padding:0;"
            @click="download(row.attachment)"
          >
            <div style="display: flex; align-items: center;">
              <img src="static/images/download.png">
              <span style="padding-left: 5px;">下载</span>
            </div>
          </el-button>
          <span v-else>无附件</span>
        </div>

        <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button type="text" size="medium" @click="detailDrillSummary.show(row.id)">详情</el-button>
          <el-button
            type="text"
            size="medium"
            @click="editDrillSummary.show(row.id)"
            v-if="!isManagement && !isRedirect"
          >编辑</el-button>
          <el-button
            type="text"
            size="medium"
            class="warn"
            @click="deleteDrillSummary(row.id)"
            v-if="!isManagement && !isRedirect"
          >删除</el-button>
        </div>
      </data-table>
    </div>

    <drill-summary-form ref="newDrillSummary"></drill-summary-form>
    <drill-summary-form ref="editDrillSummary"></drill-summary-form>
    <drill-summary-form :readonly="true" ref="detailDrillSummary"></drill-summary-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import DrillSummaryForm from './DrillSummaryForm'

const tableColumns = [
  { title: '演练名称', name: 'exerciseName' },
  { title: '演练企业', name: 'exerciseEnterprise' },
  { title: '经济损失（万元）', name: '__slot:economicLosses' },
  { title: '总结时间', name: 'conclusionTime', type: 'date' },
  { title: '相关附件', name: '__slot:attachment' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'DrillSummary',

  components: {
    DataTable,
    PageCard,
    DrillSummaryForm
  },

  props: {
    isManagement: {
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
      dropDown: {
        componySelect: []
      },
      summaryDateRange: [],
      searchForm: {
        keywords: null,
      },
      tableColumns: _.clone(tableColumns)
    }
  },

  computed: {
    ...mapState('contingencyDrillSummary', ['list']),

    newDrillSummary () {
      return this.$refs.newDrillSummary
    },

    editDrillSummary () {
      return this.$refs.editDrillSummary
    },
    detailDrillSummary () {
      return this.$refs.detailDrillSummary
    },

    tableColumn () {
      return this.isManagement ? this.tableColumns : _.filter(this.tableColumns, (i) => {
        return i.title !== '演练企业'
      })
    }
  },

  methods: {
    ...mapMutations('contingencyDrillSummary', ['setListParams', 'setListPageSize']),
    ...mapActions('contingencyDrillSummary', ['loadListData', 'filterListData', 'delete']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    download (t) {
      window.open(t)
    },

    search () {
      let [startAt, endAt] = this.summaryDateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      Object.assign(this.searchForm, { startAt, endAt })
      this.filterListData(this.searchForm)
    },

    deleteDrillSummary (id) {
      this.$confirm('确认删除该演练总结？', '确认删除', {
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
    }
  },

  created () {
    if (this.isManagement) this.setListParams({ companyId: this.$route.params.enterpriseId })
    this.loadListData({ reset: true })
  }
}
</script>
