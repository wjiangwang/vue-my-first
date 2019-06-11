<template>
  <div class="hierarchy-tree-container" v-loading="loading">
    <el-form :inline="true" :model="searchForm" size="small" style="text-align: right;">
      <el-form-item>
        <el-select
          v-model="searchForm.riskId"
          placeholder="请选一级风险点"
          clearable
          @change="search"
          filterable
        >
          <el-option
            v-for="item in riskOptions"
            :key="item.id"
            :label="item.riskName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.type" placeholder="请选排查方式" clearable @change="search">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
      </el-form-item>-->
    </el-form>
    <scroll-view style="width:100%; height:calc(100% - 50px);">
      <org-tree
        class="org-tree"
        :data="treeData"
        :collapsable="false"
        :props="treeProps"
        :horizontal="true"
        :labelClassName="handleClassName"
        @on-node-click="handleNodeClick"
      ></org-tree>
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import OrgTree from '@/components/org-tree/org-tree'
import ScrollView from '@/components/ScrollView'
import dayjs from 'dayjs'

export default {
  name: 'CheckControlBookTreeChart',

  components: {
    ScrollView,
    OrgTree
  },

  data () {
    return {
      loading: true,
      treeData: {},
      treeProps: {
        label: 'name', children: 'children', expand: 'expand'
      },
      searchForm: {
        type: '',
        riskId: '',
      },
      riskOptions: [],
      options: [
        {
          label: '日常排查隐患',
          value: 1
        },
        {
          label: '综合隐患排查',
          value: 2
        },
        {
          label: '专业隐患排查',
          value: 3
        },
        {
          label: '全厂隐患排查',
          value: 4
        },
      ]
    }
  },

  computed: {
  },

  methods: {
    ...mapMutations('hiddenCheckControlBook', ['setListParams', 'setListData']),
    ...mapActions('hiddenCheckControlBook', ['loadListData', 'getTree', 'filterListData', 'loadDetail', 'getRiskOptions']),

    handleClassName (item) {
      if (item.children) { return 'has-node-children' }//#fcb738
      else { return 'no-node-children' }//#3ab882
    },

    handleNodeClick (data) {
      if (data.children) return false

      if (data.startTime) {
        this.setListParams({ holidayTime: this.timeDesc(data.startTime) })
        this.setListParams({ hiddenTypes: '' })
        this.loadListData({ reset: true })
      } else {
        this.setListParams({ holidayTime: '' })
        this.setListParams({ hiddenTypes: data.name })
        this.loadListData({ reset: true })
      }
    },

    timeDesc (t) {
      return t ? dayjs(t).format('YYYY-MM-DD') : '-'
    },
    search () {
      this.setListParams(this.searchForm)
      // this.loadListData({ reset: true })
      // this.setListData({
      //   total: 0,
      //   items: []
      // })
    }
  },

  async created () {
    let data = await this.getTree()
    this.treeData =
      {
        name: "隐患类型",
        children: data,
      }

    this.riskOptions = await this.getRiskOptions()
    this.loading = false
  }
}

</script>

<style lang="scss">
.org-tree {
  // margin: 0 auto;
  .has-node-children,
  .no-node-children {
    font-size: 14px;
    color: #ffffff;
    padding: 5px 10px !important;
    background: #fcb738;
    &:hover {
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.19), 0 6px 10px rgba(0, 0, 0, 0.23);
    }
  }
  .no-node-children {
    background: #3ab882;
  }
}
</style>

<style lang="scss" scoped>
.hierarchy-tree-container {
  height: 100%;
}
.tree-table {
  margin: 50px;
}
</style>
