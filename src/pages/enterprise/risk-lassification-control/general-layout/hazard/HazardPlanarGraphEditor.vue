<template>
  <div class="planar-graph-editor">
    <div class="sketch-wrapper">
      <risk-sketch
        :markups="markups"
        :image-url="planarGraph.url"
        :readonly="readonly"
        @select-markup="$emit('select-markup', $event.riskAssessmentId)"
        class="graph-sketch"
        v-if="!loading"
      >
      </risk-sketch>
    </div>

    <div :class="['risk-item-select', { collapsed: riskListCollapsed }]">
      <span class="collapse-button" @click.stop="riskListCollapsed = !riskListCollapsed">
        <img src="@/assets/icons/open.png" v-if="riskListCollapsed">
        <img src="@/assets/icons/close.png" v-else>
      </span>

      <div class="title">
        重大危险源
      </div>
      <scroll-view style="height: calc(100% - 48px);">
        <div class="list">
          <div
            :class="['item', { 'disabled': riskDisabled(risk), 'clickable': readonly, 'selected': risk.selected }]"
            v-for="risk in risks"
            :key="risk.riskAssessmentId"
          >
            <span class="name" style="color: #666;">{{risk.riskName}}</span>
            <span :class="['level', `level-${risk.riskLevel}`]">{{risk.riskLevel}}</span>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import RiskSketch from './HazardRiskSketch'
import ScrollView from '@/components/ScrollView'

export default {
  name: 'HazardPlanarGraph',

  components: {
    RiskSketch,
    ScrollView
  },

  props: {
    isReadonly: {
      type: Boolean,
      default: true
    },

    isRedirect: {
      type: Boolean,
      default: false
    },

    enterpriseId: ''
  },

  data () {
    return {
      readonly: this.isReadonly,
      loading: true,
      riskListCollapsed: false
    }
  },

  computed: {
    ...mapState('majorHazardGraph', ['markups', 'risks', 'planarGraph']),
  },

  methods: {
    ...mapMutations('majorHazardGraph', ['selectRisk']),
    ...mapActions('majorHazardGraph', ['loadData']),

    riskDisabled (risk) {
      return this.markups.findIndex(m => m.riskAssessmentId === risk.id) !== -1
    }
  },

  async created () {
    await this.loadData()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
  .planar-graph-editor {
    display: flex;
    height: 100%;
  }

  .sketch-wrapper {
    flex: 1;
  }

  .graph-sketch {
    .planar-image-upload {
      .upload-button {
        display: block;
        width: 36px;
        height: 36px;
        margin-bottom: 8px;

        img {
          width: 100%;
          height: auto;
        }
      }

      /deep/ .el-upload-list {
        display: none;
      }
    }
  }

  .risk-item-select {
    position: relative;
    flex-shrink: 0;
    width: 333px;
    border-left: 1px solid #f2f2f2;
    box-shadow: -1px 0px 3px 0px rgba(4, 26, 55, 0.08);
    background: #fff;
    height: 100%;
    transition: width 0.2s;

    &.collapsed {
      width: 0;

      .title,
      .list {
        display: none;
      }
    }

    .collapse-button {
      position: absolute;
      top: 15px;
      left: -25px;
      width: 25px;
      height: 24px;
      cursor: pointer;

      img {
        width: 100%;
        height: auto;
      }
    }

    .title {
      border-bottom: 1px solid #f2f2f2;
      font-size: 14px;
      line-height: 19px;
      padding: 16px 0 12px;
      color: #333333;
      text-align: center;
      position: relative;
      .modelCheck {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .list {
      .item {
        display: flex;
        align-items: center;
        color: #666;
        padding: 10px 15px 10px 11px;
        font-size: 13px;

        &.disabled {
          color: #cccccc;

          .icon {
            border-color: #cccccc;
            cursor: not-allowed;
          }
        }

        &.clickable {
          cursor: pointer;

          &:hover,
          &.selected {
            background: #f0f0f0;
          }

          &.selected {
            color: #37a9fa;
          }
        }

        .icon {
          width: 17px;
          height: 17px;
          border: 1px solid #666;
          border-radius: 2px;
          margin-right: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .name {
          flex: 1;
        }

        .level {
          color: #fff;
          border-radius: 2px;
          background: #37a9fa;
          width: 45px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;

          &.level-1 {
            background: linear-gradient(#FF9393, #F7060D);
          }

          &.level-2 {
            background: linear-gradient(#F66100, #FFB073);
          }

          &.level-3 {
            background: linear-gradient(#F6B600, #FFE38D);
          }

          &.level-4 {
            background: linear-gradient(#62BA3F, #B4EC51);
          }
        }
      }
    }
  }
</style>
