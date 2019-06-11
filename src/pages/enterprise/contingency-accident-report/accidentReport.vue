<template>
  <div class="page accident-report">
    <breadcrumb :items="[{ name: '事故管理'}]" v-if="isManagement"></breadcrumb>
    <breadcrumb
      :items="[{ name: '事故管理',route:{name:'contingency-accident-statistics'} },{ name: '事故报送'}]"
      v-else
    ></breadcrumb>

    <div class="page-main" :scrollable="false" v-loading="list.loading">
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
                  <el-form-item label="所属企业" v-if="isManagement">
                    <el-select
                      v-model="searchForm.companyId"
                      placeholder="请选择"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in dropDown.enterpriseSelect"
                        :key="item.index"
                        :label="item.enterpriseName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="事故类别">
                    <el-select v-model="searchForm.accidentType" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dropDown.accidentTypeSelect"
                        :key="item.index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>-->
                  <el-form-item label="事故等级">
                    <el-select v-model="searchForm.accidentLevel" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in dropDown.accidentLevelSelect"
                        :key="item.index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <string-input
                    placeholder="请输入事故名称"
                    name="keywords"
                    @input="searchForm.keywords = $event"
                  ></string-input>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>

              <div class="right" v-if="!isRedirect">
                <el-button
                  type="success"
                  size="medium"
                  @click="newaccidentReportForm.show({isManagement})"
                >新增</el-button>
              </div>
            </div>
          </template>

          <div slot="enterpriseName" slot-scope="{ row }" v-if="isManagement">{{row.enterpriseName}}</div>
          <div slot="actions" slot-scope="{ row }" class="table-actions">
            <el-button
              type="text"
              size="medium"
              @click="detailaccidentReportForm.show({isManagement,id:row.id})"
            >详情</el-button>
            <el-button
              type="text"
              size="medium"
              @click="editaccidentReportForm.show({isManagement,id:row.id})"
              v-if="!isRedirect && (isManagement ? (row.fill === '企业' ? false : true) : (row.fill === '政府' ? false : true))"
            >编辑</el-button>
          </div>
        </data-table>
      </page-card>
    </div>

    <accident-report-form ref="newaccidentReportForm"></accident-report-form>
    <accident-report-form ref="editaccidentReportForm"></accident-report-form>
    <accident-report-form :readonly="true" ref="detailaccidentReportForm"></accident-report-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import accidentReportForm from './accidentReportForm'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'accidentReport',

  components: {
    DataTable,
    PageCard,
    accidentReportForm,
    Breadcrumb
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
      accidentType: '',
      dropDown: {
        enterpriseSelect: [],
        accidentTypeSelect: [],
        accidentLevelSelect: [],
      },
      searchForm: {
        companyId: null,
        accidentType: null,
        accidentLevel: null,
        keywords: null,
      },
    }
  },

  computed: {
    ...mapState('contingencyAccidentReport', ['list']),

    newaccidentReportForm () {
      return this.$refs.newaccidentReportForm
    },

    editaccidentReportForm () {
      return this.$refs.editaccidentReportForm
    },

    detailaccidentReportForm () {
      return this.$refs.detailaccidentReportForm
    },

    tableColumns () {
      return this.isManagement ? [
        { title: '企业名称', name: '__slot:enterpriseName' },
        { title: '事故名称', name: 'accidentName' },
        { title: '事故类型', name: 'accidentType' },
        { title: '事故等级', name: 'accidentLevel' },
        { title: '填报', name: 'fill' },
        { title: '经办科室', name: 'operationDepartment' },
        { title: '操作', name: '__slot:actions' }
      ] : [
          { title: '事故名称', name: 'accidentName' },
          { title: '事故类型', name: 'accidentType' },
          { title: '事故等级', name: 'accidentLevel' },
          { title: '填报', name: 'fill' },
          { title: '经办科室', name: 'operationDepartment' },
          { title: '操作', name: '__slot:actions' }
        ]
    }
  },

  methods: {
    ...mapMutations('contingencyAccidentReport', ['setListParams', 'setListPageSize']),
    ...mapActions('contingencyAccidentReport', ['loadListData', 'filterListData', 'delete']),
    ...mapActions('getDropdownOption', ['getDropdown', 'getCompanyAll']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },
  },

  async created () {
    this.searchForm.accidentType = this.$route.params.type
    this.search()

    this.dropDown.accidentTypeSelect = await this.getDropdown({ type: '事故类型' })
    this.dropDown.accidentLevelSelect = await this.getDropdown({ type: '事故级别' })
    if (this.isManagement) this.dropDown.enterpriseSelect = await this.getCompanyAll()
  }
}
</script>

<style lang="scss">
.accident-report {
  /deep/ .toolbar {
    .left {
      .el-input {
        padding-bottom: 10px !important;
      }
    }
  }
}
</style>
