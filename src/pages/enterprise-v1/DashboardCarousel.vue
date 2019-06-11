<template>
  <div :class="classnames" v-loading="loading">
    <div class="mask"></div>
    <el-carousel arrow="never"
      :interval="15000"
      :height="carouselHeight"
      @change="handleCarouselChange"
      class="carousel">
      <el-carousel-item
        v-for="(item, index) in carouselItems"
        :key="index"
        class="dashboard-carousel-item">

        <template v-if="item.types !== 'IMAGES'">
          <div class="title">企业安全状态实时预览</div>
          <div class="subtitle">{{item.name}}</div>
        </template>

        <notice-board v-if="item.types === 'NOTICE'" />

        <progress-statistics
          v-if="item.types === 'PROGRESS' && currentCarouselIndex === index"
          ref="progressStatistics" />

        <risk-statistics
          v-if="item.types === 'DETAIL' && item.rows && currentCarouselIndex === index"
          :rows="item.rows"
          v-bind="riskStatisticsSummary"
          ref="riskStatistics" />

        <special-job-statistics
          v-if="item.types === 'SPECIAL' && currentCarouselIndex === index"
          :rows="item.rows"
          ref="specialJobStatistics" />

        <planar-graph v-if="item.types === 'SCATTERGRAM' && currentCarouselIndex === index" :is-carousel="true" id="planar-graph"></planar-graph>

        <div class="image-wrapper" v-if="item.types === 'IMAGES'" :style="`background: url(${item.url}) no-repeat center; background-size: 100% 100%;`">
          <!-- <img :src="item.url"> -->
        </div>

      </el-carousel-item>
    </el-carousel>

    <notice-marquee v-if="currentCarouselIndex > 0" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import screenfull from 'screenfull'
import { mapState, mapActions } from 'vuex'
import NoticeMarquee from './dashboard/NoticeMarquee'
import NoticeBoard from './dashboard/NoticeBoard'
import PlanarGraph from './dashboard/PlanarGraph'
import ProgressStatistics from './dashboard/ProgressStatistics'
import RiskStatistics from './dashboard/RiskStatistics'
import SpecialJobStatistics from './dashboard/SpecialJobStatistics'

