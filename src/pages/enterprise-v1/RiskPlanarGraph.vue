<template>
  <div class="page">
    <breadcrumb :items="[{ name: '风险四色分布图' }]"></breadcrumb>

    <div class="page-main">
      <planar-graph-editor :readonly="true"
        @select-markup="$router.push({ name: 'risk-detail', params: { id: $event } })">
      </planar-graph-editor>
    </div>

    <div class="trend-button-wrapper">
      <el-button type="warning" class="trend-button" size="mini" @click="riskTrend.show()">
        <img src="@/assets/icons/trend.png">
        趋势图
      </el-button>
    </div>
    <enterprise-risk-trend ref="riskTrend"></enterprise-risk-trend>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PlanarGraphEditor from '@/pages/management/enterprise-archive/PlanarGraphEditor'
import EnterpriseRiskTrend from '@/pages/management/EnterpriseRiskTrend'

export default {
  name: 'RiskPlanarGraph',

  components: {
    Breadcrumb,
    PlanarGraphEditor,
    EnterpriseRiskTrend
  },

  computed: {
    riskTrend() {
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

