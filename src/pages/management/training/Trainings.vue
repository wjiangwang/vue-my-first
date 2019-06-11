<template>
  <div class="page">
    <breadcrumb :items="[{ name: '资料库管理' }]"></breadcrumb>

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
                  <resource-input label="标签"
                    name="label"
                    resource-name="label"
                    :value="searchForm.label"
                    @input="searchForm.label = $event">
                  </resource-input>
                  <string-input label=""
                    placeholder="搜索问题"
                    name="keywords"
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
                <a href="javascript:;" class="import-button"
                  @click.prevent="importForm.show()">
                  <img src="@/assets/icons/file-xls.png">
                  导入
                </a>

                <el-button type="success"
                  size="medium"
                  @click="$router.push({ name: 'safety-training-new' })">
                  新增问题
                </el-button>
              </div>
            </div>
          </template>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text"
              size="medium"
              @click="$router.push({ name: 'safety-training-edit', params: { id: row.id } })">
              编辑
            </el-button>
            <el-button type="text"
              size="medium"
              class="warn"
              @click="deleteTraining(row.id)">
              删除
            </el-button>
          </div>
        </data-table>
      </page-card>
    </div>

    <import-form ref="importForm"
      @import-success="loadListData">
    </import-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import DataTable from '@/components/DataTable'
import ImportForm from './ImportForm'

const tableColumns = [
  { title: '企业标签', name: 'label' },
  { title: '问题', name: 'question' },
  { title: '选项', name: 'options' },
  { title: '答案', name: 'answer', width: '80px' },
  { title: '学习内容', name: 'answer' },
  { title: '操作', name: '__slot:actions', width: '140px' }
]

export default {
  name: 'Trainings',

  components: {
    Breadcrumb,
    PageCard,
    DataTable,
    ImportForm
  },

  data() {
    return {
      importDialogVisible: false,
      tableColumns,
      searchForm: {
        label: null,
        keywords: null
      },
    }
  },

  computed: {
    ...mapState('training', ['list']),

    importForm() {
      return this.$refs.importForm
    }
  },

  methods: {
    ...mapMutations('training', ['setListPageSize']),
    ...mapActions('training', ['loadListData', 'delete','filterListData']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search() {
       this.filterListData(this.searchForm)
    },

    deleteTraining(id) {
      this.$confirm('确认删除该问题？', '确认删除', {
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
    this.loadListData({ reset })
  }
}
</script>

<style lang="scss" scoped>
.columns .right {
  display: flex;
  align-items: center;
}

.import-button {
  color: #57687C;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  text-decoration: none;
  margin-right: 16px;

  &:hover {
    color: #444444;
  }

  img {
    width: 18px;
    height: auto;
    margin-right: 8px;
  }
}
</style>
