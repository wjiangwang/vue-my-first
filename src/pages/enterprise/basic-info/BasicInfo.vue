<template>
  <div class="page">
    <breadcrumb :items="[{ name: '企业基本信息' }]"></breadcrumb>

    <page-card class="page-main">
      <basic-info :can-edit="true" :is-redirect="isRedirect"></basic-info>
    </page-card>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import PageCard from '@/components/PageCard'
  import BasicInfo from '@/pages/management/enterprise-archive/EnterpriseInfo'

  export default {
    name: 'EnterpriseBasicInfo',

    components: {
      PageCard,
      Breadcrumb,
      BasicInfo
    },

    props: {
      isRedirect: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page /deep/ .scroll-content {
    padding: 20px 0 0 !important;
    /deep/ .form-buttons {
      padding: 8px 0;
      border-top: 1px solid #eee;
      text-align: center;
      background: #fff;
    }
  }
</style>

