<template>
  <div class="page contingency-drill">
    <breadcrumb
      v-once
      :items="[{ name: '应急救援演练', route:{ name: 'emergency-rescue-manoeuvres' }},{name:enterpriseName}]"
      v-if="isManagement"
    ></breadcrumb>
    <breadcrumb :items="[{ name: '应急演练'}]" v-else></breadcrumb>
    <page-card class="page-main" :scrollable="false">
      <div style class="contingency-drill-container">
        <el-aside style="width: 80%;">
          <ul class="menus" v-if="isManagement">
            <router-link
              tag="li"
              v-for="(item, index) in ManagementMenuItems"
              :key="index"
              :to="item.route"
            >{{item.label}}</router-link>
          </ul>
          <ul class="menus" v-else>
            <router-link
              tag="li"
              v-for="(item, index) in menuItems"
              :key="index"
              :to="item.route"
            >{{item.label}}</router-link>
          </ul>
        </el-aside>
      </div>
      <router-view style="height: calc(100% - 56px;) !important"/>
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'ContingencyDrillLayout',

  components: {
    Breadcrumb,
    PageCard
  },
  props: ['isManagement'],

  data () {
    return {
      loading: true,
    }
  },

  computed: {
    menuItems () {
      return [
        {
          label: '演练计划',
          route: { path: this.$resolveRoutePath('contingency-drill/drill-plan') }
        },
        {
          label: '演练记录',
          route: { path: this.$resolveRoutePath('contingency-drill/drill-record') }
        },
        {
          label: '演练总结',
          route: { path: this.$resolveRoutePath('contingency-drill/drill-summary') }
        }
      ].filter(item => !!item)
    },
    ManagementMenuItems () {
      return [
        {
          label: '演练计划',

          route: { name: 'emergency-drill-plan' }
        },
        {
          label: '演练记录',
          route: { name: 'emergency-drill-record' }
        },
        {
          label: '演练总结',
          route: { name: 'emergency-drill-summary' }
        }
      ].filter(item => !!item)
    },

    enterpriseName () {
      return this.$route.params.enterpriseName
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
.contingency-drill {
  .card-body {
    .data-table {
      height: calc(100% - 50px) !important;
    }
  }
  .contingency-drill-container {
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

