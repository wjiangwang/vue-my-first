<template>
  <div class="page">
    <breadcrumb :items="[{ name: '安全生产信息' }]"></breadcrumb>

    <page-card class="page-main">
      <safety-info :can-edit="false"></safety-info>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import SafetyInfo from '@/pages/management/enterprise-archive/EnterpriseSafetyInfo'

export default {
  name: 'EnterpriseSafetyInfo',

  components: {
    PageCard,
    Breadcrumb,
    SafetyInfo
  }
}
</script>

<style lang="scss" scoped>
.page /deep/ .scroll-content {
  padding: 0 !important;
}
</style>

