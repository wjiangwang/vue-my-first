<template>
  <el-container direction="vertical" class="layout">
    <el-header class="header">
      <div class="logo">
        <img src="@/assets/images/logo.png">
        <h2 class="h2">
          风险分级管控和隐患排查治理双重预防信息系统
          <span class="subtitle">{{account.enterpriseName}}</span>
        </h2>
      </div>
      <div class="message">
        <el-badge is-dot class="badge" :hidden="!account.isReadMessage">
          <router-link :to="{ name: 'policies' }">
            <img src="@/assets/icons/message.png" class="message-icon">
          </router-link>
        </el-badge>
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

      <div class="fullscreen" title="全屏" @click="fullscreen">
        <img src="@/assets/icons/fullscreen.png">
      </div>
    </el-header>

    <el-container class="main-container">
      <el-aside width="235px"
        :class="{ 'left-aside': true, 'menu-collapsed': menuCollapsed }">
        <ul class="el-menu nav-menu">
          <template v-for="(menu, index) in navMenus">
            <router-link v-if="menu.items && menu.items.length"
              :key="index"
              tag="li"
              class="el-submenu nav-submenu"
              active-class="is-opened is-active"
              :to="menu.route"
              disabled>
              <div class="el-submenu__title" @click.stop="toggleSubmenu">
                <img :src="menu.icon" v-if="menu.icon" class="icon">
                <img :src="menu.iconHighlight"
                  v-if="menu.iconHighlight"
                  class="icon icon-highlight">
                <span class="name">{{menu.name}}</span>
                <i class="el-submenu__icon-arrow el-icon-caret-bottom"></i>
              </div>

              <ul class="el-menu el-menu--inline">
                <router-link v-for="(submenu, subindex) in menu.items"
                  :key="subindex"
                  tag="li"
                  class="el-menu-item nav-submenu-item"
                  active-class="is-active"
                  :to="submenu.route">
                  <span>{{submenu.name}}</span>
                </router-link>
              </ul>
            </router-link>

            <router-link v-else
              :key="index"
              tag="li"
              class="el-menu-item nav-menu-item"
              active-class="is-active"
              :to="menu.route">
              <el-tooltip :disabled="!menuCollapsed"
                :content="menu.name"
                placement="right"
                effect="dark"
                :open-delay="200">
                <div class="menu-item-wrapper">
                  <img :src="menu.icon" v-if="menu.icon" class="icon">
                  <img :src="menu.iconHighlight"
                    v-if="menu.iconHighlight"
                    class="icon icon-highlight">
                  <span class="name">{{menu.name}}</span>
                  <el-tag size="mini" v-if="menu.tag && !menuCollapsed" color="#FF992C">
                    {{menu.tag}}
                  </el-tag>
                </div>
              </el-tooltip>
            </router-link>
          </template>
        </ul>

        <div class="menu-minimizer" @click.stop="toggleMenuCollapsed">
          <i class="icon el-icon-d-arrow-left"></i>
        </div>
      </el-aside>

      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import screenfull from 'screenfull'
import { mapState, mapMutations, mapActions } from 'vuex'
import menus from '@/modules/menus'
import { updateSession, clearSession } from '@/modules/authentication'

