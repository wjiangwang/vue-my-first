<template>
  <div>
    <el-dialog :visible.sync="visible"
      title="风险管控详情"
      width="820px"
      :modal="true">
      <div class="basic">
        <div class="title">基本信息</div>
        <div class="content">
          <div class="field-value">
            <span class="label">风险名称：</span>
            <span class="value">{{record.name}}</span>
          </div>
          <div class="field-value">
            <span class="label">风险状态：</span>
            <span class="value">{{statusText}}</span>
          </div>
          <div :class="['field-value level-field-value', `level-${'1'}`]">
            <span class="label">风险级别：</span>
            <span class="value">{{record.riskLevel | riskLevel}}</span>
          </div>
          <div class="field-value">
            <span class="label">管控日期：</span>
            <span class="value">{{record.inspectionTime | strftime}}</span>
          </div>
          <div class="field-value">
            <span class="label">复核时间：</span>
            <span class="value">{{record.reviewDate | strftime}}</span>
          </div>
          <div class="field-value">
            <span class="label">风险分类：</span>
            <span class="value">{{record.identifyRiskType}}</span>
          </div>
          <div class="field-value">
            <span class="label">管控人：</span>
            <span class="value">{{record.inspectionName}}</span>
          </div>
          <div class="field-value">
            <span class="label">复核人：</span>
            <span class="value">{{record.reviewName}}</span>
          </div>
          <div class="field-value">
            <span class="label">风险地点：</span>
            <span class="value">{{record.location}}</span>
          </div>
        </div>
      </div>

      <div v-for="(item, index) in record.riskManagementStandingBookList"
        :key="index">
        <div class="control-record" v-if="item.controlOrReview === 1">
          <div class="title">管控记录</div>
          <div class="content">
            <div class="field-value">
              <span class="label">地点：</span>
              <span class="value">{{item.location}}</span>
            </div>
            <div class="field-value">
              <span class="label">时间：</span>
              <span class="value">{{item.createDate | strftime}}</span>
            </div>
            <div class="field-value">
              <span class="label">记录：</span>
              <span class="value">
                {{item.controlMsg}}
              </span>
            </div>
            <div class="field-value photos" v-if="item.url">
              <span class="label">照片：</span>
              <span class="value">
                <img v-for="(imageUrl, index) in item.url.split(',')"
                  :key="index"
                  :src="imageUrl"
                  @click="preview(imageUrl)">
              </span>
            </div>
          </div>
        </div>

        <div class="review-record"  v-if="item.controlOrReview === 2">
          <div class="title">复核流程</div>
          <div class="content">
            <div class="field-value">
              <span class="label">{{item.controlLevelName}}：</span>
              <span class="value">{{item.nickname}}</span>
            </div>
            <div class="field-value">
              <span class="label">时间：</span>
              <span class="value">{{item.createDate | strftime}}</span>
            </div>
            <div class="field-value">
              <span class="label">结果：</span>
              <span class="value">{{item.status === 1 ? '成功' : '驳回'}}</span>
            </div>
            <div class="field-value photos" v-if="item.url">
              <span class="label">照片：</span>
              <span class="value">
                <img v-for="(imageUrl, index) in item.url.split(',')"
                  :key="index"
                  :src="imageUrl"
                  @click="preview(imageUrl)">
              </span>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="form-buttons">
        <el-button type="primary" @click="visible=false" size="medium">关闭</el-button>
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
  name: 'RiskControlDetail',

  data() {
    return {
      visible: false,
      loading: false,

      photoURL: null,
      photoDialogVisible: false,

      record: {
        riskManagementStandingBookList: []
      }
    }
  },
  
  computed: {
    statusText() {
      switch (this.record.status) {
      case 0:
        return '待管控'
      case 1:
        return '待复核'
      case 2:
        return '已驳回'
      case 3:
        return '已完成'
      case 4:
        return '隐患流程'
      }
    }
  },

  methods: {
    ...mapActions('riskControl', ['loadData']),

    async show(id) {
      this.visible = true
      this.loading = true
      
      this.record = await this.loadData(id)
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
.title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 19px;
  margin-bottom: 12px;
}

.content {
  border: 1px solid #E4F1FD;

  .field-value {
    font-size: 13px;

    .label {
      color: #666;
    }

    .value {
      color: #333;
    }
  }
}

.basic {
  margin: -14px 0 15px;
  
  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .field-value {
    display: flex;
    width: 50%;
    border-right: 1px solid #E4F1FD;
    border-bottom: 1px solid #E4F1FD;
    line-height: 32px;
    box-sizing: border-box;

    &:nth-child(2n) {
      border-right: 0;
    }
    &:nth-last-child(-n+1) {
      border-bottom: 0;
      width: 100%;
    }

    .label {
      width: 140px;
      text-align: right;
      background: #F9FDFF;
      border-right: 1px solid #E4F1FD;
      padding: 0 12px;
      display: block;
    }

    .value {
      padding: 0 12px;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .level-field-value {
    &.level-4 .value {
      color: #37A9FA;
    }

    &.level-3 .value {
      color: #F4D341;
    }

    &.level-2 .value {
      color: #FEA340;
    }

    &.level-1 .value {
      color: #FA5878;
    }
  }
}

.control-record, .review-record {
  margin-top: 15px;

  .content {
    padding: 15px;
    font-size: 13px;

    .field-value {
      line-height: 18px;
      margin-bottom: 10px; 
      .label {
        width: 60px;
        text-align: right;
      }
    }

    .field-value.photos {
      .value img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        border-radius: 3px;
        vertical-align: top;
        cursor: pointer;
      }
    }
  }
}
</style>

