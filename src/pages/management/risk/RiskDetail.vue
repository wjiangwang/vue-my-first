<template>
  <div class="page risk-detail">
    <breadcrumb :items="breadcrumbItems"  v-if='!isOntimeAndRealTime'></breadcrumb>

    <div class="page-main">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/risk.png" class="icon">
          <h1>{{risk.riskName}}</h1>
        </div>
        <div class="risk-statistics">
          <div class="risk first">
            <span class="icon"></span>
            <span class="value">重大风险（{{risk.oneRisk}}）</span>
          </div>
          <div class="risk second">
            <span class="icon"></span>
            <span class="value">较大风险（{{risk.twoRisk}}）</span>
          </div>
          <div class="risk third">
            <span class="icon"></span>
            <span class="value">一般风险（{{risk.threeRisk}}）</span>
          </div>
          <div class="risk fourth">
            <span class="icon"></span>
            <span class="value">低风险（{{risk.fourRisk}}）</span>
          </div>

          <div class="hidden-danger first">
            <span class="icon"></span>
            <span class="value">一般隐患（{{risk.generalHidden}}）</span>
          </div>
          <div class="hidden-danger second">
            <span class="icon"></span>
            <span class="value">重大隐患（{{risk.majorHidden}}）</span>
          </div>
        </div>
      </div>

      <div class="content-box">
        <page-card :scrollable="false">
          <div class="tabs">
            <ul class="tabs-nav" v-if='!isOntimeAndRealTime'>
              <router-link tag="li" replace
                :to="routePath ? $resolveRoutePath(`${secondUrl}/risk-planar/risks/${$route.params.id}/scl`) : { name: 'risk-scl', params: $route.params }">
                SCL
              </router-link>
              <!-- <router-link tag="li" replace
                :to="routePath ? $resolveRoutePath(`${secondUrl}/risk-planar/risks/${$route.params.id}/jha`) : { name: 'risk-jha', params: $route.params }">
                JHA
              </router-link> -->
              <router-link tag="li" replace
                :to="routePath ? $resolveRoutePath(`${secondUrl}/risk-planar/risks/${$route.params.id}/risk-controls`) : { name: 'risk-controls', params: $route.params }">
                风险管理台账
              </router-link>
              <router-link tag="li" replace
                :to="routePath ? $resolveRoutePath(`${secondUrl}/risk-planar/risks/${$route.params.id}/hidden-danger-controls`) : { name: 'hidden-danger-controls', params: $route.params }">
                隐患管理台账
              </router-link>
              <router-link tag="li" replace
                :to="routePath ? $resolveRoutePath(`${secondUrl}/risk-planar/risks/${$route.params.id}/monitor`) : { name: 'monitor', params: $route.params }">
                监控设备
              </router-link>
              <router-link tag="li" replace
                :to="routePath ? $resolveRoutePath(`${secondUrl}/risk-planar/risks/${$route.params.id}/disposal-card`) : { name: 'disposal-card', params: $route.params }">
                应急处置卡
              </router-link>
            </ul>

            <div class="tabs-content">
              <router-view></router-view>
            </div>
          </div>
        </page-card>
      </div>
    </div>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import { mapActions } from 'vuex'
import PageCard from '@/components/PageCard'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'RiskDetail',

  components: {
    PageCard,
    Breadcrumb
  },

  props: {
    breadcrumbs: {
      type: Array,
      default() { return [] }
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    routePath: {
      type: String,
      default: ''
    },
    secondUrl:{
      type:String,
      default:'enterprise-planar-graph'
    },
    isOntimeAndRealTime:{
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      risk: {
        riskName: '',
        oneRisk: 0,
        twoRisk: 0,
        threeRisk: 0,
        fourRisk: 0,
        generalHidden: 0,
        majorHidden: 0
      }
    }
  },

  computed: {
    breadcrumbItems() {
      return this.breadcrumbs.length ? this.breadcrumbs : this.routePath ? [
          { name: '风险四色分布图', route: { path: this.$resolveRoutePath(`${this.secondUrl}/planar-graph/risk-planar-graph`) } },
          { name: '风险点详情' }
        ] : [
        this.isGroup ? { name: '风险管控及隐患排查系统', route: { name: 'risk-gis' } } : { name: '风险管控及隐患排查系统', route: { name: 'emap' } },
        { name: '四色分布图', route: {
          name: 'emap-risk-planar-graph',
          params: { enterpriseId: this.$route.params.enterpriseId } }
        },
        { name: '风险点详情' }
      ]
    }
  },

  methods: {
    ...mapActions('risk', ['loadRisk'])
  },

  async created() {
    const result = await this.loadRisk(this.$route.params.id)
    this.risk = pick(result, Object.keys(this.risk))
  }
}
</script>

