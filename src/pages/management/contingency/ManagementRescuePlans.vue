<template>
  <div class="page management-rescue-plans">
    <breadcrumb :items="[{ name: '应急预案' }]" v-if="isManagement" v-show="breadcrumbShow"></breadcrumb>
    <router-view/>
    <div class="page-main">
      <page-card :scrollable="false" v-loading="list.loading">
        <data-table
          :columns="tableColumns"
          :data="list.items"
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
                  <el-form-item label="所属集团" v-if="isManagement">
                    <el-select
                      v-model="searchForm.groupId"
                      placeholder="请选择所属集团"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in dropDown.subordinateGroupSelect"
                        :key="item.index"
                        :label="item.groupName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属行业" v-if="isManagement">
                    <el-select
                      v-model="searchForm.industryCategories"
                      placeholder="请选择所属行业"
                      clearable
                    >
                      <el-option
                        v-for="item in dropDown.subordinateIndustrySelect"
                        :key="item.index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属区域：">
                    <el-cascader
                      clearable
                      :change-on-select="true"
                      :props="areaOptionsProps"
                      :options="areaOptions"
                      v-model="area"
                      @change="handleAreaChange"
                    ></el-cascader>
                  </el-form-item>
                  <string-input
                    placeholder="请输入企业名称"
                    name="keywords"
                    @input="searchForm.keywords = $event"
                  ></string-input>

                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </template>

          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button type="text" size="medium" :readonly="true" @click="detail(row)">查看企业预案</el-button>
          </div>
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

export default {
  name: 'ManagementRescuePlans',

  props: {
    isManagement: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },

  components: {
    DataTable,
    PageCard,
    Breadcrumb,
  },

  data () {
    return {
      breadcrumbShow: true,
      areaOptionsProps: {
        value: 'code'
      },
      areaOptions: [],
      area: [],
      dropDown: {
        subordinateGroupSelect: [],
        subordinateIndustrySelect: [],
      },
      searchForm: {
        groupId: null,
        industryCategories: null,
        keywords: null,
        code: null,
      },
    }
  },

  computed: {
    ...mapState('managementContingencyPlan', ['list', 'totalNumber']),

    enterpriseId () {
      return parseInt(this.$route.params.id, 10)
    },

    tableColumns () {
      return [
        { title: '企业名称', name: 'enterpriseName' },
        { title: '所属行业', name: 'industryCategories' },
        { title: '联系人', name: 'linkMan' },
        { title: '联系电话', name: 'linkManMpho' },
        { title: '预案数量', name: 'planNumber', renderHeader: this.renderHeaderPlanNum },
        { title: '操作', name: '__slot:actions' }
      ]
    }
  },

  methods: {
    ...mapMutations('managementContingencyPlan', ['setListParams', 'setListPageSize']),
    ...mapActions('managementContingencyPlan', ['getData', 'filterData']),
    ...mapActions('getDropdownOption', ['getDropdown', 'getAllArea', 'groupAll', 'industryCategoriesAll']),

    handleAreaChange () {
      this.searchForm.code = this.area ? this.area[this.area.length - 1] : ''
    },

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.getData()
    },

    search () {
      this.filterData(this.searchForm)
    },

    detail (row) {
      this.$router.push({ name: `emergency-rescue-plans-detail`, params: { enterpriseId: row.id, enterpriseName: row.enterpriseName } })
    },

    renderHeaderPlanNum (h, { column, $index }, index) {
      return (
        <span>预案数量
          <span class="sum-num"> （{this.totalNumber.totalPlanNumber}） </span>
        </span>
      )
    },

  },

  beforeRouteUpdate (to, from, next) {
    this.breadcrumbShow = this.breadcrumbShow ? false : true
    next()
  },

  async created () {
    this.getData({ reset: true })
    if (this.isManagement) {
      this.dropDown.subordinateGroupSelect = await this.groupAll()
      this.dropDown.subordinateIndustrySelect = await this.industryCategoriesAll()
      this.areaOptions = await this.getAllArea()
    }
  }
}
</script>

<style lang="scss" scoped>
.management-rescue-plans {
  /deep/ .toolbar {
    .left {
      .el-input {
        padding-bottom: 10px !important;
      }
    }
  }

  .data-table {
    /deep/ .sum-num {
      color: #fea340;
    }
  }
}
</style>
