<template>
  <el-container direction="vertical" class="layout">
    <el-header class="header" v-show='!isManagementDashboard'>
      <div class="logo">
        <img src="@/assets/images/logo.png">
        <h2 class="h2">广元市应急管理综合平台</h2>
      </div>
      <div class="account">
        <div class="user">
          <img src="@/assets/icons/user-fill.png" class="icon">
          <span class="username">{{account.nickname}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <ul class="menu">
          <router-link tag="li"
            :to="{ path: '/account' }">
            <img src="@/assets/icons/setting.png" class="setting-icon">
            个人设置
          </router-link>
          <li @click.stop="logout">
            <img src="@/assets/icons/logout.png" class="logout-icon">
            退出登录
          </li>
        </ul>
      </div>

      <div class="fullscreen" title="全屏" @click="fullscreen">
        <img src="@/assets/icons/fullscreen.png">
      </div>
    </el-header>

    <el-container>
      <el-aside width="235px"
        :class="{ 'sidebar': true, 'menu-collapsed': menuCollapsed }">
        <el-scrollbar class="scrollbar-wrapper">
          <el-menu :default-active="currentNav"
            mode="vertical"
            :collapse="menuCollapsed"
            background-color="#272930"
            text-color="#C9D4F6"
            active-text-color="#37A9FA"
            :collapse-transition="false"
            unique-opened>
            <template v-for="(item, index) in navMenus">
              <el-submenu v-if="item.items && item.items.length > 0"
                :key="item.code" :index="item.code"
                popper-class="sidebar-submenu-popup">
                <template slot="title">
                  <div @mouseenter="menuMouseenter(index)" @mouseleave="menuMouseLeave">
                    <router-link :to="item.route" class="menu-item-link">
                      <img :src="item.icon" class="icon" v-if="item.icon">
                      <img :src="item.iconHighlight" class="icon selected" v-if="item.icon">
                      <span class="title" :class="{animated: firstIndex === index, zoomIn: firstIndex === index}">{{item.name}}</span>
                    </router-link>
                  </div>
                </template>

                <el-menu-item v-for="(child, index) in item.items"
                  :key="child.code" :index="child.route.name">
                  <div @mouseenter="childMenuMouseenter(index)" @mouseleave="menuMouseLeave">
                    <router-link slot="title" :to="child.route" class="menu-item-link">
                      <span class="title" :class="{animated: childIndex === index, zoomIn: childIndex === index}">{{child.name}}</span>
                    </router-link>
                  </div>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :key="item.code" :index="item.code">
                <div @mouseenter="menuMouseenter(index)" @mouseleave="menuMouseLeave">
                  <router-link :to="item.route" class="menu-item-link">
                    <img :src="item.icon" class="icon" v-if="item.icon">
                    <img :src="item.iconHighlight" class="icon selected" v-if="item.iconHighlight">
                    <span class="title" :class="{animated: firstIndex === index, zoomIn: firstIndex === index}">{{item.name}}</span>
                  </router-link>
                  <span v-if="menuCollapsed" slot="title">{{item.name}}</span>
                </div>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>

        <div class="menu-minimizer" @click.stop="toggleMenuCollapsed">
          <i class="icon el-icon-arrow-left"></i>
        </div>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import pick from 'lodash/pick'
  import screenfull from 'screenfull'
  import { getSession, clearSession } from '@/modules/authentication'
  import menus from '@/modules/menus'

  import 'animate.css'

  export default {
    name: 'Layout',

    data() {
      return {
        menuCollapsed: false,
        firstIndex: null,
        childIndex: null
      }
    },

    computed: {
      navMenus() {
        const authorizedMenus = getSession().menus

        if (authorizedMenus === undefined) return menus.managementMenuItems

        const menuItems = []
        menus.managementMenuItems.forEach(item => {
          let authorizedMenuItem = authorizedMenus.find(m => m.code === item.code)
          if (authorizedMenuItem) {
            const menuItem = pick(item, ['name', 'tag', 'icon', 'iconHighlight', 'route', 'code'])
            if (item.code === authorizedMenuItem.code && authorizedMenuItem.children) {
              const subMenus = authorizedMenuItem.children
              if (item.items) {
                menuItem.items = item.items.filter(subItem => {
                  return subMenus.find(m => m.name === subItem.name)
                })
              }
            }
            menuItems.push(menuItem)
          }
        })
        return menuItems
      },

      currentNav() {
        let current = this.$route.matched[1].name
        const navItem = this.navMenus.find(item => item.code === current)
        if (navItem && navItem.items && navItem.items.length > 0) {
          return this.$route.matched[2].name
        } else {
          return current
        }
      },

      account() {
        return getSession().user
      },

      isManagementDashboard(){
        return  this.$route.matched[1].name === 'dashboard' ? true : false
      }
    },

    methods: {
      toggleSubmenu(event) {
        event.currentTarget.parentElement.classList.toggle('is-opened')
      },

      toggleMenuCollapsed() {
        this.menuCollapsed = !this.menuCollapsed
      },

      logout() {
        clearSession()
        this.$router.replace({ name: 'signin' })
      },

      fullscreen() {
        if (screenfull.enabled) screenfull.toggle()
      },

      menuMouseenter (index) {
        this.firstIndex = index
      },

      childMenuMouseenter (index) {
        this.childIndex = index
      },

      menuMouseLeave () {
        this.firstIndex = null
        this.childIndex = null
      }
    },

    mounted(){
     this.menuCollapsed = this.$route.matched[1].name === 'dashboard' ? true : false
    }

  }
</script>
<style type="scss">

</style>
<style lang="scss" scoped>
  .layout {
    height: 100%;
    min-width: 1300Px;
    min-height: 600px;

    .header {
      background: rgba(0,148,238,1);
      color: #ffffff;
      display: flex;
      justify-content: space-between;

      .logo {
        display: flex;
        align-items: center;
        flex: 1;

        img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }

        .h2 {
          font-size: 17px;
        }
      }

      .account {
        position: relative;
        &:hover {
          background: #24A3F0;
        }
        &:hover > .menu {
          display: block;
        }

        .user {
          display: flex;
          align-items: center;
          height: 100%;
          cursor: pointer;
          padding: 0 20px;

          .icon {
            width: 20px;
            height: 19px;
            margin-right: 15px;
          }

          .username {
            font-size: 14px;
            margin-right: 20px;
          }
        }

        .menu {
          display: none;
          position: absolute;
          top: 60px;
          right: -1px;
          color: #333333;
          background: #fff;
          padding: 0;
          margin: 0;
          list-style: none;
          border-radius: 2px;
          border: 1px solid #E6E6E6;
          border-top: 0;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          width: 160px;
          z-index: 9999;

          li {
            display: flex;
            align-items: center;
            font-size: 14px;
            height: 50px;
            padding: 0 16px;
            cursor: pointer;
            &:hover {
              background: #f6f7fb;
            }
            &:first-child {
              border-bottom: 1px solid #E6E6E6;
            }

            .setting-icon {
              width: 18px;
              height: 12px;
              margin-right: 16px;
            }

            .logout-icon {
              width: 16px;
              height: 18px;
              margin-right: 16px;
            }
          }
        }
      }

      .fullscreen {
        display: flex;
        align-items: center;
        margin-left: 20px;
        cursor: pointer;

        img {
          width: 24px;
          height: 24px;
        }
      }
    }

    .main {
      background: #f6f7fb;
      padding: 0;
    }

    .sidebar {
      background: #272930;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: width 0.25s;

      &.menu-collapsed {
        width: 64px !important;

        .el-menu {
          .el-menu-item {
            /deep/ .el-tooltip {
              padding: 0 !important;
            }

            .menu-item-link {
              height: 100%;
              justify-content: center;

              .icon {
                margin-right: 0;
              }
            }
          }

          .el-submenu /deep/ .el-submenu__title {
            .menu-item-link {
              height: 100%;
              justify-content: center;

              .icon {
                margin-right: 0;
              }
            }
          }
        }

        .menu-minimizer .icon {
          transform: rotate(180deg);
        }
      }

      .scrollbar-wrapper {
        height: 100%;
        /deep/ .el-scrollbar__wrap {
          overflow: auto;
        }
        /deep/ .el-scrollbar__view {
          padding-top: 10px;
        }

        /deep/ .is-horizontal {
          display: none;
        }
      }

      .el-menu {
        border-right: 0;

        .el-menu-item, .el-submenu {
          padding-left: 0 !important;
          padding-right: 0;

          .menu-item-link {
            text-decoration: none;
            display: block;
            align-items: center;
            color: #C9D4F6;
            font-size: 13px;
            /*position: relative;*/
            &:before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              border: 2px solid transparent;
            }

            .icon {
              width: 16px;
              height: auto;
              margin-right: 10px;
              &.selected {
                display: none;
              }
            }
          }
        }

        .el-menu-item {
          height: 48px;
          line-height: 48px;

          .menu-item-link {
            padding-left: 20px;
            padding-right: 20px;
          }

          &.is-active {
            background-color: #2A2C34 !important;
            .menu-item-link {
              color: #37A9FA;
              &:before {
                border-color: #0094EE;
              }

              .icon {
                display: none;
                &.selected {
                  display: inline;
                }
              }
            }
          }
        }

        .el-submenu {
          /deep/ .el-submenu__title {
            height: 48px;
            line-height: 48px;
            padding-left: 0 !important;

            .menu-item-link {
              padding-left: 20px;
            }
          }

          &.is-active /deep/ .el-submenu__title {
            background-color: #2A2C34 !important;
            .menu-item-link {
              color: #37A9FA;
              &:before {
                border-color: #0094EE;
              }

              .icon {
                display: none;
                &.selected {
                  display: inline;
                }
              }
            }
          }

          &.is-active /deep/ .el-menu {
            background-color: #1A1C20 !important;
          }

          .el-menu-item {
            background-color: #1A1C20 !important;
            &.is-active {
              background-color: #1A1C20 !important;
            }

            .menu-item-link {
              padding-left: 46px;
              &:before {
                display: none;
              }
            }
          }
        }
      }

      .menu-minimizer {
        height: 40px;
        background: #1F2126;
        box-shadow: 0px -1px 0px 0px rgba(10,11,16,1), 0px 1px 0px 0px rgba(67,67,67,0.5);
        text-align: center;
        color: #C9D4F6;
        line-height: 40px;
        cursor: pointer;
        &:before {
          content: ' ';
          display: block;
          border-top: 1px solid #1C1E21;
          box-shadow: 0px 1px 0px 0px rgba(47,50,59,1);
        }

        .icon {
          transition: transform 0.25s;
        }
      }
    }
  }
  .sidebar-submenu-popup .el-menu.el-menu--popup {
    .el-menu-item {
      font-size: 13px;
      height: 48px;
      line-height: 48px;
      &.is-active .menu-item-link {
        color: #37A9FA;
      }

      .menu-item-link {
        text-decoration: none;
        color: #C9D4F6;
      }
    }
  }
</style>
