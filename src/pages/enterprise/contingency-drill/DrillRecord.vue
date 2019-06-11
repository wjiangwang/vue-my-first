<template>
  <div class="page">
    <div class="page-main" :scrollable="false" v-loading="list.loading">
      <data-table
        :columns="tableColumns"
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
                <el-form-item label="演练类型">
                  <el-select v-model="searchForm.exerciseType" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in dropDown.drillTypeSelect"
                      :key="item.index"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="演练形式">
                <string-input
                  placeholder="请输入演练形式"
                  name="keywords"
                  @input="searchForm.exerciseWay = $event"
                ></string-input>
                </el-form-item>
                <string-input
                  placeholder="请输入演练标题"
                  name="keywords"
                  @input="searchForm.keywords = $event"
                ></string-input>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="right" v-if="!isManagement && !isRedirect">
              <el-button type="success" size="medium" @click="newDrillRecordForm.show()">新增</el-button>
            </div>
          </div>
        </template>

        <!-- <div slot="exerciseType" slot-scope="{ row }">{{row.exerciseType === 1 ? '综合演练' : '否'}}</div>
        <div slot="exerciseWay" slot-scope="{ row }">{{row.exerciseWay === 1 ? '全面演练' : '否'}}</div> -->

        <div slot="status" slot-scope="{ row }">
          <!-- {{row.status === 1 ? '已执行' : '未执行'}} -->
          <span v-if="row.status === 1">已执行</span>
          <el-button type="text" v-else-if="!isManagement && !isRedirect && row.status === 0"
            @click="editDrillRecordForm.execute(row.id)"
          >执行</el-button>
          <span v-else>未执行</span>
        </div>

        <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button type="text" size="medium" @click="detailDrillRecordForm.show(row.id)">详情</el-button>
          <el-button
            type="text"
            size="medium"
            @click="editDrillRecordForm.show(row.id)"
            v-if="!isManagement && !isRedirect"
          >编辑</el-button>
          <el-button
            type="text"
            size="medium"
            class="warn"
            @click="deleteDrillRecord(row.id)"
            v-if="!isManagement && !isRedirect"
          >删除</el-button>
        </div>
      </data-table>
    </div>

    <drill-record-form ref="newDrillRecordForm"></drill-record-form>
    <drill-record-form ref="editDrillRecordForm"></drill-record-form>
    <drill-record-form :readonly="true" ref="detailDrillRecordForm"></drill-record-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import DrillRecordForm from './DrillRecordForm'

const tableColumns = [
  { title: '演练标题', name: 'exerciseTitle' },
  // { title: '演练类型', name: '__slot:exerciseType' },
  // { title: '演练形式', name: '__slot:exerciseWay' },
  { title: '演练类型', name: 'exerciseType' },
  { title: '演练形式', name: 'exerciseWay' },
  { title: '开始时间', name: 'startTime', type: 'date' },
  { title: '结束时间', name: 'endTime', type: 'date' },
  { title: '演练状态', name: '__slot:status' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'DrillRecord',

  components: {
    DataTable,
    PageCard,
    DrillRecordForm
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
        drillTypeSelect: [],
      },
      searchForm: {
        exerciseType: null,
        keywords: null,
        exerciseWay: null
      },
      tableColumns
    }
  },

  computed: {
    ...mapState('contingencyDrillRecord', ['list']),

    newDrillRecordForm () {
      return this.$refs.newDrillRecordForm
    },

    editDrillRecordForm () {
      return this.$refs.editDrillRecordForm
    },

    detailDrillRecordForm () {
      return this.$refs.detailDrillRecordForm
    }
  },

  methods: {
    ...mapMutations('contingencyDrillRecord', ['setListParams', 'setListPageSize']),
    ...mapActions('contingencyDrillRecord', ['loadListData', 'filterListData', 'delete']),
    ...mapActions('getDropdownOption', ['getDropdown']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },

    deleteDrillRecord (id) {
      this.$confirm('确认删除该演练记录？', '确认删除', {
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

  async created () {
    if(this.isManagement) this.setListParams({ companyId: this.$route.params.enterpriseId })
    this.loadListData({ reset: true })
    this.dropDown.drillTypeSelect = await this.getDropdown({ type: '演练类型' })
  }
}
</script>
