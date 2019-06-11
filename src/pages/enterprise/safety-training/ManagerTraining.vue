<template>
  <div class="page">
    <breadcrumb :items="breadcrumb"></breadcrumb>

    <div class="page-main">
      <page-card :scrollable="false" v-loading="list.loading">
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
                  <string-input
                    placeholder="搜索题目、答题人"
                    name="keywords"
                    @input="searchForm.keywords = $event"
                  ></string-input>

                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>

              <div class="right">
                <el-button
                  type="text"
                  size="medium"
                  class="button-image-icon"
                  :loading="exporting"
                  @click="exportManagerTraining"
                >
                  <img src="@/assets/icons/file-xls.png" class="icon">
                  导出
                </el-button>
              </div>
            </div>
          </template>

          <template slot="nickname" slot-scope="{ row }">
            <span style="color: #37A9FA">{{row.nickname}}</span>
          </template>

          <template slot="results" slot-scope="{ row }">
            <span
              :style="{ color: row.results === 1 ? '#59D987' : '#F7454A' }"
            >{{row.results === 1 ? '正确' : '错误'}}</span>
          </template>
        </data-table>
      </page-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'

const tableColumns = [
  { title: '题目', name: 'question' },
  { title: '答题人', name: '__slot:nickname', width: "130" },
  { title: '答题时间', name: 'createDate', type: 'date', width: "160" },
  { title: '选择答案', name: 'selectAnswer' },
  { title: '正确答案', name: 'answerValue' },
  { title: '作答结果', name: '__slot:results', width: "120" }
]

export default {
  name: 'managerTraining',
  props: {
    type: Number,
    defult: 1
  },
  components: {
    Breadcrumb,
    DataTable,
    PageCard
  },

  data () {
    return {
      searchForm: {
        controlLevelId: null,
        keywords: null
      },
      exporting: false,
      tableColumns,
    }
  },

  computed: {
    ...mapState('managerTraining', ['list']),

    breadcrumb () {
      let name
      switch (this.type) {
        case 1:
          name = '管理人员培训'
          break
        case 2:
          name = '作业人员培训'
          break
        case 3:
          name = '外来人员培训'
          break
      }
      return [{ name }]
    }
  },

  methods: {
    ...mapMutations('managerTraining', ['setListParams', 'setListPageSize']),
    ...mapActions('managerTraining', ['loadListData', 'filterListData', 'delete']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },

    async exportManagerTraining () {
      this.exporting = true

      // const response = await this.export({ enterpriseId: this.$route.params.id })
      // const url = window.URL.createObjectURL(
      //   new Blob([response.data], { type: 'application/vnd.ms-excel' })
      // )
      // const link = document.createElement('a')

      // const disposition = response.headers['content-disposition']
      // let filename = '企业人员信息'
      // if (disposition) {
      //     const matches = disposition.match(/filename="(.+)"/)
      //     if (matches.length === 2) filename = matches[1]
      // }

      // link.href = url
      // link.setAttribute('download', filename)
      // document.body.appendChild(link)
      // link.click()

      // document.body.removeChild(link)
      // window.URL.revokeObjectURL(url)

      this.exporting = false
    }
  },

  created () {
    this.setListParams({ type: this.type })
    this.loadListData({ reset: true })
  }
}
</script>
