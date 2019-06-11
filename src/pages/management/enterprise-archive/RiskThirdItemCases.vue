<template>
  <div>
    <el-dialog :visible.sync="visible"
      title="示例图片"
      width="600px"
      :modal="true"
      ref="dialog"
      v-loading="loading">
      <div class="list" v-if="items.length > 0">
        <div class="item" v-for="item in items" :key="item.id">
          <div class="field-value">
            <div class="label">三级编码：</div>
            <div class="value">{{item.threeCoding}}</div>
          </div>
          <div class="field-value">
            <div class="label">三级子项：</div>
            <div class="value">{{item.name}}</div>
          </div>
          <div class="field-value photos">
            <div class="label">图片：</div>
            <div class="value">
              <img v-for="(imageUrl, index) in item.caseUrl.split(',')"
                :key="index"
                :src="imageUrl"
                v-if="item.caseUrl"
                @click="preview(imageUrl)">
              <span style="color: #999;" v-else>未设置</span>
            </div>
          </div>
        </div>
      </div>

      <div class="no-data" v-else>
        <img src="@/assets/icons/empty.png">
        <div class="message">暂时没有数据</div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="photoDialogVisible"
      :append-to-body="true"
      custom-class="photo-preview-dialog">
      <img width="100%" :src="photoURL">
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RiskThirdItemCases',

  data() {
    return {
      visible: false,
      loading: false,
      items: [],

      photoURL: null,
      photoDialogVisible: false,
    }
  },

  methods: {
    ...mapActions('regionalRisk', ['loadThirdItemCases']),

    async show(id) {
      this.visible = true
      this.loading = true

      this.items = await this.loadThirdItemCases(id)
      this.loading = false
    },

    preview(photoURL) {
      this.photoURL = photoURL
      this.photoDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.list .item {
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
  &:last-child {
    border-bottom: 0;
  }

  .field-value {
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 15px;
    display: flex;

    .label {
      color: #666;
      width: 80px;
      text-align: right;
    }

    .value {
      color: #333;
    }

    &.photos .value img {
      width: 70px;
      height: 70px;
      margin-right: 10px;
      border-radius: 3px;
      vertical-align: top;
      cursor: pointer;
    }
  }
}

.no-data {
  text-align: center;

  img {
    width: 94px;
    height: 93px;
  }

  .message {
    font-size: 13px;
    color: #bbb;
    line-height: 17px;
    margin: 20px 0;
  }
}
</style>