<style lang="scss" scoped>
  @mixin plan-card-table-style {
    /deep/ .el-table {
      overflow: auto;
      .el-table__header-wrapper {
        overflow: visible;
      }
      .el-table__body-wrapper {
        overflow: visible;
      }
    }
    /deep/ .el-table::before {
      height: 0;
    }
    /deep/ .el-table--border::after {
      width: 0;
    }
  }

  .risk-detail.page {
    box-sizing: border-box;
    min-height: 100%;
   // height: auto !important;

    /deep/ .risk-scl {
      @include plan-card-table-style
    }
    /deep/ .risk-jha{
      @include plan-card-table-style
    }

    .page-main {
      display: flex;
      flex-direction: column;

      > .el-card {
        margin: 20px 0 0 20px;
        padding: 24px 20px;
        flex-direction: column;
        align-items: flex-start !important;
        position: relative;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        .name {
          display: flex;
          align-items: center;
          margin-bottom: 28px;

          .icon {
            width: 34px;
            height: 34px;
            margin-right: 8px;
          }

          h1 {
            font-size: 22px;
            line-height: 30px;
            margin: 0;
          }
        }

        .risk-statistics {
          font-size: 13px;
          color: #333;
          line-height: 17px;
          display: flex;
          align-items: center;

          .risk, .hidden-danger {
            display: flex;
            align-items: center;
            margin-right: 20px;
          }

          .risk {
            .icon {
              width: 18px;
              height: 18px;
              margin-right: 5px;
            }

            &.first .icon {
              background: #FA5878;
            }

            &.second .icon {
              background: #FEA340;
            }

            &.third .icon {
              background: #F4D341;
            }

            &.fourth .icon {
              background: #37A9FA;
            }
          }

          .hidden-danger {
            .icon {
              width: 0;
              height: 0;
              border: 9px solid transparent;
              margin-top: -9px;
              margin-right: 5px;
            }

            &.first .icon {
              border-bottom: 18px solid#F4D341;
            }

            &.second .icon {
              border-bottom: 18px solid#FEA340;
            }
          }
        }

        .actions {
          position: absolute;
          top: 14px;
          right: 35px;

          .link-map img {
            width: 25px;
            height: 20px;
            margin-right: 30px;
          }

          .link-delete img {
            width: 14px;
            height: 18px;
          }
        }
      }

      > .content-box {
        flex: 1;
        display: flex;
        flex-direction: column;

        .el-card {
          flex: 1;
          /deep/ .card-body {
            display: flex;
            flex-direction: column;
          }
        }

        .tabs {
          display: flex;
          flex-direction: column;
          flex: 1;

          .tabs-nav {
            list-style: none;
            margin: 0 0 20px;
            padding: 0;

            li {
              font-size: 14px;
              color: #999999;
              line-height: 20px;
              height: 38px;
              display: inline-block;
              padding: 7px 32px 0;
              box-sizing: border-box;
              border-top: 3px solid transparent;
              cursor: pointer;

              &.router-link-active {
                border-left: 1px solid #D7E3EB;
                border-right: 1px solid #D7E3EB;
                border-top: 3px solid #37A9FA;
              }

              &.router-link-active:first-child {
                border-left: 0;
              }
            }
          }

          .tabs-content {
            flex: 1;
            display: flex;

            /deep/ .form-wrapper + .form-buttons {
              position: absolute;
              bottom: 0;
              width: 100%;
              padding: 8px 0;
              border-top: 1px solid #eee;
              text-align: center;
              background: #fff;
            }
          }
        }
      }
    }
  }
</style>
