<template>
  <div class="page-card el-card is-never-shadow">
    <div class="card-header">
      <slot name="header"></slot>
    </div>

    <scroll-view class="card-body" v-if="scrollable">
      <slot></slot>
    </scroll-view>
    <div v-else class="card-body">
      <slot></slot>
    </div>

    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import ScrollView from '@/components/ScrollView'

export default {
  name: 'PageCard',

  components: {
    ScrollView
  },

  props: {
    scrollable: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-card {
  /*margin: 20px 0 0 20px;*/
  margin: 20px 0 0 0;
  height: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  .card-body {
    flex: 1;
    height: 100%;

    > {
      /deep/ .scroll-container .scroll-content {
        padding: 20px;
      }
    }

    /deep/ .data-table {
      height: 100%;
    }
  }

  .card-footer /deep/ .form-buttons {
    padding: 8px 0;
    border-top: 1px solid #eee;
    text-align: center;
  }
}
</style>
