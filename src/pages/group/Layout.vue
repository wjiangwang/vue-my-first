<template>
  <el-container direction="vertical" class="layout">
    <el-header class="header">
      <div class="logo">
        <img src="@/assets/images/logo.png">
        <h2 class="h2">广元市应急管理综合平台</h2>
      </div>
      <div class="fullscreen" title="全屏" @click="fullscreen">
        <img src="@/assets/icons/header/fullscreen.png">
      </div>
      <div class="account">
        <div class="user">
          <img src="@/assets/icons/user-fill.png" class="icon">
          <span class="username">{{account.nickname}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <ul class="menu">
          <router-link tag="li"
            :to="{ name: 'account' }">
            <img src="@/assets/icons/setting.png" class="setting-icon">
            个人设置
          </router-link>
          <li @click.stop="logout">
            <img src="@/assets/icons/logout.png" class="logout-icon">
            退出登录
          </li>
        </ul>
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
            <template v-for="(item, index) in navItems">
              <el-submenu v-if="item.children && item.children.length > 0"
                :key="item.routeName" :index="item.routeName"
                popper-class="sidebar-submenu-popup">
                <template slot="title">
                  <div @mouseenter="menuMouseenter(index)" @mouseleave="menuMouseLeave">
                    <router-link :to="{ name: item.routeName }" class="menu-item-link">
                        <img :src="item.icon" class="icon" v-if="item.icon">
                        <img :src="item.selectedIcon" class="icon selected" v-if="item.icon">
                        <span class="title" :class="{animated: firstIndex === index, zoomIn: firstIndex === index}">{{item.title}}</span>
                    </router-link>
                  </div>
                </template>

                <el-menu-item v-for="(child, index) in item.children"
                  :key="child.routePath" :index="child.routePath">
                  <div @mouseenter="childMenuMouseenter(index)" @mouseleave="menuMouseLeave">
                    <router-link slot="title" :to="child.routePath" class="menu-item-link">
                      <span class="title" :class="{animated: childIndex === index, zoomIn: childIndex === index}">{{child.title}}</span>
                    </router-link>
                  </div>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :key="item.routeName" :index="item.routeName">
                <div @mouseenter="menuMouseenter(index)" @mouseleave="menuMouseLeave">
                  <router-link :to="{ name: item.routeName }" class="menu-item-link">
                    <img :src="item.icon" class="icon" v-if="item.icon">
                    <img :src="item.selectedIcon" class="icon selected" v-if="item.icon">
                    <span class="title" :class="{animated: firstIndex === index, zoomIn: firstIndex === index}">{{item.title}}</span>
                  </router-link>
                  <span v-if="menuCollapsed" slot="title">{{item.title}}</span>
                </div>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>

        <div class="menu-minimizer" @click.stop="toggleMenuCollapsed">
          <i class="icon el-icon-arrow-left"></i>
        </div>
      </el-aside>

      <el-container>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  import screenfull from 'screenfull'
  import { getSession, clearSession } from '@/modules/authentication'

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
      navItems() {
        return this.$router.options.routes
          .find(option => option.name === 'index').children
          .filter(route => route.meta && route.meta.nav)
          .map(route => {
            const children = route.children && route.children
              .filter(child => child.meta && child.meta.nav)
              .map(child => {
                return {
                  ...child.meta,
                  routePath: `/${route.path}/${child.path}`
                }
              })
            return {
              ...route.meta,
              ...(children ? { children } : {}),
              routeName: route.name,
              icon: require(`@/assets/icons/group/nav/${route.name}.png`),
              selectedIcon: require(`@/assets/icons/group/nav/selected/${route.name}.png`)
            }
          })
      },

      currentNav() {
        const current = this.$route.matched[1].name
        const navItem = this.navItems.find(item => item.routeName === current)
        if (navItem && navItem.children && navItem.children.length > 0) {
          return this.$route.matched[2].path
        } else {
          return current
        }
      },

      account() {
        return getSession().user
      }
    },

    methods: {
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
    }
  }
</script>

<style lang="scss" scoped>
  .layout {
    height: 100%;
    min-width: 1300Px;
    min-height: 600px;
    .main {
      background-color: #f6f7fb;
      padding: 0;
    }
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
          padding: 0 10px;

          .icon {
            width: auto;
            height: 15px;
            margin-right: 13px;
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
        margin-right: 32px;
        cursor: pointer;

        img {
          width: 15px;
          height: 15px;
        }
      }
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
