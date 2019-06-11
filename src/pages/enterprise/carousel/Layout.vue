<template>
  <div class="page">
    <breadcrumb :items="[{ name: '轮播展示' }]">
      <div class="settings">
        <el-button type="text" class="button-image-icon"
          size="medium" title="退出" @click="logout" v-if='isCarousel'>
          <img src="@/assets/icons/logout.png" class="icon">
        </el-button>
        <el-button type="text" class="button-image-icon"
          size="medium" title="轮播设置" @click="showCarouselSetting" v-else>
          <img src="@/assets/icons/carousel-setting.png" class="icon">
        </el-button>

        <el-button type="text" class="button-image-icon"
          size="medium" title="投屏" @click="dropScreen">
          <img src="@/assets/icons/screen.png" class="icon">
        </el-button>
      </div>
    </breadcrumb>

    <page-card class="page-main" :scrollable="false">
      <carousel />
    </page-card>

    <setting ref="carouselSetting"></setting>
    <screen-drop ref="screenDrop"></screen-drop>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import Setting from './Setting'
import ScreenDrop from './ScreenDrop'
import Carousel from './Carousel'
import storage from '@/modules/storage'
import { clearSession } from '@/modules/authentication'

export default {
  name: 'CarouselLayout',

  components: {
    Breadcrumb,
    PageCard,
    Setting,
    ScreenDrop,
    Carousel
  },

  data(){
    return{
      isCarousel:false
    }
  },

  methods: {
    showCarouselSetting() {
      this.$refs.carouselSetting.show()
    },

    dropScreen() {
      this.$refs.screenDrop.show()
      if (screenfull.enabled && !screenfull.isFullscreen) screenfull.toggle()
    },

    logout() {
      clearSession()
      this.$router.replace({ name: 'signin' })
    },
  },

  created(){
      this.isCarousel = storage.get('isCarousel') ? storage.get('isCarousel') : false
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
