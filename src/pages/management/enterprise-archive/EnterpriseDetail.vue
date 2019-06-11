<template>
  <div :class="['page enterprise-detail', `${$route.name}`]">
    <breadcrumb :items="breadcrumbs"></breadcrumb>

    <div class="page-main">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/enterprise.png" class="icon">
          <h1>{{enterprise.enterpriseName}}</h1>
        </div>
        <div class="address-info">
          <span class="district">行政区划：{{enterprise.administrativeAreas}}</span>
          <el-form :inline="true" class="address" v-if="location">
            <location-input label="地址："
              :readonly="true"
              :value="location">
            </location-input>
          </el-form>
          <span class="address" v-else>
            地址：{{enterprise.address}}
          </span>
        </div>

        <div class="actions">
          <router-link class="link-map"
            :to="{ name: 'enterprise-planar-graph', params: { enterpriseId: $route.params.id } }">
            <img src="@/assets/icons/map.png">
          </router-link>
          <a href="javascript:;" class="link-delete" @click="deleteEnterprise">
            <img src="@/assets/icons/trash-grey.png">
          </a>
        </div>
      </div>

      <div class="content-box">
        <page-card :scrollable="false">
          <div class="tabs">
            <ul class="tabs-nav">
              <router-link tag="li" replace
                :to="{ name: 'enterprise-info', params: { id: $route.params.id } }">
                企业基本信息
              </router-link>
              <router-link tag="li" replace
                :to="{ name: 'enterprise-safety-info', params: { id: $route.params.id } }">
                安全生产信息
              </router-link>
              <router-link tag="li" replace
                :to="{ name: 'enterprise-certifications', params: { id: $route.params.id } }">
                资质许可证
              </router-link>
              <router-link tag="li" replace
                :to="{ name: 'enterprise-employees', params: { id: $route.params.id } }">
                企业人员信息
              </router-link>
              <router-link tag="li" replace
                :to="{ name: 'enterprise-risk-assessments', params: { id: $route.params.id } }">
                风险分级管控及隐患排查治理清单
              </router-link>
              <router-link tag="li" replace
                :to="{ name: 'enterprise-risk-grade', params: { id: $route.params.id } }"
                v-if="showRiskGradeTab">
                整体风险
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
import { mapActions } from 'vuex'
import { Loading } from 'element-ui'
import PageCard from '@/components/PageCard'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'EnterpriseDetail',

  components: {
    PageCard,
    Breadcrumb
  },

  props: {
    isGroup: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      breadcrumbs: [
        this.isGroup ? { name: '一企一档', route: { name: 'enterprise-archive', query: { reset: false } } } : { name: '一企一档', route: { name: 'enterprise-archives', query: { reset: false } } },
        { name: '企业详情' }
      ],

      enterprise: {
        enterpriseName: '',
        administrativeAreas: '',
        address: '',
        longitude: null,
        latitude: null,
        enterpriseGrade: null
      }
    }
  },

  computed: {
    location() {
      if (this.enterprise.address && this.enterprise.latitude && this.enterprise.longitude)
        return {
          address: this.enterprise.address,
          latitude: this.enterprise.latitude,
          longitude: this.enterprise.longitude
        }
      else
        return null
    },

    showRiskGradeTab() {
      return this.enterprise && this.enterprise.enterpriseGrade === '危险化学品'
    }
  },

  methods: {
    ...mapActions('enterprise', ['load', 'delete']),

    deleteEnterprise() {
      this.$confirm('确认删除该企业？', '确认删除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })

            await this.delete(this.$route.params.id)
            loading.close()
            done()

            this.$router.go(-1)
          } else {
            done()
          }
        }
      })
    },

    async loadData() {
      const result = await this.load(this.$route.params.id)
      this.enterprise = Object.assign({
        enterpriseGrade: result.coCompanyInfo.enterpriseGrade
      }, result.headCompanyInfo)
    }
  },

  created() {
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.enterprise-detail.page {
  box-sizing: border-box;

  &.enterprise-info,
  &.enterprise-safety-info,
  &.enterprise-risk-grade {
    .page-main {
      display: block;
      height: 100%;
      overflow-y: auto !important;
    }
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

        .address {
          margin-left: 20px;

          a {
            color: #37A9FA;
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

            .el-form-item__label, .el-form-item__content {
              line-height: normal;
            }

            .el-form-item__label, .el-button {
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
