<template>
  <div class="page">
    <breadcrumb :items="[{ name: '应急处置卡'}]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <plan-card-table class="plan-card-table" :isEdit='true'/>
      <plan-card-tree-chart class="plan-card-tree-chart"/>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import PlanCardTable from './PlanCardTable'
import PlanCardTreeChart from './PlanCardTreeChart'




export default {
  name: 'ContingencyPlanCard',

  components: {
    PageCard,
    Breadcrumb,
    PlanCardTable,
    PlanCardTreeChart,
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
  padding: 20px 0 0 !important;
  display: flex;
  .plan-card-table{
  width: 50%;
}
  .plan-card-tree-chart{
  width: 50%;
}
}

</style>



