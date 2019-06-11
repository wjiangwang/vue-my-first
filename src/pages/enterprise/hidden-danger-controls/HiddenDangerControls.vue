<template>
  <div class="page">
    <breadcrumb :items="[{ name: '隐患排查治理' }]" v-if="!$route.query.routeSource"></breadcrumb>

    <hidden-danger-controls v-if="$route.query.routeSource"></hidden-danger-controls>

    <page-card v-else class="page-main" :scrollable="false">
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

