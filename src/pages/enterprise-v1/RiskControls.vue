<template>
  <div class="page">
    <breadcrumb :items="[{ name: '风险管控台账' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <risk-controls></risk-controls>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import RiskControls from '@/pages/management/risk/RiskControls'

export default {
  name: 'EnterpriseRiskAssessments',

  components: {
    PageCard,
    Breadcrumb,
    RiskControls
  }
}
</script>

<style lang="scss" scoped>
.page .page-main {
  padding-top: 20px;

  /deep/ .card-body {
    display: flex;
  }


  /deep/ .data-table .columns {
    .left {
      /deep/ .el-form .el-form-item {
        &:nth-last-child(-n+2) {
          width: 320px;

          .el-form-item__label {
            width: 80px;
          }

          .el-form-item__content {
            width: 230px;
          }
        }

        &:last-child {
          width: auto;

          .el-form-item__content {
            width: auto;
          }
        }
      }
    }
  }
}
</style>

