<template>
  <div class="page">
    <div class="page-main">
      <planar-graph-editor
        :is-redirect="isRedirect"
        @select-markup="$router.push({ path: $resolveRoutePath(`${secondUrl}/risk-planar/risks/${$event}`) })"
      ></planar-graph-editor>
    </div>
  </div>
</template>

<script>
  import PlanarGraphEditor from './MonitorPlanarGraphEditor'

  export default {
    name: 'MonitorPlanarGraph',
    props: {
      secondUrl: {
        type: String,
        default: 'enterprise-planar-graph'
      },
      isRedirect: {
        type: Boolean,
        default: false
      }
    },
    components: {
      PlanarGraphEditor
    },

    computed: {
      riskTrend () {
        return this.$refs.riskTrend
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    position: relative;
  }

  .trend-button-wrapper {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 2;

    .trend-button /deep/ span {
      display: inline-flex;
      align-items: center;

      img {
        width: 15px;
        height: 13px;
        vertical-align: center;
        margin-right: 8px;
      }
    }
  }
</style>

