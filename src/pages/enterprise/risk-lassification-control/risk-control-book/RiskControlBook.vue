<template>
  <div class="page">
    <!-- <breadcrumb :items="[{ name: '风险管控台账'}]"></breadcrumb> -->
    <el-switch
      class="book-switch-button"
      v-model="bookModel"
      active-color="#13ce66"
      inactive-color="#409eff"
      active-text="作业风险台账"
      inactive-text="风险管控台账"
    ></el-switch>

    <page-card class="page-main" :scrollable="false" v-if='!bookModel'>
      <risk-control-book-tree-chart class="risk-control-Book-tree-chart"/>
      <risk-control-book-table class="risk-control-Book-table" :isEdit="true"/>
    </page-card>
    <page-card class="page-main" :scrollable="false" v-else>
      <real-time-risk-control-book-tree-chart class="risk-control-Book-tree-chart"/>
      <real-time-risk-control-book-table class="risk-control-Book-table" :isEdit="true"/>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import RiskControlBookTable from './RiskControlBookTable'
import RiskControlBookTreeChart from './RiskControlBookTreeChart'
import RealTimeRiskControlBookTable from './RealTimeRiskControlBookTable'
import RealTimeRiskControlBookTreeChart from './RealTimeRiskControlBookTreeChart'
import ScrollView from '@/components/ScrollView'




export default {
  name: 'RiskControlBook',

  components: {
    PageCard,
    Breadcrumb,
    RiskControlBookTable,
    RiskControlBookTreeChart,
    RealTimeRiskControlBookTable,
    RealTimeRiskControlBookTreeChart,
    ScrollView
  },

  props: {
    canEdit: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      bookModel: false
    }
  },

  computed: {

  },

  methods: {

  },

  created () {
    this.bookModel = false
  }
}
</script>

<style lang="scss" scoped>
.book-switch-button {
  height: 50px;
  background: #ffffff;
  -webkit-box-shadow: 0px 1px 3px 0px rgba(4, 26, 55, 0.08);
  box-shadow: 0px 1px 3px 0px rgba(4, 26, 55, 0.08);
  padding: 0 20px;
}
.page-main /deep/ .card-body {
  /*padding: 20px 0 0 !important;*/
  display: flex;
  .risk-control-Book-table {
    padding-top: 20px;
    width: 60%;
  }
  .risk-control-Book-tree-chart {
    padding-top: 20px;
    width: 40%;
    border-right: 1px solid #d7e3eb;
  }
}
</style>



