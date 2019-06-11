<template>
  <div class="hierarchy-tree-container" v-loading="loading">
    <scroll-view style="height:100%; width:100%;">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        class="tree-table"
      ></el-tree>
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ScrollView from '@/components/ScrollView'

export default {
  name: 'RiskControlBookTreeChart',

  components: {
    ScrollView
  },
  data () {
    return {
      loading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    // ...mapState('hierarchyTree', ['loading', 'items']),



  },

  methods: {
    ...mapMutations('riskControlLedger', ['setListParams', 'setListData']),
    ...mapActions('riskControlLedger', ['loadListData', 'getTree']),

    handleNodeClick (data) {
      if (data.threeId) {
        console.log(data.threeId)
        this.setListData({
          total: 0,
          items: []
        })
        this.setListParams({ threeId: data.threeId })
        this.loadListData({ reset: true })
      }
    }

  },

  async created () {
    this.loading = true
    this.treeData = await this.getTree()
    this.loading = false
  }
}
</script>
<style lang="scss" scoped>
.tree-table {
  margin: 50px;
}
</style>
