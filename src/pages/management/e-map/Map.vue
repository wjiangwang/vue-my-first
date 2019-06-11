<template>
  <div class="page">
    <div class="enterprise-list">
      <div class="enterprise-list-info">
        <div>
          <div class="enterprise-info" v-for="item in enterpriseMapItems" @click="showMapItemInfoWindow(item.id)" :class="{color: item.infoWindowShow}">
            {{item.enterpriseName}}
          </div>
        </div>
      </div>
      <div class="enterprise-img">
        <img src="@/assets/images/enterprise-list.png">
      </div>
    </div>
    <baidu-map :ak="appKey"
      class="map-view"
      :map-click="false"
      :center="map.center"
      :scroll-wheel-zoom="true"
      v-loading="loading">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <bm-boundary :name="map.center"
        :stroke-weight="2"
        stroke-color="#64985F"
        fill-color="#64985F"
        :fill-opacity="0.2">
      </bm-boundary>
      <bm-marker v-for="item in enterpriseMapItems"
        :key="item.id"
        :position="{ lng: item.longitude, lat: item.latitude }"
        :icon="getMarkerIcon(item)"
        @click="showMapItemInfoWindow(item.id)">
        <bm-info-window :show="item.infoWindowShow"
          :width="240" :height="0" :autoPan="true"
          @close="hideMapItemInfoWindow(item.id)">
          <div class="marker-info-window">
            <div class="fields">
              <div class="item">
                <span class="label">企业名称：</span>
                <span class="value">{{item.enterpriseName}}</span>
              </div>
              <div class="item">
                <span class="label">地址：</span>
                <span class="value">{{item.address}}</span>
              </div>
              <div class="item">
                <span class="label">主要产品：</span>
                <span class="value">{{item.mainProduct}}</span>
              </div>
            </div>

            <el-button type="primary" size="mini"
              @click="$router.push({ name: 'emap-risk-planar-graph', params: { enterpriseId: item.id } })">
              查看企业安全风险四色分布图
            </el-button>
          </div>
        </bm-info-window>
      </bm-marker>
    </baidu-map>

    <div class="tools-l">
      <el-radio-group v-model="mapTypeValue" @change="handleMapType" class="map-type-select" v-if="isManagement">
        <el-radio-button :label="1">双预控企业</el-radio-button>
        <el-radio-button :label="2">重大危险源企业</el-radio-button>
        <el-radio-button :label="3">安全教育企业</el-radio-button>
      </el-radio-group>
    </div>

    <div class="tools">
      <div class="select-container">
        <el-select clearable v-model="riskStatus" placeholder="风险管控状态" v-if="mapType !== 2 && mapType !== 3">
          <el-option label="整体风险" :value="1" :key="1"></el-option>
          <el-option label="实时风险" :value="2" :key="2"></el-option>
        </el-select>
        <el-select clearable v-model="hazardLevel" placeholder="危险源等级" v-if="mapType === 2">
          <el-option
            v-for="item in hazardLevels"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select clearable v-model="educationStatusValue" placeholder="安全教育状态" v-if="mapType === 3">
          <el-option
            v-for="item in educationStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="map-items-filter">
        <el-dropdown trigger="click"
          @command="filterMapItems">
          <a href="javascript:;" class="button">
            <img src="@/assets/icons/filter.png">
          </a>

          <el-dropdown-menu slot="dropdown" class="map-items-filter-dropdown">
            <el-dropdown-item :class="{ selected: !currentEnterpriseGrade }">
              全部类型
            </el-dropdown-item>
            <el-dropdown-item v-for="(item, index) in enterpriseGrades"
              :key="index"
              :command="item"
              :class="{ selected: currentEnterpriseGrade && currentEnterpriseGrade.id === item.id }">
              {{item.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div style="display: flex; width: 382px;">
        <div class="multi-dimension-tool" v-show="mapType !== 2 && mapType !== 3">
          <el-popover placement="bottom-end"
            v-model="multiDimensionPopoverVisible"
            :visible-arrow="false"
            width="333"
            popper-class="multi-dimension-popover">
            <a href="javascript:;" slot="reference" class="button">
              <img src="@/assets/icons/dimension-search.png">
            </a>

            <div class="dimension-panel" style="overflow: hidden;">
              <div class="header">
                <div class="title">多维度查询</div>
                <div class="filter">
                  <el-form :model="multiDimensionForm"
                    label-suffix="："
                    label-width="60px"
                    size="small"
                    ref="multiDimensionForm"
                    class="filter-form">
                    <resource-input label="条件"
                      name="controlleFactor"
                      resource-name="multidimensional"
                      :value="multiDimensionForm.controlleFactor"
                      @input="multiDimensionForm.controlleFactor = $event">
                    </resource-input>
                    <district-input label="区域"
                      name="areaId"
                      :select-any="true"
                      :value="multiDimensionForm.areaId"
                      @input="multiDimensionForm.areaId = $event">
                    </district-input>
                  </el-form>
                  <div class="buttons">
                    <el-button size="small" @click="resetMultiDimensionForm">重置</el-button>
                    <el-button type="primary"
                      size="small"
                      :loading="multiDimensionListLoading"
                      @click.prevent="submitMultiDimensionForm">
                      查询
                    </el-button>
                  </div>
                </div>
              </div>

              <div class="filter-result">
                <div>
                  <el-radio-group :value="dimensionList.status"
                    size="mini"
                    @input="handleControlStatusChange($event)"
                    v-if="showControlStatus">
                    <el-radio-button :label="1">启用</el-radio-button>
                    <el-radio-button :label="0">不启用</el-radio-button>
                  </el-radio-group>
                </div>

                <div class="total">共计：{{dimensionList.total}}家企业</div>
              </div>

              <scroll-view style="height: 400px;">
                <div class="list">
                  <div class="item"
                    v-for="(item, index) in dimensionList.items"
                    :key="index"
                    @click="dashboardEnterprises.show({ title: '企业名单', type: 'label', params: Object.assign({ label: item.label }, multiDimensionForm) })">
                    <span class="label">{{item.label}}</span>
                    <span class="value">{{item.countCompany}}</span>
                  </div>
                </div>
              </scroll-view>
            </div>
          </el-popover>
        </div>

        <div class="search-tool" v-show="mapType !== 2 && mapType !== 3">
          <el-popover placement="bottom-end"
            v-model="searchPopoverVisible"
            :visible-arrow="false"
            trigger="focus"
            width="333"
            popper-class="enterprise-tree-popover">
            <el-input placeholder="查询企业名称" slot="reference" v-model="filterKeyword">
              <el-button slot="append"
                icon="el-icon-search"
                class="search-button"
                @click="filter()">
              </el-button>
            </el-input>

            <div class="tree-panel" style="overflow: hidden;">
              <scroll-view style="height: 500px;">
                <el-tree :data="enterpriseTreeList"
                  :props="{ children: 'children', label: 'label' }"
                  v-if="!filtered"
                  @node-click="handleTreeNodeClick">
                </el-tree>

                <div class="filter-result" v-else>
                  <div class="list">
                    <div class="item"
                      v-for="item in filteredList"
                      :key="item.id"
                      @click="handleShowMapItemInfoWindow(item.id)">
                      {{item.enterpriseName}}
                    </div>
                  </div>
                </div>
              </scroll-view>
            </div>
          </el-popover>
        </div>
      </div>
    </div>

    <div class="legend">
      <div class="legend-visible" v-if="legendVisible">
        <div class="header">
          <a href="javascript:;" class="close-button" @click="legendVisible = false">
            <img src="@/assets/icons/map-legend-minimize.png">
          </a>
        </div>

        <div class="content">
          <table class="el-table el-table--fit el-table--border"
            cellspacing="0" cellpadding="0" border="0" v-if="mapType === 2">
            <thead>
              <tr>
                <td class="has-bg" rowspan="">危险源等级</td>
                <td>四级危险源</td>
                <td>三级危险源</td>
                <td>二级危险源</td>
                <td>一级危险源</td>
              </tr>
            </thead>
            <tbody>
              <tr class="el-table__row">
                <td colspan="" class="has-bg">图标</td>
                <td><img src="static/markers/hazard-marker-level4.png"></td>
                <td><img src="static/markers/hazard-marker-level3.png"></td>
                <td><img src="static/markers/hazard-marker-level2.png"></td>
                <td><img src="static/markers/hazard-marker-level1.png"></td>
              </tr>
            </tbody>
          </table>

          <table class="el-table el-table--fit el-table--border"
            cellspacing="0" cellpadding="0" border="0" v-else-if="mapType === 3">
            <thead>
              <tr>
                <!-- <td rowspan="2" colspan="2" class="has-bg">图例</td>
                <td colspan="5">企业上月培训得分范围</td> -->
                <td rowspan="2" colspan="3" class="has-bg">图例</td>
                <td colspan="4">企业上月培训得分范围</td>
              </tr>
              <tr>
                <td>0-59</td>
                <td>60-69</td>
                <td>70-79</td>
                <td>80以上</td>
              </tr>
            </thead>
            <tbody>
              <!-- <tr class="el-table__row">
                <td rowspan="2" class="has-bg">完成今日测试</td>
                <td class="has-bg">已完成</td>
                <td><img src="static/markers/educate-marker-level1.png"></td>
                <td><img src="static/markers/educate-marker-level2.png"></td>
                <td><img src="static/markers/educate-marker-level3.png"></td>
                <td><img src="static/markers/educate-marker-level4.png"></td>
              </tr>
              <tr class="el-table__row">
                <td class="has-bg">未完成</td>
                <td><img src="static/markers/no-educate-marker-level1.png"></td>
                <td><img src="static/markers/no-educate-marker-level2.png"></td>
                <td><img src="static/markers/no-educate-marker-level3.png"></td>
                <td><img src="static/markers/no-educate-marker-level4.png"></td>
              </tr> -->

              <tr class="el-table__row">
                <td rowspan="2" colspan="2" class="has-bg">完成今日测试</td>
                <td class="has-bg">已完成</td>
                <td><img src="static/markers/educate-marker-level1.png"></td>
                <td><img src="static/markers/educate-marker-level2.png"></td>
                <td><img src="static/markers/educate-marker-level3.png"></td>
                <td><img src="static/markers/educate-marker-level4.png"></td>
              </tr>
              <tr class="el-table__row">
                <td class="has-bg">未完成</td>
                <td><img src="static/markers/no-educate-marker-level1.png"></td>
                <td><img src="static/markers/no-educate-marker-level2.png"></td>
                <td><img src="static/markers/no-educate-marker-level3.png"></td>
                <td><img src="static/markers/no-educate-marker-level4.png"></td>
              </tr>
              <tr class="el-table__row">
                <td colspan="3" class="has-bg">未接入</td>
                <td colspan="4"><img src="static/markers/no-control-marker.png"></td>
              </tr>
            </tbody>
          </table>

          <table class="el-table el-table--fit el-table--border"
            cellspacing="0" cellpadding="0" border="0" v-else>
            <thead>
              <tr>
                <td rowspan="2" colspan="2" class="has-bg">图例</td>
                <td colspan="5">企业整体风险评估等级</td>
              </tr>
              <tr>
                <td>低风险</td>
                <td>一般风险</td>
                <td>较大风险</td>
                <td>重大风险</td>
                <td>未分级</td>
              </tr>
            </thead>
            <tbody>
              <tr class="el-table__row">
                <td rowspan="2" class="has-bg">双预控平台</td>
                <td class="has-bg">已接入</td>
                <td><img src="static/markers/control-marker-level4.png"></td>
                <td><img src="static/markers/control-marker-level3.png"></td>
                <td><img src="static/markers/control-marker-level2.png"></td>
                <td><img src="static/markers/control-marker-level1.png"></td>
                <td><img src="static/markers/control-marker.png"></td>
              </tr>
              <tr class="el-table__row">
                <td class="has-bg">未接入</td>
                <td><img src="static/markers/no-control-marker-level4.png"></td>
                <td><img src="static/markers/no-control-marker-level3.png"></td>
                <td><img src="static/markers/no-control-marker-level2.png"></td>
                <td><img src="static/markers/no-control-marker-level1.png"></td>
                <td><img src="static/markers/no-control-marker.png"></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
      <div class="legend-collapsed" v-else @click="legendVisible = true">
        <img src="@/assets/icons/map-legend.png">
      </div>
    </div>

    <dashboard-enterprises ref="dashboardEnterprises"></dashboard-enterprises>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import { BmMarker, BmInfoWindow, BmBoundary, BmNavigation } from 'vue-baidu-map'
  import { getSession } from '@/modules/authentication'
  import ScrollView from '@/components/ScrollView'
  import enterpriseDistrictMixin from '@/mixins/enterprise-district-mixin'
  import DashboardEnterprises from '@/pages/management/DashboardEnterprises'

  export default {
    name: 'Map',

    components: {
      BaiduMap,
      BmMarker,
      BmInfoWindow,
      BmBoundary,
      BmNavigation,
      ScrollView,
      DashboardEnterprises
    },

    mixins: [enterpriseDistrictMixin],

    props: {
      address: String,
      isManagement: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const { user } = getSession()

      return {
        map: {
          center: user.gisDistrictName || user.riskDistrictName || this.address || '成都市'
        },

        multiDimensionPopoverVisible: false,
        searchPopoverVisible: false,

        currentEnterpriseGrade: null,
        legendVisible: false,

        multiDimensionListLoading: false,
        multiDimensionForm: {
          controlleFactor: '',
          areaId: ''
        },
        multiDimensionFormSubmitted: false,

        filterKeyword: null,
        filtered: false,
        filteredList: [],

        mapTypeValue: 1,
        mapTypes: [
          {
            label: '双预控企业',
            value: 1
          },
          {
            label: '重大危险源企业',
            value: 2
          },
          {
            label: '安全教育企业',
            value: 3
          }
        ],

        controlStatus: '',
        riskStatus: '',

        educationStatusValue: '',
        educationStatus: [
          {
            label: '未接入',
            value: 0
          },
          {
            label: '已接入',
            value: 1
          },
          {
            label: '已完成',
            value: 2
          },
          {
            label: '未完成',
            value: 3
          }
        ],

        hazardLevel: '',
        hazardLevels: [
          {
            label: '一级危险源',
            value: 1
          },
          {
            label: '二级危险源',
            value: 2
          },
          {
            label: '三级危险源',
            value: 3
          },
          {
            label: '四级危险源',
            value: 4
          }
        ],

        loading: false
      }
    },

    computed: {
      ...mapState('emap', [
        'enterpriseMapItems', 'enterpriseTreeList', 'dimensionList', 'enterpriseGrades', 'mapType'
      ]),
      ...mapGetters('emap', ['filteredEnterprises']),

      appKey() {
        return process.env.BAIDU_MAP_APP_KEY
      },

      showControlStatus() {
        return this.multiDimensionFormSubmitted && this.multiDimensionForm.controlleFactor &&
          this.multiDimensionForm.areaId && this.dimensionList.total > 0
      },

      dashboardEnterprises() {
        return this.$refs.dashboardEnterprises
      }
    },

    methods: {
      ...mapMutations('emap', [
        'showMapItemInfoWindow', 'hideMapItemInfoWindow', 'setMapType'
      ]),
      ...mapActions('emap', [
        'loadEnterpriseMapItems', 'loadEnterpriseTreeListData', 'loadDimensionListData',
        'updateControlStatus', 'loadEnterpriseGrades'
      ]),

      getMarkerIcon(enterprise) {
        let iconName
        if (this.mapType === 3) {
          if (enterprise.whetherTraining === 1) {
            if (enterprise.isAnswer === 1) {
              if (enterprise.average >= 80) {
                iconName = 'educate-marker-level4'
              } else if (enterprise.average >= 70 && enterprise.average < 80) {
                iconName = 'educate-marker-level3'
              } else if (enterprise.average >= 60 && enterprise.average < 70) {
                iconName = 'educate-marker-level2'
              } else {
                iconName = 'educate-marker-level1'
              }
            } else {
              if (enterprise.average >= 80) {
                iconName = 'no-educate-marker-level4'
              } else if (enterprise.average >= 70 && enterprise.average < 80) {
                iconName = 'no-educate-marker-level3'
              } else if (enterprise.average >= 60 && enterprise.average < 70) {
                iconName = 'no-educate-marker-level2'
              } else {
                iconName = 'no-educate-marker-level1'
              }
            }
          } else {
            return {
              url: '/static/markers/no-control-marker.png',
              size: { width: 16, height: 20 }
            }
          }

          return {
            url: `/static/markers/${iconName}.png`,
            size: { width: 24, height: 26 }
          }
        } else if (this.mapType === 2) {
          if (enterprise.declareLevel)
            iconName = `hazard-marker-level${enterprise.declareLevel}`
          else
            iconName = 'no-control-marker'

          return {
            url: `/static/markers/${iconName}.png`,
            size: { width: 26, height: 22 }
          }
        } else {
          if (enterprise.hasControls === 1) {
            if (enterprise.hasAssessment === 1) {
              iconName = `control-marker-level${enterprise.riskLevel}`
            } else {
              iconName = 'control-marker'
            }

            return {
              url: `/static/markers/${iconName}.png`,
              size: { width: 17, height: 16 }
            }
          } else {
            if (enterprise.hasAssessment === 1) {
              iconName = `no-control-marker-level${enterprise.riskLevel}`
            } else {
              iconName = 'no-control-marker'
            }

            return {
              url: `/static/markers/${iconName}.png`,
              size: { width: 16, height: 20 }
            }
          }
        }
      },

      filterMapItems(enterpriseGrade) {
        this.currentEnterpriseGrade = enterpriseGrade

        if (enterpriseGrade) {
          this.loadEnterpriseMapItems({ keywords: enterpriseGrade.name })
        } else {
          this.loadEnterpriseMapItems()
        }
      },

      resetMultiDimensionForm() {
        if (this.multiDimensionListLoading) return
        if (!this.multiDimensionForm.controlleFactor && !this.multiDimensionForm.areaId) return

        this.$refs.multiDimensionForm.resetFields()
        this.submitMultiDimensionForm()
      },

      async submitMultiDimensionForm() {
        this.multiDimensionListLoading = true
        await this.loadDimensionListData(this.multiDimensionForm)
        this.multiDimensionFormSubmitted = true
        this.multiDimensionListLoading = false
      },

      handleControlStatusChange(status) {
        this.updateControlStatus({
          status,
          name: this.multiDimensionForm.controlleFactor,
          areaCode: this.getDistrictCode(this.multiDimensionForm.areaId)
        })
      },

      filter() {
        if (this.filterKeyword) {
          this.filtered = true
          this.filteredList = this.filteredEnterprises(this.filterKeyword)
        } else {
          this.filtered = false
          this.filteredList = []
        }
      },

      handleTreeNodeClick(data) {
        if (data.isEnterprise) {
          this.showMapItemInfoWindow(data.id)
          this.searchPopoverVisible = false
        }
      },

      handleShowMapItemInfoWindow(id) {
        this.showMapItemInfoWindow(id)
        this.searchPopoverVisible = false
      },

      async handleMapType (o) {

        this.setMapType(this.mapTypeValue)

        this.hazardLevel = ''
        this.riskStatus = ''
        this.educationStatusValue = ''

        this.loading = true
        if (this.currentEnterpriseGrade) {
          await this.loadEnterpriseMapItems({ keywords: this.currentEnterpriseGrade.name })
        } else {
          await this.loadEnterpriseMapItems()
        }
        this.loading = false
      }
    },

    async created() {
      this.loading = true
      if (this.isManagement) {
        this.mapTypeValue = this.mapType
      }
      await this.loadEnterpriseMapItems()
      this.loadEnterpriseGrades()
      this.loadEnterpriseTreeListData()
      this.loading = false
    },

    watch: {
      ['multiDimensionForm.controlleFactor']() {
        this.multiDimensionFormSubmitted = false
      },

      ['multiDimensionForm.areaId']() {
        this.multiDimensionFormSubmitted = false
      },

      async riskStatus (val) {
        if (this.mapType === 1) {
          this.loading = true
          if (this.currentEnterpriseGrade) {
            await this.loadEnterpriseMapItems({ keywords: this.currentEnterpriseGrade.name, isRealTime: val })
          } else {
            await this.loadEnterpriseMapItems({ isRealTime: val })
          }
          this.loading = false
        }
      },

      async hazardLevel (val) {
        if (this.mapType === 2) {
          this.loading = true
          if (this.currentEnterpriseGrade) {
            await this.loadEnterpriseMapItems({ keywords: this.currentEnterpriseGrade.name, declareLevel: val })
          } else {
            await this.loadEnterpriseMapItems({ declareLevel: val })
          }
          this.loading = false
        }
      },

      async educationStatusValue (val) {
        if (this.mapType === 3) {
          this.loading = true
          if (this.currentEnterpriseGrade) {
            await this.loadEnterpriseMapItems({ keywords: this.currentEnterpriseGrade.name, whetherTraining: val })
          } else {
            await this.loadEnterpriseMapItems({ whetherTraining: val })
          }
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    position: relative;

    .enterprise-list:hover{
      left: 0px;
    }
    .enterprise-list:hover .enterprise-img{
      transform: translateX(0);
      img {
        top: 40px;
      }
    }
    .enterprise-list {
      position: absolute;
      left: -280px;
      bottom: 0;
      z-index: 2;
      display: flex;
      transition: all .5s ease;
      height: 80%;
      min-height: 500px;

      .enterprise-list-info {
        box-sizing: border-box;
        box-shadow: 0px 0px 4px 2px rgba(0,0,0,0.17);
        background-color: white;
        width: 280px;
        height: 100%;
        padding: 15px 10px;
        transition: all .5s ease;

        .enterprise-info {
          font-size: 14px;
          line-height: 14px;
          margin-top: 10px;
          margin-bottom: 10px;
          color: #666;
          cursor:pointer;
          &:hover {
            color: #37A9FA;
          }
        }

        .color {
          color: #37A9FA;
        }

        >div {
          height: 100%;
          width: 100%;
          overflow: hidden;
          overflow-y: auto;
          >:first-child {
            margin-top: 0;
          }
          >:last-child {
            margin-bottom: 0;
          }
        }
      }

      .enterprise-img {
        cursor:pointer;
        width: 30px;
        transition: all .5s ease;
        height: 100%;
        position: relative;
        img {
          position: absolute;
          bottom: 80px;
        }
      }
    }

    .map-view {
      width: 100%;
      height: 100%;
    }

    .marker-info-window {
      text-align: center;

      .fields {
        font-size: 13px;
        color: #333333;
        text-align: left;
        padding-top: 10px;
        .item {
          margin-bottom: 10px;
        }
      }
    }

    .tools-l {
      position: absolute;
      top: 25px;
      left: 80px;
      display: flex;
      align-items: center;
      .map-type-select {
        margin-right: 8px;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.17);
        /deep/ .el-radio-button:first-child .el-radio-button__inner {
          border-left: 1px solid #fff;
        }
        /deep/ .el-radio-button__inner {
          border-radius: 0 !important;
          border: 0;
          border-left: 1px solid #dcdfe6;
        }
        /deep/ .is-active {
          /deep/.el-radio-button__inner {
            border-left: 1px solid #409EFF !important;
            background-color: #37A9FA;
          }
        }
        /*/deep/ .el-input {
          /deep/ .el-input__inner {
            border: 0;
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.17);
            border-radius: 0;
          }
        }*/
      }
    }

    .tools {
      position: absolute;
      top: 25px;
      right: 30px;
      display: flex;
      align-items: center;

      .select-container {
        /deep/ .el-select {
          margin-right: 8px;
          box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.17);
          /deep/ .el-input input {
            border-radius: 0;
          }
        }
      }

      .map-items-filter .button,
      .multi-dimension-tool .button {
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.17);
        margin-right: 8px;

        img {
          width: 18px;
          height: 18px;
        }
      }

      .search-tool {
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.17);
        width: 333px;

        /deep/ .el-input input {
          border-radius: 0;
        }

        .search-button {
          border-radius: 0;
          background: #37A9FA;
          border: 1px solid #37A9FA;
          color: #fff;
        }
      }
    }

    .legend {
      .legend-collapsed {
        position: absolute;
        width: 40px;
        height: 40px;
        right: 15px;
        bottom: 30px;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .legend-visible {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 522px;
        text-align: center;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.17);

        .header {
          height: 40px;
          background: #5C6979;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .close-button {
            margin: 8px 15px 0 0;
            img {
              width: 25px;
              height: 22px;
            }
          }
        }

        table {
          thead, tbody {
            font-weight: 500;
            color: #333;
          }

          td {
            text-align: center;
            &.has-bg {
              background: #F9FDFF;
            }
          }
        }
      }

      .title {
        color: #666;
        font-size: 16px;
        line-height: 21px;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          display: flex;
          align-items: center;
          margin-top: 14px;

          .color {
            width: 16px;
            height: 16px;
            margin-right: 10px;

            &.color-red {
              background: #EF2B52;
            }

            &.color-orange {
              background: #FEA340;
            }

            &.color-yellow {
              background: #F4D341;
            }

            &.color-blue {
              background: #37A9FA;
            }
          }

          .label {
            color: #333;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .map-items-filter-dropdown {
    .el-dropdown-menu__item.selected {
      background-color: #ecf5ff;
      color: #66b1ff;
    }
  }

  .multi-dimension-popover .dimension-panel {
    .header {
      border-bottom: 1px solid #E5E5E5;
      margin-left: -12px;
      margin-right: -12px;
      padding-left: 12px;
      padding-right: 12px;
    }

    .title {
      color: #333333;
      font-size: 14px;
      line-height: 19px;
      font-weight: 500;
      margin-bottom: 10px
    }

    .filter {
      margin-bottom: 12px;

      .buttons {
        text-align: right;
      }
    }

    .filter-result {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 8px 0 14px 0;

      .total {
        color: #999999;
        font-size: 13px;
        text-align: right;
      }
    }

    .list {
      display: flex;
      flex-wrap: wrap;

      .item {
        background: rgba(244,244,244,1);
        border-radius: 2px;
        color: #666;
        font-size: 13px;
        padding: 5px 10px;
        margin-right: 6px;
        margin-bottom: 10px;
        cursor: pointer;

        .value {
          color: #37A9FA;
        }
      }
    }
  }

  .enterprise-tree-popover {
    .filter-result {
      .list .item {
        color: #333333;
        font-size: 13px;
        margin-bottom: 15px;
        width: 333px;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    }
  }
</style>

