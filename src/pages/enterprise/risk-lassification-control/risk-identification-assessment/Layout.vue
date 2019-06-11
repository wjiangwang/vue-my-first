<template>
  <div class="page risk-lassification-control-layout">
    <!-- <breadcrumb :items="[{ name: '风险辨识评估'}]"></breadcrumb> -->
    <page-card class="page-main" :scrollable="false">
      <div style class="risk-lassification-control-layout-container">
        <el-aside style="width: 80%;">
          <ul class="menus">
            <router-link
              tag="li"
              :to="{ path: this.$resolveRoutePath('risk-assessment/risk-assessments') }"
              :class="tagClass"
            >区域风险</router-link>
            <router-link
              tag="li"
              :to="{ path: this.$resolveRoutePath('risk-assessment/real-time-risk-assessment') }"
              :class="tag2Class"
            >作业风险</router-link>
          </ul>
        </el-aside>
      </div>
      <router-view
        class="risk-lassification-control-layout-page"
        style="height: calc(100% - 56px;) !important"
      />
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'riskLassificationControlLayout',

  components: {
    Breadcrumb,
    PageCard
  },

  data () {
    return {
      loading: true,
      activeName: ''
    }
  },

  computed: {
    tagClass () {
      return this.$route.path.match(/onTime/) ? ['router-link-exact-active router-link-active'] : []
    },
    tag2Class () {
      return this.$route.path.match(/realTime/) ? ['router-link-exact-active router-link-active'] : []
    }
  },
  mounted () {

  },
  methods: {
  },

  async created () {
    this.loading = false
  }
}
</script>

<style lang="scss">
.risk-lassification-control-layout {
  .page-main {
    margin-top: 2px !important;
  }
  .card-body {
    .data-table {
      height: calc(100% - 50px) !important;
    }
  }
  .risk-lassification-control-layout-container {
    /*display: flex;*/
    width: 100%;
    border-bottom: 1px solid #d7e3eb;
    height: 40px;
    margin-bottom: 10px;
    box-sizing: border-box;
    position: relative;
    button {
      position: absolute;
      right: 20px;
      top: 2px;
    }
    /deep/.risk-scl {
      margin-top: 0;
    }
  }
  .el-container {
    height: 100%;
    /*position: relative;*/
  }

  .el-aside {
    height: 100%;
    background-color: white;
  }

  .menus {
    position: absolute;
    list-style: none;
    margin: 0;
    height: 100%;
    padding: 0 10px;
    font-size: 14px;
    color: #999;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 100%;
    li {
      cursor: pointer;
      /*margin: 0 10px;*/
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      box-sizing: border-box;
      height: 40px;
      &:hover {
        background: #f6f7fb;
      }
      &.router-link-active {
        color: #4c4c4c;
        border-top: 2px solid #37a9fa;
        border-bottom: 1px solid white;
        border-left: 1px solid #d7e3eb;
        border-right: 1px solid #d7e3eb;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.risk-lassification-control-layout-page {
  /deep/ .risk-scl {
    height: calc(100% - 36px);
  }
  /deep/ .risk-jha {
    height: calc(100% - 36px);
  }
}
</style>