export default {
  name: 'DashboardCarousel',

  components: {
    NoticeMarquee,
    NoticeBoard,
    PlanarGraph,
    ProgressStatistics,
    RiskStatistics,
    SpecialJobStatistics
  },

  props: {
    device: String
  },

  data() {
    return {
      carouselHeight: '400px',
      loading: false,
      currentCarouselIndex: 0
    }
  },

  computed: {
    ...mapState('dashboardCarousel', { allCarouselItems: 'items' }),
    ...mapState('dashboardRiskStatistics', {
      riskStatisticsLoaded: 'loaded',
      riskStatisticsSummary: 'summary',
      riskStatisticsItems: 'items'
    }),
    ...mapState('dashboardSpecialJobStatistics', {
      specialJobStatisticsLoaded: 'loaded',
      specialJobStatisticsItems: 'items'
    }),

    classnames() {
      const classnames = ['dashboard-carousel']

      if (this.device) classnames.push('screen-drop')
      if (this.device === 'led') classnames.push('dark-mode')

      return classnames
    },

    showPlanarGraph() {
      return this.allCarouselItems
        .findIndex(item => item.isShow === 'Y' && item.types === 'SCATTERGRAM') !== -1
    },

    showRiskStatistics() {
      return this.allCarouselItems
        .findIndex(item => item.isShow === 'Y' && item.types === 'DETAIL') !== -1
    },

    showSpecialJobStatistics() {
      return this.allCarouselItems
        .findIndex(item => item.isShow === 'Y' && item.types === 'SPECIAL') !== -1
    },

    carouselItems() {
      const enabledItems = this.allCarouselItems.filter(item => item.isShow === 'Y')

      const riskStatisticsItemIndex = enabledItems.findIndex(item => item.types === 'DETAIL')
      const riskStatisticsItemsCount = enabledItems.filter(item => item.types === 'DETAIL').length
      if (riskStatisticsItemIndex !== -1 && this.riskStatisticsItems.length) {
        // const riskStatisticsPageCount = parseInt(
        //   (this.riskStatisticsItems.length / 4).toFixed(0), 10
        // )

        let riskStatisticsPageCount = 0

        if ((this.riskStatisticsItems.length / 4) > parseInt(this.riskStatisticsItems.length / 4)) {
          riskStatisticsPageCount = parseInt(this.riskStatisticsItems.length / 4) + 1
        } else {
          riskStatisticsPageCount = parseInt(this.riskStatisticsItems.length / 4)
        }

        const riskStatisticsItems = []
        for (let index = 0; index < riskStatisticsPageCount; index++) {
          const items = this.riskStatisticsItems.slice(index * 4, index * 4 + 4)

          riskStatisticsItems.push({
            types: 'DETAIL',
            name: enabledItems[riskStatisticsItemIndex].name,
            rows: [items.slice(0, 2), items.slice(2)]
          })
        }

        enabledItems.splice(
          riskStatisticsItemIndex,
          riskStatisticsItemsCount,
          ...riskStatisticsItems
        )
      }

      const specialStatisticsItemIndex = enabledItems.findIndex(item => item.types === 'SPECIAL')
      const specialStatisticsItemsCount = enabledItems.filter(item => item.types === 'SPECIAL').length
      if (specialStatisticsItemIndex !== -1 && this.specialJobStatisticsItems.length) {
        // const specialStatisticsPageCount = parseInt(
        //   (this.specialJobStatisticsItems.length / 4).toFixed(0), 10
        // )

        let specialStatisticsPageCount = 0

        if ((this.specialJobStatisticsItems.length / 4) > parseInt(this.specialJobStatisticsItems.length / 4)) {
          specialStatisticsPageCount = parseInt(this.specialJobStatisticsItems.length / 4) + 1
        } else {
          specialStatisticsPageCount = parseInt(this.specialJobStatisticsItems.length / 4)
        }

        const specialStatisticsItems = []
        for (let index = 0; index < specialStatisticsPageCount; index++) {
          const items = this.specialJobStatisticsItems.slice(index * 4, index * 4 + 4)

          specialStatisticsItems.push({
            types: 'SPECIAL',
            name: enabledItems[specialStatisticsItemIndex].name,
            rows: [items.slice(0, 2), items.slice(2)]
          })
        }

        enabledItems.splice(
          specialStatisticsItemIndex,
          specialStatisticsItemsCount,
          ...specialStatisticsItems
        )
      }

      return enabledItems
    }
  },

  methods: {
    ...mapActions('dashboardCarousel', { loadCarouselItems: 'loadItems' }),
    ...mapActions('dashboardNotice', { loadNotice: 'load' }),
    ...mapActions('enterpriseRiskGraph', { loadPlanarGraphData: 'loadData' }),
    ...mapActions('dashboardRiskStatistics', { loadRiskStatistics: 'loadData' }),
    ...mapActions('dashboardSpecialJobStatistics', { loadSpecialJobStatistics: 'loadData' }),

    showCarouselSetting() {
      this.$refs.carouselSetting.show()
    },

    dropScreen() {
      this.$refs.screenDrop.show()
      if (screenfull.enabled && !screenfull.isFullscreen) screenfull.toggle()
    },

    refreshCarouselHeight() {
      const { width, top } = document.querySelector('.carousel').getBoundingClientRect()
      this.carouselHeight = `${document.documentElement.clientHeight - top}px`

      if (this.device) {
        this.$el.style.fontSize = `${(width / 1280) * 16}px`
      }
    },

    async handleCarouselChange(index) {
      this.currentCarouselIndex = index
      if (index === 0) this.loadNotice()
    },

    exitFullscreen() {
      if (!screenfull.isFullscreen)
        this.$router.replace({ name: 'dashboard' })
    }
  },

  async created() {
    this.loading = true
    await this.loadCarouselItems()

    const tasks = [this.loadNotice()]

    if (this.showRiskStatistics) tasks.push(this.loadRiskStatistics())
    if (this.showSpecialJobStatistics) tasks.push(this.loadSpecialJobStatistics())
    if (this.showPlanarGraph) tasks.push(this.loadPlanarGraphData())

    await Promise.all(tasks)
    this.loading = false
  },

  mounted() {
    this.refreshCarouselHeight()

    this._refreshCarouselHeight = debounce(this.refreshCarouselHeight.bind(this), 300)
    window.addEventListener('resize', this._refreshCarouselHeight)

    if (screenfull.enabled) {
      this._exitFullscreen = this.exitFullscreen.bind(this)
      screenfull.on('change', this._exitFullscreen)
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this._refreshCarouselHeight)
    if (screenfull.enabled) screenfull.off('change', this._exitFullscreen)
  }
}
</script>
<style lang="scss" scoped>
.dashboard-carousel {
  position: relative;
  overflow: hidden;
  height: 100%;
  /deep/ .el-carousel {
    height: 100%;

    .el-carousel__button {
      background-color: #C8CBD5;
    }

    .el-carousel__indicators {
      z-index: 3;
    }
  }

  .notice-marquee {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .image-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-height: 100%;
      width: auto;
      max-width: 100%;
    }
  }

  .dashboard-carousel-item {
    display: flex;
    flex-direction: column;

    > .title, .subtitle {
      text-align: center;
    }

    > .title {
      font-size: 18px;
      font-weight: 600;
      color: #4C4C4C;
      line-height: 25px;
      margin-top: 28px;
      margin-bottom: 12px;
    }

    > .subtitle {
      font-size: 13px;
      color: #999;
      line-height: 18px;
    }

    .dashboard-carousel-item-content {
      flex: 1;
      padding: 20px 28px;
      margin-top: 16px;
      margin-bottom: 60px;
      box-sizing: content-box;
      position: relative;
      height: 100px;
    }
  }
}

.dashboard-carousel.screen-drop {
  font-size: 16px;

  .mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3;
  }

  .dashboard-carousel-item {
    .title {
      font-size: 2.5em;
      line-height: 1.4;
    }

    .subtitle {
      font-size: 1.75em;
      line-height: 1.18;
    }
  }

  &.dark-mode {
    background: #000000;
    color: #fff;

    .dashboard-carousel-item {
      .title, .subtitle {
        color: #fff;
        text-shadow: 0px 2px 6px rgba(0,0,0,0.24);
        background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.63) 100%);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }
    }
  }
}
</style>
