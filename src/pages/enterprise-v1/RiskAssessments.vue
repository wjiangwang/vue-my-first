<template>
  <div class="page">
    <breadcrumb :items="[{ name: '风险辨识评估' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <enterprise-risk-assessments :can-edit="false"></enterprise-risk-assessments>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import EnterpriseRiskAssessments from '@/pages/management/enterprise-archive/EnterpriseRiskAssessments'

export default {
  name: 'RiskAssessments',

  components: {
    PageCard,
    Breadcrumb,
    EnterpriseRiskAssessments
  }
}
</script>

<style lang="scss" scoped>
.page-main /deep/ .card-body {
  padding: 20px 0 0 !important;
  display: flex;
  flex-direction: column;
}
</style>

