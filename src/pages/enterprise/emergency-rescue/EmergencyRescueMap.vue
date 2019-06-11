<template>
  <div class="page">
    <div class="expert-list">
      <div class="expert-list-info">
        <data-table
          :columns="tableColumns"
          :data="erExperts"
          style="flex: 1;"
          :show-bottom-bar="false">
        </data-table>
      </div>
      <div class="expert-img">
        <img src="@/assets/images/expert.png">
      </div>
    </div>
    <baidu-map :ak="appKey"
      class="rescue-map-view"
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
      <!-- <bm-driving
        start="天通苑北"
        end="宋家庄地铁站"
        :auto-viewport="true"
        policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
        :panel="false"
        location="北京"
        :waypoints="['西二旗']">
      </bm-driving> -->
      <bm-marker v-for="item in items"
        :key="item.id"
        :position="{ lng: item.longitude, lat: item.latitude }"
        :icon="getMarkerIcon(item)"
        @click="showMapItemInfoWindow(item.id)">

        <bm-label
          :content="item.name"
          :labelStyle="{color: '#52CBD6'}"
          v-if="item.type === 'rescueTeam'"/>
        <bm-label
          :content="item.name"
          :labelStyle="{color: '#D89052'}"
          v-if="item.type === 'equipmentMaterial'"/>

        <bm-info-window :show="item.infoWindowShow"
          :width="360" :height="0" :autoPan="true"
          @close="hideMapItemInfoWindow(item.id)">
          <div class="marker-info-window">
            <div class="fields">
              <div class="material-title" v-if="item.type !== 'enterprise'">
                {{item.type === 'rescueTeam' ? '队伍信息' : '物资信息'}}
              </div>

              <div class="item" v-if="item.type === 'enterprise'">
                <span class="label">当前企业：</span>
                <span class="value">{{item.name}}</span>
              </div>

              <data-table v-if="item.type === 'rescueTeam'"
                :columns="rescueTeamTableColumns"
                :data="item.itemList"
                style="flex: 1;"
                :show-bottom-bar="false">
              </data-table>

              <data-table v-if="item.type === 'equipmentMaterial'"
                :columns="equipmentMaterialTableColumns"
                :data="item.itemList"
                style="flex: 1;"
                :show-bottom-bar="false">
              </data-table>
            </div>
          </div>
        </bm-info-window>
      </bm-marker>
      <!-- <bm-driving v-for="(item, index) in items" v-if="item.type !== 'enterprise'"
        :start="{ lng: item.longitude, lat: item.latitude }"
        :end="{ lng: items[0].longitude, lat: items[0].latitude }">
      </bm-driving> -->
    </baidu-map>

    <div class="tools">
      <div class="search-tool">
        <el-popover placement="bottom-end"
          v-model="searchPopoverVisible"
          :visible-arrow="false"
          trigger="focus"
          width="333"
          popper-class="enterprise-tree-popover">
          <el-input placeholder="查询救援队伍、物资" slot="reference" v-model="filterKeyword">
            <el-button slot="append"
              icon="el-icon-search"
              class="search-button"
              @click="filter()">
            </el-button>
          </el-input>

          <div class="tree-panel" style="overflow: hidden;">
            <scroll-view style="height: 500px;">
              <el-tree :data="queryList"
                :props="{ children: 'children', label: 'label' }"
                v-if="!filtered"
                @node-click="handleTreeNodeClick">
              </el-tree>

              <div class="filter-result" v-else>
                <div class="list">
                  <div class="item"
                    v-for="item in filteredList"
                    :key="item.key"
                    @click="handleShowMapItemInfoWindow(item.id)">
                    {{item.label}}
                  </div>
                </div>
              </div>
            </scroll-view>
          </div>
        </el-popover>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import { BmMarker, BmInfoWindow, BmBoundary, BmNavigation, BmLabel, BmDriving } from 'vue-baidu-map'
  import ScrollView from '@/components/ScrollView'
  import { getSession } from '@/modules/authentication'
  import DataTable from '@/components/DataTable'

  const tableColumns = [
    { title: '名称', name: 'name' },
    { title: '所学专业', name: 'professional' },
    { title: '移动电话', name: 'phone' }
  ]

  const rescueTeamTableColumns = [
    { title: '名称', name: 'rescueTeamName' },
    { title: '等级', name: 'qualificationLevel' },
    { title: '类型', name: 'rescueTeamType' },
    { title: '值班电话', name: 'onDutyPhone' }
  ]

  const equipmentMaterialTableColumns = [
    { title: '名称', name: 'equipmentName' },
    { title: '类型', name: 'equipmentType' },
    { title: '数量', name: 'number' },
    { title: '电话', name: 'phone' }
  ]

  export default {
    name: 'EmergencyRescueMap',

    components: {
      BaiduMap,
      BmMarker,
      BmInfoWindow,
      BmBoundary,
      BmNavigation,
      BmLabel,
      ScrollView,
      DataTable,
      BmDriving
    },

    props: {
    },

    data() {
      const { user } = getSession()

      return {
        tableColumns,
        rescueTeamTableColumns,
        equipmentMaterialTableColumns,
        map: {
          center: user.area || user.city || '成都市'
        },

        center: {lng: 0, lat: 0},

        searchPopoverVisible: false,

        filterKeyword: null,
        filtered: false,
        filteredList: [],
        loading: false
      }
    },

    computed: {
      ...mapState('emergencyRescueMap', [
        'items', 'erExperts', 'queryList']),
      ...mapGetters('emergencyRescueMap', ['filteredEnterprises']),

      appKey() {
        return process.env.BAIDU_MAP_APP_KEY
      }
    },

    methods: {
      ...mapMutations('emergencyRescueMap', ['showMapItemInfoWindow',
        'hideMapItemInfoWindow', 'showMapItemInfoWindowKeyword']),
      ...mapActions('emergencyRescueMap', [
        'getMapRescue']),

      getMarkerIcon(item) {
        let iconName

        if (item.type === 'rescueTeam') {
          iconName = 'rescue-team'
        } else if (item.type === 'equipmentMaterial') {
          iconName = 'equipment-material'
        } else {
          iconName = 'enterprise-point'
        }

        return {
          url: `/static/markers/${iconName}.png`,
          size: { width: 28, height: 28 }
        }
      },

      handleTreeNodeClick(data) {
        if (data.isClick) {
          this.showMapItemInfoWindow(data.id)
          this.searchPopoverVisible = false
        }
      },

      handleShowMapItemInfoWindow(id) {
        this.showMapItemInfoWindow(id)
        this.searchPopoverVisible = false
      },

      filter() {
        if (this.filterKeyword) {
          this.filtered = true
          this.filteredList = this.filteredEnterprises(this.filterKeyword)
        } else {
          this.filtered = false
          this.filteredList = []
        }
      }
    },

    created() {
      this.getMapRescue()
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    position: relative;

    .expert-list:hover{
      left: 0px;
    }
    .expert-list:hover .expert-img{
      transform: translateX(0);
      img {
        top: 40px;
      }
    }
    .expert-list {
      position: absolute;
      left: -280px;
      bottom: 0;
      z-index: 2;
      display: flex;
      transition: all .5s ease;
      height: 80%;
      min-height: 500px;

      .expert-list-info {
        box-sizing: border-box;
        box-shadow: 0px 0px 4px 2px rgba(0,0,0,0.17);
        background-color: white;
        width: 280px;
        height: 100%;
        padding: 10px 5px;
        transition: all .5s ease;
      }

      .expert-img {
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

    .rescue-map-view {
      width: 100%;
      height: 100%;
    }

    .marker-info-window {
      text-align: center;

      .fields {
        font-size: 13px;
        color: #333333;
        text-align: left;
        padding-top: 18px;
        max-height: 400px;
        position: relative;

        .material-title {
          position: absolute;
          color: #333;
          font-weight: 700;
          top: -3px;
        }

        .item {
          position: absolute;
          top: 10px;
        }
      }
    }

    .tools {
      position: absolute;
      top: 25px;
      right: 30px;
      display: flex;
      align-items: center;

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
  }
</style>

<style lang="scss">
  .rescue-map-view {
    .BMap_Marker {
      .BMapLabel {
        background-color: transparent !important;
        border: 0 !important;
        left: -11px !important;
        top: 25px !important;
      }
    }
  }
  .expert-list {
    .expert-list-info {
      .data-table {
        height: 100%;
        .toolbar {
          display: none;
        }
        .table {
          border-left-width: 1px;
        }
        .el-table td, .el-table th {
          padding: 5px 0;
          .cell {
            font-size: 12px;
            text-align: center;
            color: #888;
            line-height: 14px
          }
        }
        .el-table th {
          .cell {
            color: #666;
          }
        }
      }
    }
  }
  .marker-info-window {
    .fields {
      .data-table {
        height: 100%;
        .toolbar {
          display: none;
        }
        .table {
          border-left-width: 1px;
        }
        .el-table td, .el-table th {
          padding: 5px 0;
          .cell {
            font-size: 12px;
            text-align: center;
            color: #888;
            line-height: 14px
          }
        }
        .el-table th {
          .cell {
            color: #666;
          }
        }
      }
    }
  }
</style>

