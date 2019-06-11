<template>
  <enterprise-users :is-redirect="isRedirect" />
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import EnterpriseUsers from '@/pages/management/setting/enterprise-user/Users'

export default {
  name: 'Users',

  components: {
    PageCard,
    Breadcrumb,
    EnterpriseUsers
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
.page-main /deep/ .card-body {
  padding: 20px 0 0 !important;
  display: flex;
  flex-direction: column;
}
</style>

