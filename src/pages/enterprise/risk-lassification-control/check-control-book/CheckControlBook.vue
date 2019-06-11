<template>
  <div class="page">
    <breadcrumb :items="[{ name: '隐患治理台账'}]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <check-control-Book-tree-chart class="check-control-Book-tree-chart"/>
      <check-control-Book-table class="check-control-Book-table" :isEdit="true"/>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import CheckControlBookTable from './CheckControlBookTable'
import CheckControlBookTreeChart from './CheckControlBookTreeChart'




export default {
  name: 'CheckControlBook',

  components: {
    PageCard,
    Breadcrumb,
    CheckControlBookTable,
    CheckControlBookTreeChart,
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
  .check-control-Book-table {
    padding-top: 20px;
    width: 60%;
  }
  .check-control-Book-tree-chart {
    padding-top: 20px;
    width: 40%;
    // border-right: 1px solid #d7e3eb;
  }
}
</style>



