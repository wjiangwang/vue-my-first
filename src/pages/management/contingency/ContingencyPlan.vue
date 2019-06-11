<template>
  <div class="page">
    <breadcrumb
      :items="[{ name: '应急预案' ,route:{ name: 'emergency-rescue-plans' }},{name:enterpriseName}]"
      v-if="isManagement"
    ></breadcrumb>
    <breadcrumb :items="[{ name: '应急预案'}]" v-else></breadcrumb>

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
                    placeholder="请输入应急预案名称"
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
                  type="success"
                  size="medium"
                  @click="newPlaneForm.show()"
                  v-if="!isManagement && !isRedirect"
                >新增</el-button>
              </div>
            </div>
          </template>

          <div slot="isReview" slot-scope="{ row }">{{row.isReview === 0 ? '否' : '是'}}</div>
          <div slot="isRecord" slot-scope="{ row }">{{row.isRecord === 0 ? '否' : '是'}}</div>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button
              type="text"
              size="medium"
              :readonly="true"
              @click="detailPlaneForm.show(row.id)"
            >详情</el-button>
            <el-button
              v-if="canEdit && !isRedirect"
              type="text"
              size="medium"
              @click="editPlaneForm.show(row.id)"
            >编辑</el-button>
            <el-button
              v-if="canEdit && !isRedirect"
              type="text"
              size="medium"
              class="warn"
              @click="deleteUser(row.id)"
            >删除</el-button>
          </div>
        </data-table>
      </page-card>
    </div>

    <plan-form ref="newPlaneForm"></plan-form>
    <plan-form ref="editPlaneForm"></plan-form>
    <plan-form ref="detailPlaneForm" :readonly="true"></plan-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import PlanForm from './PlanForm'
import Breadcrumb from '@/components/Breadcrumb'


const tableColumns = [
  { title: '预案名称', name: 'planName' },
  { title: '预案级别', name: 'planLevel' },
  { title: '制定人', name: 'makingPeople' },
  { title: '是否评审', name: '__slot:isReview' },
  { title: '是否备案', name: '__slot:isRecord' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'ContingencyPlan',

  props: {
    canEdit: {
      type: Boolean,
      default: false
    },

    isManagement: {
      type: Boolean,
      default: false
    },

    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  components: {
    DataTable,
    PageCard,
    PlanForm,
    Breadcrumb
  },

  data () {
    return {
      searchForm: {
        keywords: ''
      },
      tableColumns,
    }
  },

  computed: {
    ...mapState('contingencyPlan', ['list']),

    newPlaneForm () {
      return this.$refs.newPlaneForm
    },

    editPlaneForm () {
      return this.$refs.editPlaneForm
    },

    detailPlaneForm () {
      return this.$refs.detailPlaneForm
    },
  
    enterpriseName(){
      return this.$route.params.enterpriseName
    }
  },

  methods: {
    ...mapMutations('contingencyPlan', ['setListParams', 'setListPageSize']),
    ...mapActions('contingencyPlan', ['loadListData', 'filterListData', 'delete']),
    ...mapActions('getDropdownOption', ['getDropdown']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },
    search () {
      this.filterListData(this.searchForm)
    },

    deleteUser (id) {
      this.$confirm('确认删除该预案？', '确认删除', {
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
