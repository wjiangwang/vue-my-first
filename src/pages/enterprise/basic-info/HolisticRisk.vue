<template>
  <div class="page">
    <breadcrumb :items="[{ name: '整体风险' }]"></breadcrumb>

    <page-card class="page-main">
      <holistic-risk :is-redirect="isRedirect"></holistic-risk>
    </page-card>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import PageCard from '@/components/PageCard'
  import HolisticRisk from '@/pages/management/enterprise-archive/EnterpriseRiskGrade'

  export default {
    name: 'EnterpriseHolisticRisk',

    components: {
      PageCard,
      Breadcrumb,
      HolisticRisk
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

