<template>
  <div class="page">
    <breadcrumb :items="[{ name: '应急处置卡' ,route:{ name: 'enterprise-contingency-plan-card' }},{name:contingency.riskName}]"></breadcrumb>
 
    <div class="page-main">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/contingency.png" class="icon">
          <h1>风险单元名称：{{contingency.riskName}}</h1>
        </div>
        <div class="address-info">
          <span class="major-risks">重大风险（{{contingency.oneRisk}}）</span>
          <span class="greater-risk">较大风险（{{contingency.twoRisk}}）</span>
          <span class="general-risk">一般风险（{{contingency.threeRisk}}）</span>
          <span class="low-risk">低风险（{{contingency.fourRisk}}）</span>
          <span class="general-hidden-dangers">一般隐患（{{contingency.generalHidden}}）</span>
          <span class="major-hidden-dangers">重大隐患（{{contingency.majorHidden}}）</span>
        </div>
      </div>

      <div class="content-box">
        <page-card :scrollable="false">
          <div class="tabs">
            <ul class="tabs-nav">
              <router-link
                tag="li"
                replace
                :to="{ name: 'plan-card-scl',  params: { id: $route.params.id } }"
              >SCL</router-link>
              <!-- <router-link
                tag="li"
                replace
                :to="{ name: 'plan-card-jha',  params: { id: $route.params.id } }"
              >JHA</router-link> -->
              <router-link
                tag="li"
                replace
                :to="{ name: 'plan-card-risk-controls',  params: { id: $route.params.id }}"
              >风险管控台账</router-link>
              <router-link
                tag="li"
                replace
                :to="{ name: 'plan-card-hidden-danger-controls',  params: { id: $route.params.id }}"
              >隐患治理台账</router-link>
              <router-link
                tag="li"
                replace
                :to="{ name: 'plan-card-monitoring-equipment',  params: { id: $route.params.id } }"
              >监控设备</router-link>
              <router-link
                tag="li"
                replace
                :to="{ name: 'plan-card',  params: { id: $route.params.id } }"
              >应急处置卡</router-link>
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
import { mapActions } from 'vuex'
import { Loading } from 'element-ui'
import PageCard from '@/components/PageCard'
import Breadcrumb from '@/components/Breadcrumb'
import pick from 'lodash/pick'

export default {
  name: 'PlanCardDetail',

  components: {
    PageCard,
    Breadcrumb
  },

  data () {
    return {
      contingency: {
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
    location () {
      if (this.enterprise.address && this.enterprise.latitude && this.enterprise.longitude)
        return {
          address: this.enterprise.address,
          latitude: this.enterprise.latitude,
          longitude: this.enterprise.longitude
        }
      else
        return null
    },
  },

  methods: {
    ...mapActions('contingencyPlanCard', ['loadRisk']),
  },

  async created () {
    const result = await this.loadRisk(this.$route.params.id)
    this.contingency = pick(result, Object.keys(this.contingency))
  },
}
</script>

<style lang="scss" scoped>
@mixin risks-icon() {
  vertical-align: bottom;
  position: relative;
  height: 17px;
  margin-left: 30px;
  padding: 0 10px;
}
@mixin risks-icon-before($color) {
  position: absolute;
  bottom: 0;
  left: -15px;
  content: "";
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  width: 18px;
  height: 18px;
  background: ($color);
  border-radius: 1px;
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

    .address-info {
      font-size: 13px;
      color: #333;
      line-height: 17px;
      display: flex;
      align-items: center;
      .major-risks {
        @include risks-icon();
      }
      .major-risks::before {
        @include risks-icon-before(#fa5878);
      }
      .greater-risk {
        @include risks-icon();
      }
      .greater-risk::before {
        @include risks-icon-before(#fea340);
      }
      .general-risk {
        @include risks-icon();
      }
      .general-risk::before {
        @include risks-icon-before(#f4d341);
      }
      .low-risk {
        @include risks-icon();
      }
      .low-risk::before {
        @include risks-icon-before(#37a9fa);
      }
      .general-hidden-dangers {
        @include risks-icon();
      }
      .general-hidden-dangers::before {
        @include risks-icon-before(transparent);
        border-bottom: 15px solid #f4d341;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        width: 0;
        height: 0;
      }
      .major-hidden-dangers {
        @include risks-icon();
      }
      .major-hidden-dangers::before {
        @include risks-icon-before(transparent);
        border-bottom: 15px solid #fea340;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        width: 0;
        height: 0;
      }

      .address {
        margin-left: 20px;

        a {
          color: #37a9fa;
          display: inline-flex;
          align-items: center;
          text-decoration: none;

          img {
            margin-left: 5px;
            width: 14px;
            height: 18px;
          }
        }

        /deep/ .el-form-item {
          margin: 0;

          .el-form-item__label,
          .el-form-item__content {
            line-height: normal;
          }

          .el-form-item__label,
          .el-button {
            padding: 0;
          }
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

      a:focus {
        outline: none;
      }
    }
  }

  > .content-box {
    flex: 1;
    display: flex;
    flex-direction: column;

    .tabs {
      display: flex;
      flex-direction: column;
      height: 100%;

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
            border-left: 1px solid #d7e3eb;
            border-right: 1px solid #d7e3eb;
            border-top: 3px solid #37a9fa;
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
          padding: 8px 0;
          border-top: 1px solid #eee;
          text-align: center;
          background: #fff;
        }
      }
    }
  }
}
</style>
