<template>
  <div class="page">
    <breadcrumb :items="[{ name: '隐患管控台账' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <hidden-danger-controls></hidden-danger-controls>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import HiddenDangerControls from '@/pages/management/risk/HiddenDangerControls'

export default {
  name: 'EnterpriseRiskAssessments',

  components: {
    PageCard,
    Breadcrumb,
    HiddenDangerControls
  }
}
</script>

<style lang="scss" scoped>
.page .page-main {
  padding-top: 20px;

  /deep/ .card-body {
    display: flex;
  }
}
</style>

