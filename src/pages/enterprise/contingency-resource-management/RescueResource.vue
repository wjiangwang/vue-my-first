<template>
  <div class="page">
    <div class="page-main rescue-resource" :scrollable="false" v-loading="list.loading">
      <data-table
        class="rescue-resource-table"
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
                <el-form-item label="所属单位" v-if="isManagement">
                  <el-select
                    v-model="searchForm.companyId"
                    placeholder="请选择所属单位"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in dropDown.subordinateCompanySelect"
                      :key="item.index"
                      :label="item.enterpriseName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="资产类型">
                  <el-select v-model="searchForm.assetTypes" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in dropDown.assetTypesSelect"
                      :key="item.index"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <string-input
                  placeholder="请输入装备名称"
                  name="keywords"
                  @input="searchForm.keywords = $event"
                ></string-input>

                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="right" v-if="!isRedirect">
              <el-button type="success" size="medium" @click="newRescueResource.show()">新增</el-button>
            </div>
          </div>
        </template>
        <div
          slot="subordinateCompany"
          slot-scope="{ row }"
          v-if="isManagement"
        >{{row.subordinateCompany}}</div>

        <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button type="text" size="medium" @click="detailRescueResource.show(row.id)">详情</el-button>
          <!-- TODO: 所属单位 是政府的话可以编辑 删除 -->
          <el-button
            type="text"
            size="medium"
            @click="editRescueResource.show(row.id)"
            v-if="!isRedirect && (isManagement ? (row.isGovernmentCreate===0 ? false : true) : true)"
          >编辑</el-button>
          <el-button
            type="text"
            size="medium"
            class="warn"
            @click="deleteRescueResource(row.id)"
            v-if="!isRedirect && (isManagement ? (row.isGovernmentCreate===0 ? false : true) : true)"
          >删除</el-button>
        </div>
      </data-table>
    </div>

    <rescue-resource-form ref="newRescueResource"></rescue-resource-form>

    <rescue-resource-form ref="editRescueResource"></rescue-resource-form>
    <rescue-resource-form :readonly="true" ref="detailRescueResource"></rescue-resource-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import RescueResourceForm from './RescueResourceForm'


export default {
  name: 'RescueResource',

  components: {
    DataTable,
    PageCard,
    RescueResourceForm
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
        assetTypesSelect: [],
        subordinateCompanySelect: []
      },
      searchForm: {
        companyId: null,
        assetTypes: null,
        keywords: null,
      },
    }
  },

  computed: {
    ...mapState('enterpriseRescueResource', ['list']),

    newRescueResource () {
      return this.$refs.newRescueResource
    },

    editRescueResource () {
      return this.$refs.editRescueResource
    },

    detailRescueResource () {
      return this.$refs.detailRescueResource
    },

    tableColumns () {
      return this.isManagement ? [
        { title: '所属单位', name: 'enterpriseName' },
        { title: '装备名称', name: 'equipmentName' },
        { title: '资产类型', name: 'assetTypes' },
        { title: '出厂日期', name: 'deliveryTime', type: 'date' },
        { title: '移动电话', name: 'phone' },
        { title: '操作', name: '__slot:actions' }
      ] : [
          { title: '装备名称', name: 'equipmentName' },
          { title: '资产类型', name: 'assetTypes' },
          { title: '出厂日期', name: 'deliveryTime', type: 'date' },
          { title: '移动电话', name: 'phone' },
          { title: '操作', name: '__slot:actions' }
        ]
    }
  },

  methods: {
    ...mapMutations('enterpriseRescueResource', ['setListParams', 'setListPageSize']),
    ...mapActions('enterpriseRescueResource', ['loadListData', 'filterListData', 'delete']),
    ...mapActions('getDropdownOption', ['getDropdown', 'getCompanyAll']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },

    deleteRescueResource (id) {
      this.$confirm('确认删除该装备？', '确认删除', {
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
    this.loadListData({ reset: true })
    this.dropDown.assetTypesSelect = await this.getDropdown({ type: '资产类型' })
    if (this.isManagement) this.dropDown.subordinateCompanySelect = await this.getCompanyAll()
  }
}
</script>
<style lang="scss" scoped>
.rescue-resource {
  //display: flex;
  .rescue-resource-table {
    width: 50%;
  }
}
</style>