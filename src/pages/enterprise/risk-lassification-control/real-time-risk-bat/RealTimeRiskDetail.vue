<template>
  <div class="page">
    <!-- <breadcrumb :items="breadcrumbItems"></breadcrumb> -->

    <page-card class="page-main" :scrollable="false" v-loading="list.loading">
      <div class="enterprise-risk-assessments">
        <div class="title-top">
          <div class="name">
            <img src="@/assets/icons/bell.png" class="icon">
            <h1>作业类型名称：{{risk.riskName}}</h1>
          </div>
          <div class="detail">
            <ul>
              <li>
                <span class="label">二级编码:</span>
                <span class="value">{{risk.oneCoding}}</span>
              </li>
              <li>
                <span class="label">辨识人:</span>
                <span class="value">{{risk.identifyPerson}}</span>
              </li>
              <li>
                <span class="label">辨识日期:</span>
                <span class="value">{{risk.identifyDate | strftime}}</span>
              </li>
              <li>
                <span class="label">审核人:</span>
                <span class="value">{{risk.auditor}}</span>
              </li>
              <li>
                <span class="label">审核日期:</span>
                <span class="value">{{risk.auditDate | strftime}}</span>
              </li>
            </ul>
          </div>

          <!-- <div class="actions" v-if="canEdit && !isRedirect">
          <a href="javascript:;" class="edit" @click="riskAssessmentForm.show($route.params.id)">
            <img src="@/assets/icons/square-edit.png">
          </a>
          </div>-->
        </div>
        <div class="data-table-warp">
          <data-table
            :columns="tableColumns"
            :data="list.items"
            :total="list.total"
            :page-size="list.pageSize"
            :current-page="list.currentPage"
            @page-size-change="handlePageSizeChange"
            @page-change="loadListData({ page: $event })"
          >
            <template slot="toolbar">
              <div class="columns">
                <div class="left">三级项列表</div>
              </div>
            </template>

            <div
              class="risk-level"
              slot="level"
              slot-scope="{ row }"
            >{{riskLevelText(row.riskLevel)}}</div>

            <div slot="actions" slot-scope="{ row }" class="table-actions">
              <el-button
                type="text"
                size="medium"
                @click="realTimeRiskDetailForm.show({ id: row.id, readonly: true })"
              >详情</el-button>
              <el-button
                type="text"
                size="medium"
                @click="realTimeRiskDetailForm.show({ id: row.id })"
                v-if="!isRedirect"
              >编辑</el-button>
              <el-button
                type="text"
                size="medium"
                class="warn"
                @click="deleteRiskAssessment(row.id)"
                v-if="!isRedirect"
              >删除</el-button>
            </div>
          </data-table>
        </div>
      </div>
    </page-card>

    <real-time-risk-detail-form
      ref="realTimeRiskDetailForm"
      :second-item-id="$route.params.id"
      :type="'JHA'"
    ></real-time-risk-detail-form>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import RealTimeRiskDetailForm from './RealTimeRiskDetailForm'

const tableColumns = [
  { title: '三级编码', name: 'threeCoding' },
  { title: '三级子项', name: 'name' },
  { title: '级别', name: '__slot:level' },
  { title: '操作', name: '__slot:actions' }
]

export default {
  name: 'RealTimeRiskDetail',

  components: {
    PageCard,
    Breadcrumb,
    DataTable,
    RealTimeRiskDetailForm
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    },

    breadcrumbs: {
      type: Array,
      default () { return [] }
    },

    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      risk: {},
      tableColumns: tableColumns,
      searchForm: {
        keywords: null
      }
    }
  },

  watch: {
  },

  computed: {
    ...mapState('realTimeRiskThird', ['list']),

    breadcrumbItems () {
      if (this.breadcrumbs.length && this.breadcrumbs[0].route.path) {
        this.breadcrumbs[0].route.path = this.$resolveRoutePath(this.breadcrumbs[0].route.path)
      }
      return this.breadcrumbs
    },

    realTimeRiskDetailForm () {
      return this.$refs.realTimeRiskDetailForm
    }
  },

  methods: {
    ...mapMutations('realTimeRiskThird', ['setListParams', 'setListPageSize']),
    ...mapActions('realTimeRiskThird', [
      'loadListData', 'filterListData', 'delete']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    search () {
      this.filterListData(this.searchForm)
    },

    deleteRiskAssessment (id) {
      this.$confirm('确认删除该风险点？', '确认删除', {
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
    },

    riskLevelText (level) {
      switch (level) {
        case 1:
          return '重大风险'
        case 2:
          return '较大风险'
        case 3:
          return '一般风险'
        case 4:
          return '低风险'
      }
    }
  },

  async created () {
    this.setListParams({ secondId: this.$route.params.id })
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  border-top: none;
  /deep/ .card-body {
    //padding: 20px 0 0 !important;
    display: flex;
    flex-direction: column;
  }
}
.data-table-warp {
  height: calc(100% - 153px);
  border: 1px solid #d7e3eb;
  border-radius: 4px;
  margin-left: 20px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.title-top {
  margin: 15px 0px 15px 20px;
  padding: 24px 20px;
  flex-direction: column;
  align-items: flex-start !important;
  position: relative;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #d7e3eb;
  border-radius: 4px;

  .name {
    display: flex;
    align-items: center;
    margin-bottom: 28px;

    .icon {
      width: 34px;
      height: 34px;
      margin-right: 8px;
    }

    h1 {
      font-size: 22px;
      line-height: 30px;
      margin: 0;
    }
  }

  .detail {
    font-size: 13px;
    color: #333;
    line-height: 17px;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: inline-block;
        margin-right: 30px;
      }
    }
  }

  .actions {
    position: absolute;
    top: 14px;
    right: 35px;

    .edit img {
      width: 19px;
      height: 18px;
    }
  }
}
.enterprise-risk-assessments {
  flex: 1;
  margin-top: -14px;
  width: 100%;
  height: 60%;
  .risk-level {
    .count {
      width: 25px;
      height: 25px;
      margin-right: 5px;
      color: #fff;
      display: inline-block;
      text-align: center;
      line-height: 25px;
      font-size: 13px;

      &.first {
        background: #fa5878;
      }

      &.second {
        background: #fea340;
      }

      &.third {
        background: #f4d341;
      }

      &.fourth {
        background: #37a9fa;
      }
    }
  }

  .risk {
    display: flex;
    align-items: center;

    .wrapper {
      margin-right: 10px;
      position: relative;
      width: 25px;
      height: 25px;

      .triangle {
        position: absolute;
        top: -12.5px;
        width: 0;
        height: 0;
        border: 12.5px solid transparent;
      }

      &.first .triangle {
        border-bottom: 25px solid#FEA340;
      }

      &.second .triangle {
        border-bottom: 25px solid #f4d341;
      }

      .count {
        position: absolute;
        color: #fff;
        line-height: 25px;
        top: 5px;
        width: 100%;
        text-align: center;
        font-size: 13px;
      }
    }
  }

  .qrcode {
    img {
      width: 25px;
      height: 25px;
    }
  }
}
</style>
