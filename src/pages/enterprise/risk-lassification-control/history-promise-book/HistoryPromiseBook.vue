<template>
  <div class="page">
    <breadcrumb :items="[{ name: '历史承诺台账'}]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <history-promise-Book-table class="risk-control-Book-table" :isEdit="true"/>
      <!-- <history-promise-Book-tree-chart class="risk-control-Book-tree-chart"/> -->
      <risk-control-Book-table class="risk-control-Book-table" :isEdit="true"/>

    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import HistoryPromiseBookTable from './HistoryPromiseBookTable'
import HistoryPromiseBookTreeChart from './HistoryPromiseBookTreeChart'

import RiskControlBookTable from '../risk-promise-progress/RiskPromiseProgressTable'



export default {
  name: 'HistoryPromiseBook',

  components: {
    PageCard,
    Breadcrumb,
    HistoryPromiseBookTable,
    HistoryPromiseBookTreeChart,

    RiskControlBookTable
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
    border-right: 1px solid #d7e3eb;
    width: 50%;
  }
  .risk-control-Book-tree-chart {
    padding-top: 20px;
    width: 50%;
    border-right: 1px solid #d7e3eb;
  }
}
</style>



