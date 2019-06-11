<template>
  <div class="page general-layout-page">
    <breadcrumb :items="[{ name: this.breadcrumbName }]"></breadcrumb>
    <page-card class="page-main" :scrollable="false">
      <el-container>
        <el-aside style="width: 720px;">
          <ul class="menus">
            <router-link tag="li" v-for="(item, index) in menuItems" :key="index" :to="item.route">
              <img :src="item.icon + '.png'" class="item-img">
              <img :src="item.icon + '-highlight.png'" class="item-img-active">
              {{item.label}}
            </router-link>
          </ul>
        </el-aside>
        <el-main v-loading="loading">
          <router-view/>
        </el-main>
      </el-container>
    </page-card>
  </div>
</template>

<script>
// import { mapState, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'generalLayout',

  components: {
    Breadcrumb,
    PageCard
  },
  props: {
    secondUrl: {
      type: String,
      default: 'enterprise-planar-graph'
    },
    isRiskControlMenu: {
      type: Boolean,
      default: false
    },
    breadcrumbName: {
      type: String,
      default: '企业平面布局总图'
    },
  },
  data () {
    return { loading: true }
  },
  mounted () {
  },

  computed: {
    // ...mapState('hierarchyCount', ['hierarchyCount']),

    menuItems () {
      return this.isRiskControlMenu ?
        [
          {
            label: '四色分布图',
            icon: 'static/images/third-menu/plan-4se',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph`) }
          },
          {
            label: '作业比较图',
            icon: 'static/images/third-menu/plan-4se',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-job`) }
          },
          {
            label: '3D',
            icon: 'static/images/third-menu/plan-3D',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-3D`) }
          }
        ].filter(item => !!item) : [
          {
            label: '四色分布图',
            icon: 'static/images/third-menu/plan-4se',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph`) }
          },
          {
            label: '作业比较图',
            icon: 'static/images/third-menu/plan-4se',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-job`) }
          },
          {
            label: '3D',
            icon: 'static/images/third-menu/plan-3D',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-3D`) }
          },
          {
            label: '重大危险源',
            icon: 'static/images/third-menu/plan-hazard',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-hazard`) }
          },
          {
            label: '监控点数据',
            icon: 'static/images/third-menu/plan-monitor',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-monitor`) }
          },
          {
            label: '紧急疏散',
            icon: 'static/images/third-menu/plan-evacuate',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-evacuate`) }
          },
          {
            label: '应急处置卡',
            icon: 'static/images/third-menu/plan-disposal',
            route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph-disposal`) }
          }
        ].filter(item => !!item)
    }
  },

  methods: {
    // ...mapActions('hierarchyCount', ['loadHierarchyCount'])
  },

  async created () {
    // await this.loadHierarchyCount()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.general-layout-page {
  /deep/ .el-container {
    height: 100%;
    position: relative;
  }

  /deep/ .el-aside {
    position: absolute;
    top: 10px;
    left: 15px;
    height: 30px;
    background-color: white;
    box-shadow: 0 0 5px #eee;
    z-index: 9;
  }

  .menus {
    list-style: none;
    margin: 0;
    height: 100%;
    /*padding: 18px 20px;*/
    padding: 10px;
    font-size: 14px;
    color: #999;
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
    box-sizing: border-box;
    /*width: 610px;*/
    li {
      /*padding: 12px;*/
      /*border-radius: 3px;*/
      /*text-align: center;*/
      /*margin-bottom: 5px;*/
      cursor: pointer;
      /*width: 100px;*/
      margin: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 14px;
        height: auto;
        margin-right: 5px;
      }
      .item-img-active {
        display: none;
      }
      &:hover {
        background: #f6f7fb;
      }
      &.router-link-active {
        /*background: #37A9FA;*/
        color: #37a9fa;
        .item-img {
          display: none;
        }
        .item-img-active {
          display: inline;
        }
      }
    }
  }
}
</style>

