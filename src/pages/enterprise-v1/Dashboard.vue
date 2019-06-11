<template>
  <div class="page">
    <breadcrumb :items="[{ name: '首页' }]">
      <div class="settings">
        <el-button type="text" class="button-image-icon"
          size="medium" title="轮播设置" @click="showCarouselSetting">
          <img src="@/assets/icons/carousel-setting.png" class="icon">
        </el-button>

        <el-button type="text" class="button-image-icon"
          size="medium" title="投屏" @click="dropScreen">
          <img src="@/assets/icons/screen.png" class="icon">
        </el-button>
      </div>
    </breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <dashboard-carousel />
    </page-card>

    <carousel-setting ref="carouselSetting"></carousel-setting>
    <screen-drop ref="screenDrop"></screen-drop>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import CarouselSetting from './dashboard/CarouselSetting'
import ScreenDrop from './dashboard/ScreenDrop'
import DashboardCarousel from './DashboardCarousel'

export default {
  name: 'Dashboard',

  components: {
    Breadcrumb,
    PageCard,
    CarouselSetting,
    ScreenDrop,
    DashboardCarousel
  },

  methods: {
    showCarouselSetting() {
      this.$refs.carouselSetting.show()
    },

    dropScreen() {
      this.$refs.screenDrop.show()
      if (screenfull.enabled && !screenfull.isFullscreen) screenfull.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 2;

  .button-image-icon.el-button--medium span {
    img.icon {
      width: 20px !important;
    }
  }
}
</style>

