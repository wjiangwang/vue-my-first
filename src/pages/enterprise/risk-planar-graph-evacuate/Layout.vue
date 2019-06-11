<template>
  <layout :secondUrl="secondUrl"></layout>
</template>

<script>
import layout from '@/pages/enterprise/risk-lassification-control/general-layout/Layout'

export default {
  name: 'riskPlanarGraphEvacuate',

  components: {
    layout
  },

  computed: {
    secondUrl () {
      return 'contingency-evacuation-graph'
    }
  }
}
</script>

