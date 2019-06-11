<template>
  <div class="page">
    <breadcrumb :items="[{ name: '资质许可证信息' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <enterprise-certifications :can-edit="false"></enterprise-certifications>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import EnterpriseCertifications from '@/pages/management/enterprise-archive/EnterpriseCertifications'

export default {
  name: 'Certifications',

  components: {
    PageCard,
    Breadcrumb,
    EnterpriseCertifications
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

