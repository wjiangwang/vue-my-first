<template>
  <div class="page">
    <breadcrumb :items="[{ name: '知识库管理' ,route:{ name: 'safety-repository-base' }},{name:'MSDS知识库'}]"></breadcrumb>
    <div class="page-main">
      <page-card :scrollable="false" v-loading="list.loading">
        <data-table
          :columns="tableColumns"
          :row-style="toggleDisplayTr"
          :data="tableListData"
          :total="list.total"
          :page-size="list.pageSize"
          :current-page="list.currentPage"
          @page-size-change="handlePageSizeChange"
          @page-change="getData({ page: $event })"
          style="flex: 1;"
        >
          <template slot="toolbar">
            <div class="columns">
              <div class="left">
                <el-form :inline="true" :model="searchForm" label-suffix=":">
                  <string-input
                    label
                    placeholder="搜索类型名称"
                    name="keywords"
                    :value="searchForm.keywords"
                    @input="searchForm.keywords = $event"
                  ></string-input>

                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right">
                <el-button
                  type="success"
                  size="medium"
                  @click="repositoryFormNew.show()"
                >新增</el-button>
              </div>
            </div>
          </template>

          <div slot="typeName" slot-scope="{ row }">
            <p :style="`margin-left: ${row.__level * 20}px;margin-top:0;margin-bottom:0`">
              <span>
                <img
                  :src="toggleFoldingClass(row)"
                  @click="toggleFoldingStatus(row)"
                  class="permission_toggleFold"
                  :class="toggleFoldingClass(row)"
                >
              </span>
              {{row.typeName}}
            </p>
          </div>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text" size="medium" @click="repositoryFormLoad.show(row)">详情</el-button>
            <el-button type="text" size="medium" @click="repositoryFormEdit.show(row)">编辑</el-button>
            <el-button type="text" size="medium" class="warn" @click="deleteTraining(row.id)">删除</el-button>
          </div>
        </data-table>
      </page-card>
    </div>

    <repository-form ref="repositoryFormLoad" :disabled="true"></repository-form>
    <repository-form ref="repositoryFormNew"></repository-form>
    <repository-form ref="repositoryFormEdit"></repository-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import cloneDeep from 'lodash/cloneDeep'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import DataTable from '@/components/DataTable'
import RepositoryForm from './RepositoryForm'


const tableColumns = [
  { title: '类型名称', name: '__slot:typeName' },
  { title: '知识详情', name: '' },
  { title: '操作', name: '__slot:actions', width: '180px' }
]

export default {
  name: 'RepositoryList',

  components: {
    Breadcrumb,
    PageCard,
    DataTable,
    RepositoryForm
  },

  data () {
    return {
      foldList: [], // 该数组中的值 都会在列表中进行隐藏 
      importDialogVisible: false,
      tableColumns,
      searchForm: {
        keywords: null
      },
    }
  },

  computed: {
    ...mapState('repository', ['list']),

    repositoryFormLoad () {
      return this.$refs.repositoryFormLoad
    },

    repositoryFormNew () {
      return this.$refs.repositoryFormNew
    },

    repositoryFormEdit () {
      return this.$refs.repositoryFormEdit
    },

    // 记录属性结构的首层节点
    foldAllList () {
      return this.tableListData.map(x => x.__identity)
    },

    tableListData () {
      return this.formatConversion([], cloneDeep(this.list.items))
    }
  },

  methods: {
    ...mapMutations('repository', ['setListPageSize']),
    ...mapActions('repository', ['getData', 'delete', 'filterData']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.getData()
    },

    search () {
      this.filterData(this.searchForm)
    },

    deleteTraining (id) {
      this.$confirm('此知识库及其子类知识库也会被删除！', '确认删除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
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
    },

    // 切换展开 还是折叠
    toggleFoldingStatus (params) {
      this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
    },

    // 该方法会对每一行数据都做判断 如果foldList 列表中的元素 也存在与当前行的 __family列表中  则该行不展示
    toggleDisplayTr ({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        let item = this.foldList[i]
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item) return 'display:none;'
      }
      return ''
    },

    // 根据foldList是否存在当前节点的标识返回相应的折叠或展开图标
    toggleFoldingClass (params) {
      if (params.children) {
        return params.children.length === 0 ? '' : (this.foldList.indexOf(params.__identity) === -1 ? 'static/images/table-reduce.png' : 'static/images/table-add.png')
      }
    },

    // 将树形接口数据扁平化
    formatConversion (parent, children, index = 0, family = [], elderIdentity = 'x') {
      if (children && children.length > 0) {
        children.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          this.$set(x, '__level', index)
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          this.$set(x, '__family', [...family, elderIdentity + '_' + i])
          // 本身的唯一标识 
          this.$set(x, '__identity', elderIdentity + '_' + i)
          parent.push(x)
          // 如果仍有子集，则进行递归
          if (x.children && x.children.length > 0) {
            return this.formatConversion(parent, x.children, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
          }
        })
      }
      return parent
    }
  },

  created () {
    this.getData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.columns .right {
  display: flex;
  align-items: center;
}
.permission_toggleFold {
  display: inline-block;
  vertical-align: middle;
  width: 19px;
  &:hover {
    cursor: pointer;
  }
}

.import-button {
  color: #57687c;
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
