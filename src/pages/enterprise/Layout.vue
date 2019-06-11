<template>
  <el-container direction="vertical" class="layout">
    <el-header class="header" height="108px" v-if='!isCarousel'>
      <div class="head">
        <div class="logo">
          <img src="@/assets/images/logo.png">
          <h2 class="h2">
            广元市应急管理综合平台
            <span class="subtitle">{{account.enterpriseName}}</span>
          </h2>
        </div>
        <div class="fullscreen" title="全屏" @click="fullscreen">
          <img src="@/assets/icons/header/fullscreen.png">
        </div>
        <div class="message" v-if="!storage.getRedirectNickName()">
          <el-badge is-dot class="badge" :hidden="!account.isReadMessage">
            <router-link :to="{ name: 'policies' }">
              <img src="@/assets/icons/header/message.png" class="message-icon">
            </router-link>
          </el-badge>
        </div>
        <div class="account">
          <div class="user">
            <img src="@/assets/icons/header/user.png" class="icon">
            <span class="username">{{storage.getRedirectNickName() ? storage.getRedirectNickName() : account.nickname}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <ul class="menu">
            <router-link tag="li" :to="{ name: 'account' }" v-if="!storage.getRedirectNickName()">
              <img src="@/assets/icons/setting.png" class="setting-icon">
              个人设置
            </router-link>
            <li @click.stop="logout">
              <img src="@/assets/icons/logout.png" class="logout-icon">
              退出登录
            </li>
          </ul>
        </div>
      </div>

      <el-menu class="primary-navbar" mode="horizontal" :default-active="currentPrimaryNav" background-color="#292C33" text-color="rgba(255,255,255,0.5)" active-text-color="#37A9FA">
        <el-menu-item v-for="(item, index) in primaryNavItems" :key="item.routeName" :index="item.routeName">
          <div @mouseenter="firstMenuMouseenter(index)" @mouseleave="menuMouseLeave">
            <router-link slot="title" :to="{ name: item.routeName }" class="menu-item-link">
              <img :src="item.icon" :class="{icon: true}" v-if="item.icon">
              <span id="firstMenu" :class="{title: true, animated: firstIndex === index, zoomIn: firstIndex === index}">{{item.title}}</span>
            </router-link>
          </div>
        </el-menu-item>
      </el-menu>
    </el-header>

    <el-container class="main-container">
      <el-aside width="235px" v-if="secondaryNavItems.length > 0 && !isCarousel" :class="{ 'sidebar': true, 'menu-collapsed': menuCollapsed }">
        <el-scrollbar class="scrollbar-wrapper">
          <el-menu :default-active="currentSecondaryNav" mode="vertical"
          background-color="#292C33" text-color="rgba(255,255,255,0.5)"
          active-text-color="#FFFFFF" :collapse="menuCollapsed" :collapse-transition="false">
            <el-menu-item v-for="(item, index) in internalSecondaryNavItems" :key="item.path" :index="item.path">
              <div @mouseenter="secondMenuMouseenter(index)" @mouseleave="menuMouseLeave">
                <router-link :to="item.path" class="menu-item-link" >
                  <img :src="item.icon" class="icon" v-if="item.icon">
                  <span class="title" :class="{animated: secondIndex === index, zoomIn: secondIndex === index}">{{item.title}}</span>
                </router-link>
                <span v-if="menuCollapsed" :class="{animated: secondIndex === index, zoomIn: secondIndex === index}" slot="title">{{item.title}}</span>
              </div>
            </el-menu-item>

            <template v-if="externalSecondaryNavItems.length > 0 ">
              <el-menu-item-group v-if="!menuCollapsed">
                <template slot="title">调用功能</template>
              </el-menu-item-group>

              <el-menu-item v-for="(item, index) in externalSecondaryNavItems" :key="item.path" :index="item.path">
                <div @mouseenter="secondMenuMouseenterTow(index)" @mouseleave="menuMouseLeave">
                  <router-link :to="item.path" class="menu-item-link" >
                    <img :src="item.icon" class="icon" v-if="item.icon">
                    <span class="title" :class="{animated: secondIndexTow === index, zoomIn: secondIndexTow === index}">{{item.title}}</span>
                  </router-link>
                  <span v-if="menuCollapsed" :class="{npm: secondIndex === index, zoomIn: secondIndex === index}" slot="title">{{item.title}}</span>
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
          <router-view/>
        </el-main>
      </el-container>

    </el-container>
  </el-container>
</template>

<script>
  import screenfull from 'screenfull'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { updateSession, clearSession } from '@/modules/authentication'
  import navRoutes from '@/routers/enterprise/routes'
  import storage from '@/modules/storage'

  import 'animate.css'

  export default {
    name: 'Layout',

    data () {
      return {
        menuCollapsed: false,
        uuid: true,
        storage: storage,
        firstIndex: null,
        secondIndex: null,
        secondIndexTow: null,
        isCarousel:false
      }
    },

    watch: {

    },

    mounted () {

    },

    computed: {
      ...mapState('account', { account: 'model' }),

      primaryNavItems () {
        let menus = []
        menus = this.$router.options.routes.find(option => option.name === 'index').children.filter(route => route.meta && route.meta.primaryNav)
        // 如果是跳转过来的隐藏政企联络菜单
        if (sessionStorage.getItem('isRedirect')) {
          menus = this.$router.options.routes.find(option => option.name === 'index').children.filter(route => route.meta && route.meta.primaryNav).filter(i => {
            return i.path !== 'liaison'
          })
        } else {
          menus = this.$router.options.routes.find(option => option.name === 'index').children.filter(route => route.meta && route.meta.primaryNav)
        }
        return menus.map(route => {
          return {
            ...route.meta,
            children: route.children,
            routeName: route.name
          }
        })

        // return this.$router.options.routes
        //   .find(option => option.name === 'index').children
        //   .filter(route => route.meta && route.meta.primaryNav)
        //   .map(route => {
        //     return {
        //       ...route.meta,
        //       children: route.children,
        //       routeName: route.name
        //     }
        //   })
      },

      currentPrimaryNav () {
        return this.$route.matched[1].name
      },

      secondaryNavItems () {
        const currentPrimaryNavItem = navRoutes.find(m => m.name === this.currentPrimaryNav)
        if (!currentPrimaryNavItem || !currentPrimaryNavItem.children) return []

        let children = []

        if (this.account.enterpriseGrade !== '危险化学品' && currentPrimaryNavItem.name === 'enterprise-info') {
          children = currentPrimaryNavItem.children.filter(i => {
            return i.path !== 'enterprise-holistic-risk'
          })
        } else {
          children = currentPrimaryNavItem.children
        }
        return children.map(route => {
          return {
            ...route.meta,
            path: `/${this.currentPrimaryNav}/${route.path}`
          }
        })
      },

      internalSecondaryNavItems () {
        return this.secondaryNavItems.filter(item => !item.external)
      },

      externalSecondaryNavItems () {
        return this.secondaryNavItems.filter(item => item.external)
      },

      currentSecondaryNav () {
        return this.$route.matched[2].path
      }
    },

    methods: {
      ...mapActions('account', { loadAccount: 'loadData' }),

      logout () {
        clearSession()
        this.$router.replace({ name: 'signin' })
      },

      fullscreen () {
        if (screenfull.enabled) screenfull.toggle()
      },

      toggleMenuCollapsed() {
        this.menuCollapsed = !this.menuCollapsed
      },

      firstMenuMouseenter (index) {
        this.firstIndex = index
      },

      menuMouseLeave () {
        this.firstIndex = null
        this.secondIndexTow = null
        this.secondIndex = null
      },

      secondMenuMouseenter (index) {
        this.secondIndex = index
      },

      secondMenuMouseenterTow (index) {
        this.secondIndexTow = index
      }
    },

    async created () {
      this.isCarousel = storage.get('isCarousel') ? storage.get('isCarousel') : false
      await this.loadAccount()
      updateSession({ user: this.account })
    }
  }
</script>

<style lang="scss" scoped>
  .layout {
    height: 100%;
    min-width: 1345px;
    min-height: 600px;
    .header {
      padding: 0;

      .head {
        padding: 0 20px;
        background: linear-gradient(
          -90deg,
          rgba(5, 208, 253, 1),
          rgba(0, 126, 229, 1)
        );
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        height: 48px;

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
            font-size: 16px;
            margin: 0;

            .subtitle {
              font-size: 14px;
              font-weight: normal;
            }
          }
        }

        .message {
          margin-right: 38px;
          display: flex;
          align-items: center;

          a {
            display: block;
            line-height: 15px;
          }

          .message-icon {
            width: auto;
            height: 15px;
            vertical-align: middle;
          }
        }

        .account {
          position: relative;
          &:hover {
            background: #2ed2fb;
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
              font-size: 13px;
              margin-right: 10px;
            }
          }

          .menu {
            display: none;
            position: absolute;
            top: 48px;
            right: -1px;
            color: #333333;
            background: #fff;
            padding: 0;
            margin: 0;
            list-style: none;
            border-radius: 2px;
            border: 1px solid #e6e6e6;
            border-top: 0;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
                border-bottom: 1px solid #e6e6e6;
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
          margin-right: 38px;
          cursor: pointer;

          img {
            width: 15px;
            height: 15px;
          }
        }
      }

      .primary-navbar {
        border-bottom: 0;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.15);
        z-index: 1;

        .el-menu-item {
          padding-left: 0;
          padding-right: 0;

          .menu-item-link {
            text-decoration: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;

            .icon {
              width: 0;
              height: auto;
              margin-right: 3px;
              transition: width 0.2s;
            }
          }

          &.is-active .menu-item-link .icon {
            width: 20px;
          }
        }
      }
    }

    .sidebar {
      background: #292c33;
      overflow: hidden;
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
        height: calc(100% - 40px);
        /deep/ .el-scrollbar__wrap {
          overflow: auto;
        }
        .el-scrollbar__view {
          height: 100%;
        }

        .is-horizontal {
          display: none;
        }
      }

      .el-menu {
        border-right: 0;

        .el-menu-item {
          height: 44px;
          line-height: 44px;
          padding-left: 0 !important;
          padding-right: 0;

          .menu-item-link {
            text-decoration: none;
            display: block;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 13px;

            .icon {
              width: 16px;
              height: auto;
              margin-right: 10px;
              opacity: 0.5;
            }
          }

          &.is-active {
            background-color: rgba(255, 255, 255, 0.05) !important;
            .menu-item-link {
              color: #ffffff;

              .icon {
                opacity: 1;
              }
            }
          }
        }

        .el-menu-item-group {
          background-color: #24272d;

          /deep/ .el-menu-item-group__title {
            padding-top: 10px;
            padding-bottom: 10px;
            color: #5e6369;
            font-size: 12px;
            line-height: 16px;
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

    .main-container {
      background: #f6f7fb;

      .main {
        padding: 0;
      }
    }
  }
</style>

