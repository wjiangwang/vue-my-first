<template>
  <div class="page risk-controls-container">
    <risk-controls></risk-controls>
  </div>
</template>

<script>
import RiskControls from '@/pages/management/risk/RiskControls'

export default {
  name: 'EnterpriseRiskAssessments',

  components: {
    RiskControls
  }
}
</script>
<style lang="scss">
  .risk-controls-container .page-main {
    padding-top: 20px;

    .card-body {
      display: flex;
    }


    .data-table .columns {
      .left {
        .el-form .el-form-item {
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
