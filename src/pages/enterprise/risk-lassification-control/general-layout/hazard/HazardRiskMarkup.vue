<template>
  <div
    class="risk-markup"
    :id="'riskAssessment' + id"
    :style="style"
    :class="{
      draggable: draggable,
      resizable: resizable,
      active: enabled,
      dragging: dragging,
      resizing: resizing,
      rotating: rotating,
      highlight: selected,
      [`level-${level}`]: true
    }">

    <div class="hazard-img" :style="imgDivStyle" v-if="declareLevel">
      <img src="@/assets/icons/hazard-1.png" :style="imgStyle" v-if="declareLevel === 1">
      <img src="@/assets/icons/hazard-2.png" :style="imgStyle" v-if="declareLevel === 2">
      <img src="@/assets/icons/hazard-3.png" :style="imgStyle" v-if="declareLevel === 3">
      <img src="@/assets/icons/hazard-4.png" :style="imgStyle" v-if="declareLevel === 4">
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import { matchesSelectorToParentElements } from '@/modules/utils'

  export default {
    replace: true,
    name: 'HazardRiskMarkup',

    props: {
      readonly: {
        type: Boolean, default: false
      },
      selected: {
        type: Boolean, default: false
      },

      id: Number,
      riskAssessmentId: Number,
      level: Number,
      declareLevel: Number,

      active: {
        type: Boolean, default: false
      },

      draggable: {
        type: Boolean, default: true
      },
      resizable: {
        type: Boolean, default: true
      },
      rotateable: {
        type: Boolean, default: true
      },

      w: {
        type: Number,
        default: 200,
        validator(val) { return val > 0 }
      },
      h: {
        type: Number,
        default: 200,
        validator(val) { return val > 0 }
      },

      minw: {
        type: Number,
        default: 33,
        validator(val) { return val >= 0 }
      },
      minh: {
        type: Number,
        default: 30,
        validator(val) { return val >= 0 }
      },

      angle: {
        type: Number,
        default: 0,
        validator(val) { return typeof val === 'number' }
      },

      x: {
        type: Number,
        default: 0,
        validator(val) { return typeof val === 'number' }
      },
      y: {
        type: Number,
        default: 0,
        validator(val) { return typeof val === 'number' }
      },
      z: {
        type: [ String, Number ],
        default: 'auto',
        validator(val) {
          return (typeof val === 'string') ? val === 'auto' : val >= 0
        }
      },

      dragHandle: {
        type: String,
        default: null
      },
      dragCancel: {
        type: String,
        default: null
      },

      axis: {
        type: String,
        default: 'both',
        validator(val) {
          return ['x', 'y', 'both'].indexOf(val) !== -1
        }
      },

      grid: {
        type: Array,
        default() { return [1, 1] }
      },

      maximize: {
        type: Boolean, default: false
      },

      graphWidth: {
        type: Number,
        default: 400,
      },

      graphHeight: {
        type: Number,
        default: 400,
      }
    },

    created() {
      this.parentX = 0
      this.parentW = 9999
      this.parentY = 0
      this.parentH = 9999

      this.lastMouseX = 0
      this.lastMouseY = 0

      this.mouseOffX = 0
      this.mouseOffY = 0

      this.elmX = 0
      this.elmY = 0

      this.elmW = 0
      this.elmH = 0
    },

    data() {
      return {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        topPercent: this.y,
        leftPercent: this.x,
        widthPercent: this.w,
        heightPercent: this.h,
        rotateAngle: this.angle,
        resizing: false,
        dragging: false,
        rotating: false,
        enabled: this.active,
        zIndex: this.z
      }
    },

    computed: {
      style() {
        return {
          top: this.dragging || this.resizing ? `${this.top}px` : `${this.topPercent}%`,
          left: this.dragging || this.resizing ? `${this.left}px` : `${this.leftPercent}%`,
          width: this.resizing ? `${this.width}px` : `${this.widthPercent}%`,
          height: this.resizing ? `${this.height}px` : `${this.heightPercent}%`,
          transform: 'rotate(' + this.rotateAngle + 'deg)',
          zIndex: this.zIndex
        }
      },

      imgDivStyle() {
        let width = this.graphWidth * this.widthPercent / 100
        let height = this.graphHeight * this.heightPercent / 100
        if (width >= height) {
          return {
            width: height >= 37 ? '44px' : 44 / 37 * height + 'px',
            height: `${height}px`,
            top: height >= 37 ? 'calc((100% - 37px) / 2)' : `calc((100% - ${height}px) / 2)`,
            left: height >= 37 ? 'calc((100% - 44px) / 2)' : `calc((100% - ${44 / 37 * height}px) / 2)`
          }
        } else {
          return {
            width: width >= 44 ? '44px' : width + 'px',
            height: height >= 37 ? '37px' : 37 / 44 * width + 'px',
            top: width >= 44 ? 'calc((100% - 37px) / 2)' : `calc((100% - ${37 / 44 * width}px) / 2)`,
            left: width >= 44 ? 'calc((100% - 44px) / 2)' : `calc((100% - ${width}px) / 2)`
          }
        }
      },

      imgStyle() {
        let width = this.graphWidth * this.widthPercent / 100
        let height = this.graphHeight * this.heightPercent / 100
        if (width >= height) {
          return {
            width: 'auto',
            height: height >= 37 ? '37px' : '100%',
            position: height >= 37 ? '' : 'absolute'
          }
        } else {
          return {
            width: width >= 44 ? '44px' : '100%',
            height: 'auto',
            position: width >= 44 ? '' : 'absolute'
          }
        }
      }
    },

    watch: {
      active(val) {
        this.enabled = val
      },

      z(val) {
        if (val >= 0 || val === 'auto') {
          this.zIndex = val
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .risk-markup {
    position: absolute;
    box-sizing: border-box;
    border-radius: 3px;

    &.level-1 {
      background: rgba(250,88,120,0.6);
      border: 2px solid rgba(250,88,120,1);
    }
    &.level-1.highlight {
      background: rgba(250,88,120,0.92);
    }

    &.level-2 {
      background: rgba(254,163,64,0.6);
      border: 2px solid rgba(254,163,64,1);
    }
    &.level-2.highlight {
      background: rgba(254,163,64,0.92);
    }

    &.level-3 {
      background: rgba(244,211,65,0.6);
      border: 2px solid rgba(244,211,65,1);
    }
    &.level-3.highlight {
      background: rgba(244,211,65,0.92);
    }

    &.level-4 {
      background: rgba(55,169,250,0.6);
      border: 2px solid rgba(55,169,250,1);
    }
    &.level-4.highlight {
      background: rgba(55,169,250,0.92);
    }
  }

  .handle {
    box-sizing: border-box;
    display: none;
    position: absolute;

    img {
      width: 26px;
      height: 26px;
    }
  }

  .handle-rotateable {
    top: -13px;
    right: -13px;
  }

  .handle-br {
    bottom: -13px;
    right: -13px;
    cursor: se-resize;
  }

  .handle-remove {
    top: -13px;
    left: -13px;
    cursor: pointer;
  }

  .hazard-img {
    box-sizing: border-box;
    position: absolute;
    max-width: 44px;
    max-height: 37px;
  }
</style>
