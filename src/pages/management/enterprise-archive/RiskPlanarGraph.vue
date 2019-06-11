<template>
  <div class="page">
    <breadcrumb :items="breadcrumbItems"></breadcrumb>

    <div class="page-main">
      <planar-graph-editor
        :enterprise-id="enterpriseId"
        :is-readonly="readonly"
        @select-markup="$router.push({ name: 'risk-detail', params: { enterpriseId, id: $event } })">
      </planar-graph-editor>
    </div>

    <div class="trend-button-wrapper">
      <el-button type="warning" class="trend-button" size="mini"
        @click="riskTrend.show(enterpriseId)">
        <img src="@/assets/icons/trend.png">
        趋势图
      </el-button>
    </div>
    <enterprise-risk-trend ref="riskTrend"></enterprise-risk-trend>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PlanarGraphEditor from './PlanarGraphEditor'
import EnterpriseRiskTrend from '@/pages/management/EnterpriseRiskTrend'

export default {
  name: 'RiskPlanarGraph',

  components: {
    Breadcrumb,
    PlanarGraphEditor,
    EnterpriseRiskTrend
  },

  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    breadcrumbItems() {
      return [
        this.readonly && this.isGroup ? { name: '风险管控及隐患排查系统', route: { name: 'risk-gis' } } : this.readonly ? { name: '风险管控及隐患排查系统', route: { name: 'emap' } } : this.isGroup ? {
          name: '一企一档', route: { name: 'enterprise-archive', query: { reset: false } }
        } : {
          name: '一企一档', route: { name: 'enterprise-archives', query: { reset: false } }
        },
        { name: this.readonly ? '风险四色分布图' : '风险平面图设置' }
      ]
      // return [
      //   this.readonly ? { name: '电子地图', route: { name: 'emap' } } : {
      //     name: '一企一档', route: { name: 'enterprise-archives', query: { reset: false } }
      //   },
      //   { name: this.readonly ? '风险四色分布图' : '风险平面图设置' }
      // ]
    },

    enterpriseId() {
      // return parseInt(this.$route.params.enterpriseId, 10)
      return this.$route.params.enterpriseId
    },

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
