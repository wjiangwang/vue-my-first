<template>
  <layout :secondUrl="secondUrl"></layout>
</template>

<script>
import layout from '@/pages/enterprise/risk-lassification-control/general-layout/Layout'

export default {
  name: 'riskPlanarGraphMonitor',

  components: {
    layout
  },

  computed: {
    secondUrl () {
      return 'contingency-monitoring-graph'
    }
  }

}
</script>

