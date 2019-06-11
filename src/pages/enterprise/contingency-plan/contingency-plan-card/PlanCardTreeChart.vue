<template>
  <div class="hierarchy-tree-container" v-loading="loading">
    <ve-tree
      :data="chartData"
      :settings="chartSettings"
      :tooltip-formatter="tooltipFormatter"
      :height="'100%'"
    />
  </div>
</template>

<script>
import VeTree from 'v-charts/lib/tree.common'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PlanCardTreeChart',

  components: {
    VeTree
  },

  computed: {
    ...mapState('hierarchyTree', ['loading', 'items']),

    chartData () {
      let value = this.items.length > 1 ? [{
        name: '全公司',
        children: this.items
      }] : this.items

      return {
        columns: ['name', 'value'],
        rows: [
          {
            name: 'tree1',
            value
          }
        ]
      }
    },

    chartSettings () {
      return {
        seriesMap: {
          tree1: {
            // orient: 'vertical',
            orient: 'horizontal',

            label: {
              normal: {
                distance: 10,
                position: 'top',
                verticalAlign: 'middle',
                align: 'middle',
              }
            },

            leaves: {
              label: {
                normal: {
                  position: 'bottom',
                  verticalAlign: 'middle',
                  align: 'middle',
                }
              }
            },
            left: '10%',
            top: 0,
            bottom: 0,
            right: '10%',
            tooltip: {
              padding: 15,
            }
          }
        }
      }
    }
  },

  methods: {
    ...mapActions('hierarchyTree', ['loadItems']),

    tooltipFormatter (v) {
      return [
        v.marker + `${v.data.name}`,
        `持卡数量 ： ${v.data.controlLevel}`,
        `持卡人 ： 张三、李四、王麻子`,
      ].join('<br><br>')
    }
  },

  created () {
    this.loadItems()

  }
}
</script>
