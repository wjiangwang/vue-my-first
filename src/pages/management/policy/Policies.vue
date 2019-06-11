<template>
  <div class="page">
    <breadcrumb :items="[{ name: '政策下放' }]"></breadcrumb>

    <div class="page-main">
      <page-card :scrollable="false"
        v-loading="list.loading">
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
                <el-form :inline="true" :model="searchForm" label-suffix=":" @submit.native.prevent>
                  <string-input label="标题"
                    placeholder="请输入"
                    :value="searchForm.keywords"
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
                <el-button type="success"
                  size="medium"
                  @click="$router.push({ name: 'new-policy' })">
                  发信息
                </el-button>
              </div>
            </div>
          </template>

          <div class="table-actions" slot="actions" slot-scope="{ row }">
            <el-button type="text" size="medium"
              @click="$router.push({ name: 'policy-detail', params: { id: row.id } })">
              查看
            </el-button>

            <el-button type="text"
              size="medium"
              @click="$router.push({ name: 'edit-policy', params: { id: row.id } })">
              编辑
            </el-button>

            <el-button type="text"
              size="medium"
              class="warn"
              @click="deletePolicy(row.id)">
              删除
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
import PageCard from '@/components/PageCard'
import DataTable from '@/components/DataTable'

const tableColumns = [
  { title: '标题', name: 'title' },
  { title: '摘要', name: 'digest' },
  { title: '区域', name: 'districtName' },
  { title: '分类', name: 'titleType' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'Trainings',

  components: {
    Breadcrumb,
    DataTable,
    PageCard
  },

  data() {
    return {
      searchForm: {
        keywords: null
      },

      tableColumns
    }
  },

  computed: {
    ...mapState('policy', ['list'])
  },

  methods: {
    ...mapMutations('policy', ['setListPageSize']),
    ...mapActions('policy', ['loadListData', 'filterListData', 'delete']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
      this.filterListData(this.searchForm)
    },

    deletePolicy(id) {
      this.$confirm('确认删除该政策消息？', '确认删除', {
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

  created() {
    const reset = this.$route.query.reset !== undefined ? this.$route.query.reset : true
    if (!reset) {
      this.searchForm.keywords = this.list.filterParams.keywords
    }
    this.loadListData({ reset })
  }
}
</script>