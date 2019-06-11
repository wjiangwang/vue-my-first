<template>
  <div class="page hierarchy-setting-page">
    <breadcrumb :items="[{ name: '企业配置' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <el-container>
        <el-aside width="180px">
          <ul class="menus">
            <router-link tag="li"
              v-for="(item, index) in menuItems" :key="index"
              :to="item.route">
              {{item.label}}
            </router-link>
          </ul>
        </el-aside>
        <el-main v-loading="loading">
          <router-view />
        </el-main>
      </el-container>
    </page-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'HierarchySettingLayout',

  components: {
    Breadcrumb,
    PageCard
  },

  data() {
    return { loading: true }
  },

  computed: {
    ...mapState('hierarchyCount', ['hierarchyCount']),

    menuItems() {
      return [
        {
          label: '基础设置',
          route: { path: this.$resolveRoutePath('enterprise-hierarchy/hierarchy-count') }
        },
        {
          label: '组织架构',
          route: { path: this.$resolveRoutePath('enterprise-hierarchy/hierarchy-tree') }
        },
        this.hierarchyCount && {
          label: '岗位设置',
          route: { path: this.$resolveRoutePath('enterprise-hierarchy/hierarchies/1/jobs') }
        },
        this.hierarchyCount > 3 && {
          label: '班组设置',
          route: { path: this.$resolveRoutePath('enterprise-hierarchy/hierarchies/2/jobs') }
        },
        this.hierarchyCount > 2 && {
          label: '部门设置',
          route: { path: this.$resolveRoutePath('enterprise-hierarchy/hierarchies/3/jobs') }
        },
        this.hierarchyCount && {
          label: '公司设置',
          route: { path: this.$resolveRoutePath('enterprise-hierarchy/hierarchies/4/jobs') }
        }
      ].filter(item => !!item)
    }
  },

  methods: {
    ...mapActions('hierarchyCount', ['loadHierarchyCount'])
  },

  async created() {
    await this.loadHierarchyCount()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.hierarchy-setting-page {
  .el-container {
    height: 100%;
  }

  .el-aside {
    border-right: 1px solid #E3E3E3;
  }

  .menus {
    list-style: none;
    margin: 0;
    padding: 18px 20px;
    font-size: 14px;
    color: #666;

    li {
      padding: 12px;
      border-radius: 3px;
      text-align: center;
      margin-bottom: 5px;
      cursor: pointer;
      &:hover {
        background: #f6f7fb;
      }
      &.router-link-active {
        background: #37A9FA;
        color: #fff;
      }
    }
  }
}
</style>

