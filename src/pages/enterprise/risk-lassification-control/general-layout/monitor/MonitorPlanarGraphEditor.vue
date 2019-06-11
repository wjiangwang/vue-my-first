<template>
  <div class="planar-graph-editor">
    <div class="sketch-wrapper">
      <risk-sketch
        :markups="markups"
        :monitor-markups="monitorEquipmentsMarkups"
        :image-url="planarGraph.url"
        :readonly="readonly"
        @remove-markup="handleMarkupRemove"
        @change-markup="handleMarkupChange"
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
        <ul class="title-menu">
          <li
            v-for="item in titleMenus"
            :key="item.id"
            :class="item.id === activeMenu ? 'active' : ''"
            @click="handleMenuSelect(item.id)"
          >{{item.name}}</li>
        </ul>
        <el-button
          class="modelCheck"
          size="small"
          round
          @click="modelCheck"
          v-if="!isRedirect"
        >{{modelCheckText}}模式</el-button>
      </div>
      <scroll-view style="height: calc(100% - 48px);">
        <div class="list">
          <div
            :class="['item', { 'disabled': equipmentDisabled(equipment), 'clickable': readonly, 'selected': equipment.selected }]"
            v-for="(equipment, index) in monitorEquipments"
            :key="equipment.id.toString() + index"
            @click="selectEquipment(equipment)"
          >
            <span class="icon" @click="addMarkupToSketch(equipment)" v-if="!readonly">
              <i class="el-icon-plus"></i>
            </span>
            <span class="name">{{equipmentText(equipment)}}</span>
            <span v-if="equipment.status === 1" class="status-span">异常</span>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import RiskSketch from './MonitorRiskSketch'
  import ScrollView from '@/components/ScrollView'

  export default {
    name: 'MonitorPlanarGraphEditor',

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
        riskListCollapsed: false,
        titleMenus: [
          { id: '', name: '全部' },
          { id: 1, name: '摄像机' },
          { id: 2, name: '温度计' },
          { id: 3, name: '电流/电压表' }
        ],
        activeMenu: ''
      }
    },

    computed: {
      ...mapState('monitorGraph', ['monitorEquipmentsMarkups', 'monitorEquipments', 'markups', 'planarGraph']),
      // ...mapState('enterpriseRiskGraph', ['markups', 'planarGraph']),

      modelCheckText () {
        return this.readonly === true ? '编辑' : '查看'
      }
    },

    methods: {
      ...mapMutations('monitorGraph', [, 'addMarkup', 'selectEquipment']),
      ...mapActions('monitorGraph', [
        'loadData', 'savePlanarGraph', 'createEquipmentMarkup', 'updateEquipmentMarkup', 'deleteEquipmentMarkup'
      ]),
      // ...mapActions('enterpriseRiskGraph', { RiskLoadData: 'loadData'}),

      equipmentDisabled (risk) {
        if (risk.equipmentType !== 1) {
          return this.monitorEquipmentsMarkups.findIndex(m => m.riskId === risk.riskId && m.equipmentType === risk.equipmentType) !== -1
        } else {
          return this.monitorEquipmentsMarkups.findIndex(m => m.equipmentId === risk.id) !== -1
        }
      },

      equipmentText (equipment) {
        return equipment.riskName + '-' + equipment.name + '-' + equipment.equipmentNumber
      },

      addMarkupToSketch (equipment) {
        if (this.equipmentDisabled(equipment)) return

        if (!this.planarGraph || !this.planarGraph.id) {
          return this.$alert('未设置平面图，请先上传平面图', '提示')
        }

        this.createEquipmentMarkup({
          mapId: this.planarGraph.id,
          riskId: equipment.riskId,
          equipmentId: equipment.id,
          equipmentType: equipment.equipmentType,
          width: 10,
          height: 15,
          left: 40,
          top: 40
        })
      },

      handleMarkupRemove (id) {
        this.deleteEquipmentMarkup(id)
      },

      handleMarkupChange (id, data) {
        this.updateEquipmentMarkup({ id, data })
      },

      modelCheck () {
        this.readonly = !this.readonly
      },

      async handleMenuSelect (id) {
        this.activeMenu = id
        await this.loadData(id)
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
    padding: 16px 0 0;
    color: #333333;
    text-align: center;
    position: relative;
    .title-menu {
      display: flex;
      list-style: none;
      padding: 0 10px;
      margin: 0;
      align-items: center;
      justify-content: space-between;
      width: calc(100% - 100px);

      li {
        padding-bottom: 10px;
        border-bottom: 2px solid transparent;
        color: rgb(144, 147, 153);
        transition: border-color 0.3s ease 0s, background-color 0.3s ease 0s,
          color 0.3s ease 0s;
        &:hover {
          cursor: pointer;
          color: rgb(48, 49, 51);
        }
      }
      .active {
        border-bottom: 2px solid rgb(64, 158, 255);
        color: rgb(48, 49, 51);
      }
    }
    .modelCheck {
      position: absolute;
      /*right: 100%;
      top: 100%;*/

      width: 80px;
      right: 0;
      top: 10px;
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

      .status-span {
        color: #fff;
        border-radius: 12px;
        background: #F7454A;
        width: 45px;
        height: 18px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
    }
  }
}
</style>
