<template>
  <div class="page">
    <div class="search-container">
      <div class="columns">
        <div class="left">
          <el-form :inline="true" :model="searchForm" label-suffix=":">
            <el-form-item>
              <string-input
                placeholder="资源关键词"
                name="keywords"
                @input="searchForm.keywords = $event"
              ></string-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="medium" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <span style="color: #909DAA; font-size: 14px;">多个关键词用中文逗号“，”隔开; 最多10个</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="map-main-container">
      <div class="map-container">
        <div class="map-wrapper">
          <baidu-map :ak="appKey"
            class="map-view"
            :center="circlePath.center"
            :scroll-wheel-zoom="true"
            :zoom="15" @ready="handleData">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <bm-marker :position="{ lng: circlePath.center.lng, lat: circlePath.center.lat }"
              v-if="circlePath.center.lng && circlePath.center.lat">
            </bm-marker>
            <bm-local-search
              :keyword="mapKeyword"
              :auto-viewport="true"
              :nearby="circlePath"
              :pageCapacity="100">
            </bm-local-search>
            <bm-circle :center="circlePath.center" :radius="circlePath.radius" stroke-color="'#be77ff'" :stroke-opacity="0.1" :stroke-weight="1" :fillColor="'#be77ff'"></bm-circle>
          </baidu-map>
        </div>
      </div>
      <div class="data-container">
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .map-main-container {
    .map-container {
      .map-wrapper {
        .map-view {
          position: relative;
          >:last-child{
            position: absolute;
            top: -1px;
            width: 320px;
            right: -346px;
            height: 100%;
            >div {
              height: 100%;
              >:nth-child(1) {
                height: calc(100% - 28px);
                overflow: hidden;
                overflow-y: auto;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .search-container {
    padding: 0 20px 14px;

    .columns {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        flex: 1;
      }

      .right {
        text-align: right;
        flex-shrink: 0;
      }

      /deep/ .el-form--inline .el-form-item {
        margin-bottom: 0;
        .el-input__inner {
          height: 30px;
          line-height: 30px;
          width: 300px;
        }
        .el-button--medium {
          padding: 7px 20px;
        }
      }
    }
  }
  .map-main-container {
    height: calc(100% - 114px);
    padding: 0 5px 0 20px;
    display: flex;
    justify-content: space-between;
    > div {
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #ccc;
    }
    .map-container {
      width: calc(100% - 345px);
      .map-wrapper {
        height: 100%;
        .map-view {
          width: 100%;
          height: 100%;
        }
      }
    }
    .data-container {
      width: 320px;
    }
  }
</style>
<script>
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import { BmLocalSearch, BmMarker, BmNavigation, BmCircle } from 'vue-baidu-map'
  // import { getSession } from '@/modules/authentication'

  export default {
    name: 'RescueNearby',

    components: {
      BaiduMap,
      BmLocalSearch,
      BmMarker,
      BmNavigation,
      BmCircle
    },

    props: {
    },

    data () {
      return {
        mapKeyword: [],
        searchForm: {
          keywords: null
        },
        map: {
          keyword: null,
          longitude: null,
          latitude: null
        },
        circlePath: {
          center: {
            lng: '',
            lat: ''
          },
          radius: 1000
        },
        dataList: [],
      }
    },



    computed: {
      appKey() {
      return process.env.BAIDU_MAP_APP_KEY
      }
    },

    methods: {
      handleData () {
        // const { user } = getSession()
        this.circlePath.center = {
          lng: '103.818865',
          lat: '30.676474'
        }
      },

      search () {
        if (this.searchForm.keywords) {
          this.mapKeyword = this.searchForm.keywords.split('，')
        } else {
          this.mapKeyword = []
        }
      },

      handleMapList (result) {
        this.dataList = result
      },

      handleShow (url) {
        window.open(url)
      }
    },

    created() {
    }
  }
</script>
