<template>
  <div class="dashboard-carousel-item-content planar-graph">
    <div class="sketch-wrapper">
      <risk-sketch
        :markups="markups"
        :image-url="planarGraph.url"
        :readonly="true"
        @select-markup="$emit('select-markup', $event.riskAssessmentId)"
        class="graph-sketch" :is-carousel="isCarousel"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import RiskSketch from '@/components/RiskSketch'

export default {
  name: 'PlanarGraph',

  components: {
    RiskSketch
  },

  props: {
    isCarousel: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState('enterpriseRiskGraph', ['markups', 'planarGraph']),
  }
}
</script>

<style lang="scss" scoped>
.planar-graph {
  flex: 1;
  display: flex;
  flex-direction: column;

  .sketch-wrapper {
    flex: 1;

    .graph-sketch /deep/ .actions {
      display: none;
    }
  }
}
</style>

