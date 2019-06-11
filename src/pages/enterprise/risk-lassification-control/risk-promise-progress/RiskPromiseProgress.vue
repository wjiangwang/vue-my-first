<template>
  <div class="page">
    <breadcrumb :items="[{ name: '风险承诺进度'}]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <risk-control-Book-tree-chart class="risk-control-Book-tree-chart"/>
      <risk-control-Book-table class="risk-control-Book-table" :isEdit="true"/>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import RiskControlBookTable from './RiskPromiseProgressTable'
import RiskControlBookTreeChart from './RiskPromiseProgressTreeChart'




export default {
  name: 'RiskPromiseProgress',

  components: {
    PageCard,
    Breadcrumb,
    RiskControlBookTable,
    RiskControlBookTreeChart,
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {}
  },

  computed: {

  },

  methods: {

  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
.page-main /deep/ .card-body {
  // padding: 20px 0 0 !important;
  display: flex;
  .risk-control-Book-table {
    //padding-top: 20px;
    width: 60%;
  }
  .risk-control-Book-tree-chart {
    padding-top: 20px;
    width: 40%;
    border-right: 1px solid #d7e3eb;
  }
}
</style>



