<template>
  <div class="page">
    <div class="page-main rescue-expert" :scrollable="false" v-loading="list.loading">
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
                <el-form-item label="专业">
                  <string-input
                    placeholder="请输入专业"
                    name="keywords"
                    @input="searchForm.professional = $event"
                  ></string-input>
                </el-form-item>
                <string-input
                  placeholder="请输入姓名"
                  name="keywords"
                  @input="searchForm.keywords = $event"
                ></string-input>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="right" v-if="!isRedirect">
              <el-button type="success" size="medium" @click="newRescueExpert.show()">新增</el-button>
            </div>
          </div>
        </template>
        <div
          slot="subordinateCompany"
          slot-scope="{ row }"
          v-if="isManagement"
        >{{row.subordinateCompany}}</div>

        <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button type="text" size="medium" @click="detailRescueExpert.show(row.id)">详情</el-button>
          <!-- TODO: 所属单位 是政府的话可以编辑 删除 -->
          <el-button
            type="text"
            size="medium"
            @click="editRescueExpert.show(row.id)"
            v-if="!isRedirect && (isManagement ? (row.isGovernmentCreate===0 ? false : true) : true)"
          >编辑</el-button>
          <el-button
            type="text"
            size="medium"
            class="warn"
            @click="deleteRescueExpert(row.id)"
            v-if="!isRedirect && (isManagement ? (row.isGovernmentCreate===0 ? false : true) : true)"
          >删除</el-button>
        </div>
      </data-table>
      <div class="iframe-warp">
        <div class="rescue-expert-iframe-container" v-if="attachment.lastIndexOf('.pdf') > -1">
          <iframe :src="attachment"></iframe>
        </div>
        <div class="rescue-expert-iframe-container" v-else>
          <iframe :src="'https://view.officeapps.live.com/op/view.aspx?src=' + attachment"></iframe>
        </div>
      </div>
    </div>

    <rescue-expert-form ref="newRescueExpert"></rescue-expert-form>
    <rescue-expert-form ref="editRescueExpert"></rescue-expert-form>
    <rescue-expert-form :readonly="true" ref="detailRescueExpert"></rescue-expert-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import PageCard from '@/components/PageCard'
import RescueExpertForm from './RescueExpertForm'


export default {
  name: 'RescueExpert',

  components: {
    DataTable,
    PageCard,
    RescueExpertForm
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
      dropDown: {
        subordinateCompanySelect: [],
      },
      searchForm: {
        companyId: null,
        professional: null,
        keywords: null,
      }
    }
  },

  computed: {
    ...mapState('enterpriseRescueExpert', ['list']),

    newRescueExpert () {
      return this.$refs.newRescueExpert
    },

    editRescueExpert () {
      return this.$refs.editRescueExpert
    },

    detailRescueExpert () {
      return this.$refs.detailRescueExpert
    },

    tableColumns () {
      return this.isManagement ? [
        { title: '所属单位', name: 'enterpriseName' },
        { title: '姓名', name: 'name' },
        { title: '所学专业', name: 'professional' },
        { title: '移动电话', name: 'phone' },
        { title: '操作', name: '__slot:actions' }
      ] : [
          { title: '姓名', name: 'name' },
          { title: '所学专业', name: 'professional' },
          { title: '移动电话', name: 'phone' },
          { title: '操作', name: '__slot:actions' }
        ]
    },
  },

  methods: {
    ...mapMutations('enterpriseRescueExpert', ['setListParams', 'setListPageSize']),
    ...mapActions('enterpriseRescueExpert', ['loadListData', 'filterListData', 'delete']),
    ...mapActions('getDropdownOption', ['getDropdown', 'getCompanyAll']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },

    deleteRescueExpert (id) {
      this.$confirm('确认删除该救援专家信息？', '确认删除', {
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
    if (this.isManagement) this.dropDown.subordinateCompanySelect = await this.getCompanyAll()
  }
}
</script>
<style lang="scss" scoped>
.rescue-expert {
  display: flex;
  .rescue-expert-table {
    width: 50%;
  }
  .iframe-warp {
    width: 50%;
    height: calc(100% - 50px);
    .rescue-expert-iframe-container {
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
