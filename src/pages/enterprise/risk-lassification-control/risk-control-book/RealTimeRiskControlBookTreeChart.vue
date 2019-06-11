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

      treeData: [
        {
          name: '企业合规性',
          children: [
            {
              name: '企业证照',
              threeId:69088,
            },
            {
              threeId:69088,
              name: '设备证照',
            },
            {
              threeId:69088,
              name: '人员证照',
            },
          ]
        }, {
          name: '特种作业',
          children: [
            {
              threeId:69129,
              name: '动火作业',
            }, {
              threeId:69129,
              name: '动土作业',
            }
          ]
        },
        {
          name: '其他作业',
          children: [
            {
              threeId:69129,
              name: '其他作业 2-1',
            }, {
              threeId:69129,
              name: '其他作业 2-2',
            }
          ]
        },
        {
          name: '定时作业',
          children: [
            {
              name: '定时作业 2-1',
            }, {
              name: '定时作业 2-2',
            }
          ]
        }
      ],
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
    // this.loading=true
    // this.treeData = await this.getTree()
    // this.loading=false
  }
}
</script>
<style lang="scss" scoped>
.tree-table {
  margin: 50px;
}
</style>