export default {
  name: 'Layout',

  data() {
    return {
      menuCollapsed: false
    }
  },

  computed: {
    ...mapState('account', { account: 'model' }),

    navMenus() {
      return menus.enterpriseMenuItems.map(item => {
        if (item.items) {
          item = cloneDeep(item)
          item.items = item.items.filter(i => {
            if (i.route.name === 'risk-grade') {
              return this.account.enterpriseGrade === '危险化学品'
            } else {
              return true
            }
          })

          return item
        } else {
          return item
        }
      })
    }
  },

  methods: {
    ...mapActions('account', { loadAccount: 'loadData' }),

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
    }
  },

  async created() {
    await this.loadAccount()
    updateSession({ user: this.account })
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;

  .header {
    background: linear-gradient(-90deg,rgba(5,208,253,1),rgba(0,126,229,1));;
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

        .subtitle {
          font-size: 14px;
          font-weight: normal;
        }
      }
    }

    .message {
      margin-right: 60px;

      .badge {
        margin-top: 20px;
      }

      .message-icon {
        width: 18px;
        height: 21px;
      }
    }

    .account {
      position: relative;
      &:hover {
        background: #2ED2FB;
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

  .main-container {
    background: #f6f7fb;
  }

  .left-aside {
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: width 0.25s;
    box-shadow: 0 2px 12px 0px rgba(0,0,0,0.26);
    z-index: 2;

    .nav-menu {
      flex: 1;
      background: #fff;
      border-right: 0;
      padding-top: 30px;

      .nav-submenu .el-menu {
        background: transparent;
      }

      .nav-submenu:not(.is-opened) .el-menu {
        display: none;
      }

      > .nav-menu-item {
        padding: 0;
      }

      .nav-menu-item,
      .nav-submenu .el-submenu__title {
        color: #4C4C4C;
        height: 48px;
        line-height: 48px;
        font-weight: 500;

        &:hover,
        &:focus {
          background: #EFEFEF;
        }

        .menu-item-wrapper {
          display: flex;
          align-items: center;
          padding: 0 20px;
          height: 100%;
          &:focus {
            outline: none !important;
          }

          .name {
            flex: 1;
          }

          /deep/ .el-tag {
            color: #fff;
            border-color: #EB8826;
          }
        }

        .icon {
          width: 20px;
          margin-right: 10px;
          margin-left: 4px;
        }

        .icon-highlight {
          display: none;
        }
      }

      .nav-menu-item {
        border-left: 2px solid transparent;

        &.is-active {
          background: #EFEFEF;
          color: #37A9FA;
          border-left: 2px solid #0094EE;

          .icon {
            display: none;
          }

          .icon-highlight {
            display: inline;
          }
        }
      }

      .nav-submenu {
        position: relative;
        &:before {
          content: " ";
          position: absolute;
          top: 50px;
          bottom: 0;
          left: 32px;
          border-left: 1px solid #D9D9D9;
          z-index: 1;
        }

        .el-submenu__title {
          display: flex;
          align-items: center;

          .el-submenu__icon-arrow {
            font-size: 16px;
            color: #C9D4F6;
          }
        }

        .nav-submenu-item {
          position: relative;

          &:hover {
            background: #f6f7fb;
          }

          &.is-active:before {
            content: " ";
            position: absolute;
            width: 7px;
            height: 7px;
            left: 29px;
            top: 22px;
            border-radius: 50%;
            background: #37A9FA;
            z-index: 2;
          }
        }

        &.is-active {
          .el-submenu__title {
            background: #EFEFEF;
            border-left: 2px solid #0094EE;
          }

          .icon {
            display: none;
          }

          .icon-highlight {
            display: inline;
          }
        }
      }
    }

    .menu-minimizer {
      height: 40px;
      text-align: center;
      color: #5c5c5c;
      line-height: 40px;
      cursor: pointer;

      .icon {
        transition: transform 0.25s;
      }
    }

    &.menu-collapsed {
      width: 64px !important;
      overflow: visible;

      .menu-item-wrapper span.name,
      .el-submenu .el-menu,
      .el-submenu__title span.name,
      .el-submenu__title .el-submenu__icon-arrow {
        display: none;
      }

      .nav-submenu:hover > .el-menu {
        display: block !important;
        position: absolute;
        left: 64px;
        top: 0;
        background: #fff;
        border: 1px solid #ebeef5;
        z-index: 9999;
      }

      .menu-minimizer .icon {
        transform: rotate(180deg);
      }
    }
  }

  .main {
    padding: 0;
  }
}
</style>
