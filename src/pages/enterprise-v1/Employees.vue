<template>
  <div class="page">
    <breadcrumb :items="[{ name: '企业人员信息' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <enterprise-employees :can-edit-departments="false"></enterprise-employees>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import EnterpriseEmployees from '@/pages/management/enterprise-archive/EnterpriseEmployees'

export default {
  name: 'Employees',

  components: {
    PageCard,
    Breadcrumb,
    EnterpriseEmployees
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

