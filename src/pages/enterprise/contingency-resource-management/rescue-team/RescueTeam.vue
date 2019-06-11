<template>
  <div class="page">
    <div class="page-main rescue-team" :scrollable="false" v-loading="list.loading">
      <data-table
        class="rescue-team-table"
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
                <el-form-item label="队伍类型">
                  <el-select v-model="searchForm.rescueTeamType" placeholder="请选择救援队类型" clearable>
                    <el-option
                      v-for="item in dropDown.teamTypeSelect"
                      :key="item.index"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <string-input
                  placeholder="请输入队伍名称"
                  name="keywords"
                  @input="searchForm.keywords = $event"
                ></string-input>
                <date-range-input label="成立时间" name="dateRange" @input="dateRange = $event"></date-range-input>

                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="right" v-if="!isRedirect">
              <el-button type="success" size="medium" @click="newRescueTeamForm.show()">新增</el-button>
            </div>
          </div>
        </template>
        <div
          slot="subordinateCompany"
          slot-scope="{ row }"
          v-if="isManagement"
        >{{row.subordinateCompany}}</div>

        <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button type="text" size="medium" @click="detailRescueTeamForm.show(row.id)">详情</el-button>
          <!-- TODO: 所属单位 是政府的话可以编辑 删除 -->
          <el-button
            type="text"
            size="medium"
            @click="editRescueTeamForm.show(row.id)"
            v-if="!isRedirect && (isManagement ? (row.isGovernmentCreate===0 ? false : true) : true)"
          >编辑</el-button>
          <el-button
            type="text"
            size="medium"
            class="warn"
            @click="deleteTeam(row.id)"
            v-if="!isRedirect && (isManagement ? (row.isGovernmentCreate===0 ? false : true) : true)"
          >删除</el-button>
        </div>
      </data-table>
      <div class="iframe-warp">
        <div class="rescue-team-iframe-container" v-if="attachment.lastIndexOf('.pdf') > -1">
          <iframe :src="attachment"></iframe>
        </div>
        <div class="rescue-team-iframe-container" v-else>
          <iframe :src="'https://view.officeapps.live.com/op/view.aspx?src=' + attachment"></iframe>
        </div>
      </div>
    </div>

    <rescue-team-form ref="newRescueTeamForm"></rescue-team-form>
    <rescue-team-form ref="editRescueTeamForm"></rescue-team-form>
    <rescue-team-form :readonly="true" ref="detailRescueTeamForm"></rescue-team-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import RescueTeamForm from './RescueTeamForm'
import dayjs from 'dayjs'


export default {
  name: 'RescueTeam',

  components: {
    DataTable,
    PageCard,
    RescueTeamForm
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
      attachment: 'http://shuangkong.oss-cn-qingdao.aliyuncs.com/drill-record/1553501341884/test.docx',
      dateRange: [],
      dropDown: {
        teamTypeSelect: [],
        subordinateCompanySelect: []
      },
      searchForm: {
        companyId: null,
        rescueTeamType: null,
        keywords: null,
      },
    }
  },

  computed: {
    ...mapState('enterpriseRescueTeam', ['list']),

    newRescueTeamForm () {
      return this.$refs.newRescueTeamForm
    },

    editRescueTeamForm () {
      return this.$refs.editRescueTeamForm
    },

    detailRescueTeamForm () {
      return this.$refs.detailRescueTeamForm
    },

    tableColumns () {
      return this.isManagement ? [
        { title: '所属单位', name: 'enterpriseName' },
        { title: '队伍名称', name: 'rescueTeamName' },
        { title: '类型', name: 'rescueTeamType' },
        { title: '主要负责人', name: 'mainHead' },
        { title: '电话', name: 'onDutyPhone' },
        { title: '成立日期', name: 'setUpTime', type: 'date' },
        { title: '操作', name: '__slot:actions' }
      ] : [
          { title: '队伍名称', name: 'rescueTeamName' },
          { title: '类型', name: 'rescueTeamType' },
          { title: '主要负责人', name: 'mainHead' },
          { title: '电话', name: 'onDutyPhone' },
          { title: '成立日期', name: 'setUpTime', type: 'date' },
          { title: '操作', name: '__slot:actions' }
        ]
    }
  },

  methods: {
    ...mapMutations('enterpriseRescueTeam', ['setListParams', 'setListPageSize']),
    ...mapActions('enterpriseRescueTeam', ['loadListData', 'filterListData', 'delete']),
    ...mapActions('getDropdownOption', ['getDropdown', 'getCompanyAll']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      let [startAt, endAt] = this.dateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      Object.assign(this.searchForm, { startAt, endAt })
      this.filterListData(this.searchForm)
    },

    deleteTeam (id) {
      this.$confirm('确认删除该救援队信息？', '确认删除', {
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
    this.dropDown.teamTypeSelect = await this.getDropdown({ type: '救援队类型' })
    if (this.isManagement) this.dropDown.subordinateCompanySelect = await this.getCompanyAll()
  }
}
</script>

<style lang="scss" scoped>
.rescue-team {
  display: flex;
  .rescue-team-table {
    width: 50%;
  }
  .iframe-warp {
    width: 50%;
    height:  calc(100% - 50px);
    .rescue-team-iframe-container {
      width: 100%;
      height: 100%;
      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
