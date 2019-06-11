<template>
  <div class="page">
      <breadcrumb :items="[{ name: '安全知识库'}]"></breadcrumb>
    <div class="page-main">
      <page-card :scrollable="false"
        v-loading="list.loading">
        <data-table :columns="tableColumns"
          :data="list.items"
          :total="list.total"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="loadListData({ page: $event })"
          style="flex: 1;">
          <template slot="toolbar">
            <div class="columns">
              <div class="left">
                <el-form :inline="true" :model="searchForm" label-suffix=":">
                  <string-input placeholder="搜索标题"
                    name="keywords"
                    @input="searchForm.keywords = $event">
                  </string-input>

                  <el-form-item>
                    <el-button type="primary"
                      icon="el-icon-search"
                      size="medium"
                      @click="search">
                      查询
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>

              <div class="right">
              </div>
            </div>
          </template>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text"
              size="medium"
              @click="show(row.id)">
              查看内容
            </el-button>
          </div>
        </data-table>
      </page-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'

const tableColumns = [
  { title: '标题', name: 'title' },
  { title: '发布时间', name: 'createDate', type: 'date', width: "180"},
  { title: '操作', name: '__slot:actions', width: "180"}
]

export default {
  name: 'managerTraining',

  components: {
    Breadcrumb,
    DataTable,
    PageCard
  },

  data() {
    return {
      searchForm: {
        controlLevelId: null,
        keywords: null
      },
      exporting: false,
      tableColumns
    }
  },

  computed: {
    ...mapState('securityRepository', ['list'])
  },

  methods: {
    ...mapMutations('securityRepository', ['setListParams', 'setListPageSize']),
    ...mapActions('securityRepository', ['loadListData', 'filterListData']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    show (id) {
      this.$router.push({ path: this.$resolveRoutePath('safety-repository/repository-detail/' + id) })
    },

    search() {
      this.filterListData(this.searchForm)
    }
  },

  created() {
    this.loadListData({ reset: true })
  }
}
</script>
