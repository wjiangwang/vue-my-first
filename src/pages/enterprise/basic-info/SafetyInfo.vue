<template>
  <div class="page">
    <breadcrumb :items="[{ name: '安全生产信息' }]"></breadcrumb>

    <page-card class="page-main">
      <safety-info :can-edit="true" :is-redirect="isRedirect"></safety-info>
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
    padding: 0 !important;
    /deep/ .form-buttons {
      padding: 8px 0;
      border-top: 1px solid #eee;
      text-align: center;
      background: #fff;
    }
  }
</style>

