<template>
  <el-dialog :visible.sync="visible"
    title="投屏参数设置"
    width="600px"
    :modal="true"
    class="screen-drop-dialog">

    <div class="device">
      <div class="label">设备类型：</div>
      <div class="value">
        <el-radio-group v-model="device" size="small">
          <el-radio label="led" border>LED</el-radio>
          <el-radio label="tv" border>电视</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div slot="footer" class="form-buttons">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ScreenDrop',

  data() {
    return {
      visible: false,
      device: 'led'
    }
  },

  methods: {
    show() {
      this.visible = true
    },

    submit() {
      this.$router.push({
        name: 'dashboard-screen-drop',
        query: { device: this.device }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.screen-drop-dialog {
  .ratio, .device {
    display: flex;
    align-items: center;

    .label {
      font-size: 14px;
      color: #666666;
      line-height: 19px;
      margin-right: 12px;
    }

    &:first-child {
      margin-bottom: 20px;
    }
  }
}
</style>
