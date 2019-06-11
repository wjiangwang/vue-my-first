<template>
  <div class="planar-graph-editor">
    <div class="sketch-wrapper">
      <risk-sketch
        :markups="markups"
        :image-url="planarGraph.url"
        :readonly="readonly"
        @remove-markup="handleMarkupRemove"
        @change-markup="handleMarkupChange"
        @select-markup="$emit('select-markup', $event.riskAssessmentId)"
        @upload="triggerUpload"
        class="graph-sketch"
        v-if="!loading"
      >
        <template slot="actions" v-if="!readonly">
          <el-upload
            class="planar-image-upload"
            :action="uploadURL"
            :data="{ filedir: 'map-images' }"
            :before-upload="handleImageBeforeUpload"
            :on-success="handleImageUploadSuccess"
          >
            <a href="javascript:;" class="upload-button" slot="trigger" ref="uploadButton">
              <img src="@/assets/icons/add-planar-image.png">
            </a>
          </el-upload>
        </template>
      </risk-sketch>
    </div>

    <div :class="['risk-item-select', { collapsed: riskListCollapsed }]">
      <span class="collapse-button" @click.stop="riskListCollapsed = !riskListCollapsed">
        <img src="@/assets/icons/open.png" v-if="riskListCollapsed">
        <img src="@/assets/icons/close.png" v-else>
      </span>

      <div class="title">
        <el-button
          class="modelCheck"
          size="small"
          round
          @click="modelCheck"
          v-if="!isRedirect&&!isReadonly"
        >{{modelCheckText}}模式</el-button>风险单元
      </div>
      <scroll-view style="height: calc(100% - 48px);">
        <div class="list">
          <div
            :class="['item', { 'disabled': riskDisabled(risk), 'clickable': readonly, 'selected': risk.selected }]"
            v-for="risk in risks"
            :key="risk.riskAssessmentId"
            @click="selectRisk(risk)"
          >
            <span class="icon" @click="addMarkupToSketch(risk)" v-if="!readonly">
              <i class="el-icon-plus"></i>
            </span>
            <span class="name">{{risk.riskName}}</span>
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
import { getUploadURL } from '@/modules/utils'
import RiskSketch from '@/components/RiskSketch'
import ScrollView from '@/components/ScrollView'

export default {
  name: 'PlanarGraph',

  components: {
    RiskSketch,
    ScrollView
  },

  props: {
    isReadonly: {
      type: Boolean,
      default: false
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
    ...mapState('enterpriseRiskGraph', ['markups', 'risks', 'planarGraph']),

    uploadURL () {
      return getUploadURL()
    },

    modelCheckText () {
      return this.readonly === true ? '编辑' : '查看'
    }
  },

  methods: {
    ...mapMutations('enterpriseRiskGraph', ['setEnterpriseId', 'addMarkup', 'selectRisk']),
    ...mapActions('enterpriseRiskGraph', [
      'loadData', 'savePlanarGraph', 'createMarkup', 'updateMarkup', 'deleteMarkup'
    ]),

    riskDisabled (risk) {
      return this.markups.findIndex(m => m.riskAssessmentId === risk.id) !== -1
    },

    addMarkupToSketch (risk) {
      if (this.riskDisabled(risk)) return

      if (!this.planarGraph || !this.planarGraph.id) {
        return this.$alert('未设置平面图，请先上传平面图', '提示')
      }

      this.createMarkup({
        riskAssessmentId: risk.id,
        riskLevel: risk.riskLevel,
        width: 15,
        height: 13,
        left: 40,
        top: 40
      })
    },

    handleMarkupRemove (id) {
      this.deleteMarkup(id)
    },

    handleMarkupChange (id, data) {
      this.updateMarkup({ id, data })
    },

    handleImageBeforeUpload () {
      this.uploadLoading = Loading.service({
        target: this.$el,
        text: '正在上传...'
      })

      return true
    },

    async handleImageUploadSuccess (response) {
      await this.savePlanarGraph({ url: response.data })

      this.uploadLoading && this.uploadLoading.close()
    },

    triggerUpload () {
      this.$refs.uploadButton.click()
    },

    modelCheck () {
      this.readonly = !this.readonly
    }
  },

  async created () {
    if (this.setEnterpriseId && this.enterpriseId)
      this.setEnterpriseId(this.enterpriseId)
    await this.loadData()
    this.readonly=true
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
          background: #fa5878;
        }

        &.level-2 {
          background: #fea340;
        }

        &.level-3 {
          background: #f4d341;
        }

        &.level-4 {
          background: #37a9fa;
        }
      }
    }
  }
}
</style>
