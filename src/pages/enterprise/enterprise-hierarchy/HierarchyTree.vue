<template>
  <div class="hierarchy-tree-container" v-loading="loading">
    <ve-tree :data="chartData" :settings="chartSettings" />
  </div>
</template>

<script>
import VeTree from 'v-charts/lib/tree.common'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HierarchyTree',

  components: {
    VeTree
  },

  computed: {
    ...mapState('hierarchyTree', ['loading', 'items']),

    chartData() {
      return {
        columns: ['name', 'value'],
        rows: [
          {
            name: 'tree1',
            value: [{
              name: '全公司',
              children: this.items
            }]
          }
        ]
      }
    },

    chartSettings() {
      return {
        seriesMap: {
          tree1: {
            orient: 'vertical',

            label: {
              normal: {
                distance: 10,
                position: 'top',
                verticalAlign: 'middle',
                align: 'middle'
              }
            },

            leaves: {
              label: {
                normal: {
                  position: 'bottom',
                  verticalAlign: 'middle',
                  align: 'middle'
                }
              }
            },

            tooltip: {
              formatter: '{b}'
            }
          }
        }
      }
    }
  },

  methods: {
    ...mapActions('hierarchyTree', ['loadItems'])
  },

  created() {
    this.loadItems()
  }
}
</script>
