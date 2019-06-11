<template>
  <div class="page contingency-resource-management">
    <breadcrumb :items="[{ name: '应急资源管理' }]"></breadcrumb>
    <page-card class="page-main" :scrollable="false">
      <div style class="contingency-resource-management-container">
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
  name: 'ContingencyResourceManagementLayout',

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
          label: '救援队伍',
          route: { path: this.$resolveRoutePath('contingency-resource-management/rescue-team') }
        },
        {
          label: '救援专家',
          route: { path: this.$resolveRoutePath('contingency-resource-management/rescue-expert') }
        },
        {
          label: '救援物资',
          route: { path: this.$resolveRoutePath('contingency-resource-management/rescue-resource') }
        },
        {
          label: '周边资源',
          route: { path: this.$resolveRoutePath('contingency-resource-management/rescue-nearby') }
        }
      ].filter(item => !!item)
    },
    ManagementMenuItems () {
      return [
        {
          label: '救援队伍',
          route: { name: 'emergency-rescue-team' }
        },
        {
          label: '救援专家',
          route: { name: 'emergency-rescue-expert' }
        },
        {
          label: '救援物资',
          route: { name: 'emergency-rescue-resource' }
        },
        {
          label: '周边资源',
          route: { name: 'emergency-rescue-nearby' }
        }
      ].filter(item => !!item)
    }
  },

  methods: {
  },

  async created () {
    this.loading = false
  }
}
</script>

<style lang="scss">
.contingency-resource-management {
  /deep/ .toolbar {
    .left {
      .el-input {
        padding-bottom: 10px !important;
      }
    }
  }
  .card-body {
    .data-table {
      height: calc(100% - 50px) !important;
    }
  }
  .contingency-resource-management-container {
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

