<template>
  <div class="page standing-book-layout-page">
    <breadcrumb :items="[{ name: '台账类' }]"></breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <div style="" class="standing-book-menus-container">
        <el-aside style="width: 80%;">
          <ul class="menus">
            <router-link tag="li"
              v-for="(item, index) in menuItems" :key="index"
              :to="item.route">
              {{item.label}}
            </router-link>
          </ul>
        </el-aside>
        <el-button type="text"
          size="medium"
          class="button-image-icon"
          :loading="exporting"
          @click="exportData">
          <img src="@/assets/icons/file-xls.png" class="icon">
          导出
        </el-button>
      </div>
      <router-view style="height: calc(100% - 56px;) !important" />
    </page-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'standingBookLayout',

  components: {
    Breadcrumb,
    PageCard
  },

  data() {
    return {
      loading: true,
      exporting: false
    }
  },

  computed: {
    menuItems() {
      return [
        {
          label: '风险台账',
          route: { path: this.$resolveRoutePath('standing-book/risk-controls') }
        },
        {
          label: '教育台账',
          route: { path: this.$resolveRoutePath('standing-book/risk-controls1') }
        },
        {
          label: '隐患台账',
          route: { path: this.$resolveRoutePath('standing-book/hidden-danger-book?routeSource=standingBook') }
        },
        {
          label: '消防台账',
          route: { path: this.$resolveRoutePath('standing-book/risk-controls3') }
        }
      ].filter(item => !!item)
    }
  },

  methods: {
    exportData () {
      console.log(this.$route)
    }
  },

  async created() {
    this.loading = false
  }
}
</script>

<style lang="scss">
.standing-book-layout-page {
  .card-body {
    .data-table {
      height: calc(100% - 80px) !important;
    }
  }
  .standing-book-menus-container {
    /*display: flex;*/
    width: 100%;
    border-bottom: 1px solid #D7E3EB;
    height: 40px;
    margin-bottom: 20px;
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
        color: #4C4C4C;
        border-top: 2px solid #37A9FA;
        border-bottom: 1px solid white;
        border-left: 1px solid #D7E3EB;
        border-right: 1px solid #D7E3EB;
      }
    }
  }
}
</style>

