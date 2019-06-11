<template>
  <div @click.stop="$event.stopPropagation()">
    <el-dialog
      :visible.sync="visible"
      :title="title"
      width="600px"
      @close="handleClose"
      :modal="true"
    >
      <data-table
        v-loading="list.loading"
        :columns="tableColumns"
        :data="list.items"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        :height="400"
        :border="false"
        @page-size-change="handlePageSizeChange"
        @page-change="loadListData({ type, page: $event })"
        class="enterprise-table"
      >
        <template slot="name" slot-scope="{ row }">
          <template v-if="type === 'control'">{{row.enterpriseName}}</template>
          <el-button
            v-else
            type="text"
            size="medium"
            class="link-name"
            @click="handleEnterpriseClick(row.id)"
          >{{row.enterpriseName}}</el-button>
        </template>
      </data-table>
    </el-dialog>

    <enterprise-risk-trend ref="riskTrend"></enterprise-risk-trend>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import DataTable from '@/components/DataTable'
import EnterpriseRiskTrend from './EnterpriseRiskTrend'

const tableColumns = [
  { title: '企业名称', name: '__slot:name' },
  { title: '风险点', name: 'risk', width: '80px' },
  { title: '隐患', name: 'hidden', width: '60px' }
]

export default {
  name: 'DashboardEnterprises',

  components: {
    DataTable,
    EnterpriseRiskTrend
  },

  data () {
    return {
      visible: false,
      type: null,
      title: ''
    }
  },

  computed: {
    ...mapState('dashboardEnterprise', ['list']),

    tableColumns () {
      if (this.type === 'trend') {
        return tableColumns.slice(0)
      } else {
        return tableColumns.slice(0, 1)
      }
    }
  },

  methods: {
    ...mapMutations('dashboardEnterprise', ['setListParams', 'setListPageSize']),
    ...mapActions('dashboardEnterprise', ['loadListData']),

    show ({ title, type, params = {} } = {}) {
      this.visible = true
      this.title = title
      this.type = type
      this.setListParams(params)
      this.loadListData({ type })
    },

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData({ type: this.type })
    },

    handleEnterpriseClick (enterpriseId) {
      this.$router.push({
        name: 'emap-risk-planar-graph',
        params: { enterpriseId }
      })
      // switch (this.type) {
      // case 'riskLevel':
      //   this.$router.push({
      //     name: 'emap-risk-planar-graph',
      //     params: { enterpriseId }
      //   })
      //   break
      // case 'label':
      //   this.$router.push({
      //     name: 'enterprise-detail',
      //     params: { id: enterpriseId }
      //   })
      //   break
      // case 'trend':
      //   this.$refs.riskTrend.show(enterpriseId)
      //   break
      // }
    },

    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.enterprise-table {
  margin: -20px -15px;

  /deep/ .toolbar {
    display: none;
  }

  .link-name {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
