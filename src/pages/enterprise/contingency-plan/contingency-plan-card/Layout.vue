<template>
  <div class="page general-layout-page">
    <router-view/>
  </div>
</template>
<script>


export default {
  name: 'generalLayout',

  data () {
    return { loading: true }
  },

  async created () {
    this.loading = false
  },
}
</script>

<style lang="scss" scoped>
@mixin plan-card-table-style {
  /deep/ .el-table {
    overflow: auto;
    .el-table__header-wrapper {
      overflow: visible;
    }
    .el-table__body-wrapper {
      overflow: visible;
    }
  }
  /deep/ .el-table::before {
    height: 0;
  }
  /deep/ .el-table--border::after {
    width: 0;
  }
}
.general-layout-page {
  /deep/ .risk-scl {
    @include plan-card-table-style
  }
  /deep/ .risk-jha{
    overflow: auto;
    @include plan-card-table-style;
    .el-table{
      overflow: visible;
    }
    .title{
      button{
        position: absolute;
        right: 30px;
      }
    }
  }
}
</style>
