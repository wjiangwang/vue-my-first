<template>
      <contingency-plan :can-edit="true" :is-redirect="isRedirect"/>
</template>

<script>
import ContingencyPlan from '@/pages/management/contingency/ContingencyPlan'

export default {
  name: 'EnterpriseContingencyPlan',

  components: {
    ContingencyPlan
  },

  props: {
    isRedirect: {
      type: Boolean,
      default: false
    }
  }
}
</script>
