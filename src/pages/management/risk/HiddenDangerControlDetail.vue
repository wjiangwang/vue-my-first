<template>
  <div>
    <el-dialog :visible.sync="visible"
      title="隐患管控详情"
      width="820px"
      :modal="true">
      <div class="basic">
        <div class="title">基本信息</div>
        <div class="content">
          <div class="field-value">
            <span class="label">隐患名称：</span>
            <span class="value">{{record.basic.hiddenDangerName}}</span>
          </div>
          <div class="field-value">
            <span class="label">隐患状态：</span>
            <span class="value">{{statusText}}</span>
          </div>
          <div :class="['field-value level-field-value', `level-${'1'}`]">
            <span class="label">隐患级别：</span>
            <span class="value">{{levelText}}</span>
          </div>
          <div class="field-value">
            <span class="label">修改日期：</span>
            <span class="value">{{record.basic.modifyDate | strftime}}</span>
          </div>
          <div class="field-value">
            <span class="label">排查时间：</span>
            <span class="value">{{record.basic.troubleshootDate | strftime}}</span>
          </div>
          <div class="field-value">
            <span class="label">隐患分类：</span>
            <span class="value">{{record.basic.hiddenDangerType}}</span>
          </div>
          <div class="field-value">
            <span class="label">是否延期：</span>
            <span class="value">{{record.basic.isDelay === 1 ? '是' : '否'}}</span>
          </div>
          <div class="field-value">
            <span class="label">隐患来源：</span>
            <span class="value">{{record.basic.hiddenDangerSource}}</span>
          </div>
          <div class="field-value">
            <span class="label">记录人：</span>
            <span class="value">{{record.basic.recordPersonnel}}</span>
          </div>
          <div class="field-value">
            <span class="label">整改人：</span>
            <span class="value">{{record.basic.principalPersonnel}}</span>
          </div>
          <div class="field-value">
            <span class="label">隐患地点：</span>
            <span class="value">{{record.basic.hiddenDangerLocation}}</span>
          </div>
          <div class="field-value">
            <span class="label">落实整改资金（元）：</span>
            <span class="value">{{record.basic.workablePrice}}</span>
          </div>
          <div class="field-value">
            <span class="label">排查人员：</span>
            <span class="value">{{record.basic.principalPersonnel}}</span>
          </div>
          <div class="field-value">
            <span class="label">计划整改资金（元）：</span>
            <span class="value">{{record.basic.planPrice}}</span>
          </div>
        </div>
      </div>

      <div class="report-record">
        <div class="title">上报记录</div>
        <div class="content">
          <div class="field-value">
            <span class="label">地点：</span>
            <span class="value">{{record.report.location}}</span>
          </div>
          <div class="field-value">
            <span class="label">上报时间：</span>
            <span class="value">{{record.report.createDate | strftime}}</span>
          </div>
          <div class="field-value">
            <span class="label">记录：</span>
            <span class="value">{{record.report.remark}}</span>
          </div>
          <div class="field-value">
            <span class="label">信息：</span>
            <span class="value">{{record.report.controlMsg}}</span>
          </div>
          <div class="field-value photos" v-if="record.report.url">
            <span class="label">照片：</span>
            <span class="value">
              <img v-for="(imageUrl, index) in record.report.url.split(',')"
                :key="index"
                :src="imageUrl"
                @click="preview(imageUrl)">
            </span>
          </div>
        </div>
      </div>

      <div class="hidden-danger-confirm"
        v-if="record.confirmation && record.confirmation.isDanger === 1">
        <div class="title">确定隐患</div>
        <div class="content">
          <div class="field-value">
            <span class="label">{{record.confirmation.controlLevelName}}：</span>
            <span class="value">{{record.confirmation.nickname}}</span>
          </div>
          <div class="field-value">
            <span class="label">是否存在隐患：</span>
            <span class="value">{{record.confirmation.isDanger === 1 ? '是' : '否'}}</span>
          </div>
          <div class="field-value">
            <span class="label">确定时间：</span>
            <span class="value">{{record.confirmation.createDate | strftime}}</span>
          </div>
          <div class="field-value">
            <span class="label">整改人：</span>
            <span class="value">{{record.confirmation.rectificationPeople}}</span>
          </div>
          <div class="field-value">
            <span class="label">整改期限：</span>
            <span class="value">{{record.confirmation.rectificationDate | strftime}}</span>
          </div>
          <div class="field-value">
            <span class="label">整改资金：</span>
            <span class="value">{{record.confirmation.rectificationPrice}}</span>
          </div>
          <div class="field-value">
            <span class="label">整改措施：</span>
            <span class="value">{{record.confirmation.rectificationMeasures}}</span>
          </div>
        </div>
      </div>

      <div class="hidden-danger-confirm"
        v-if="record.confirmation && record.confirmation.isDanger === 0">
        <div class="title">确定无隐患</div>
        <div class="content">
          <div class="field-value">
            <span class="label">{{record.confirmation.controlLevelName}}：</span>
            <span class="value">{{record.confirmation.nickname}}</span>
          </div>
          <div class="field-value">
            <span class="label">描述：</span>
            <span class="value">
              {{record.confirmation.remark}}
            </span>
          </div>
          <div class="field-value photos" v-if="record.confirmation.url">
            <span class="label">照片：</span>
            <span class="value">
              <img v-for="(imageUrl, index) in record.confirmation.url.split(',')"
                :key="index"
                :src="imageUrl"
                @click="preview(imageUrl)">
            </span>
          </div>
        </div>
      </div>

      <div class="hidden-danger-eliminate"
        v-if="record.eliminate && record.confirmation && record.confirmation.isDanger === 1">
        <div class="title">消除隐患</div>
        <div class="content">
          <div class="field-value">
            <span class="label">{{record.eliminate.controlLevelName}}：</span>
            <span class="value">{{record.eliminate.nickname}}</span>
          </div>
          <div class="field-value">
            <span class="label">描述：</span>
            <span class="value">
              {{record.eliminate.remark}}
            </span>
          </div>
          <div class="field-value photos" v-if="record.eliminate.url">
            <span class="label">照片：</span>
            <span class="value">
              <img v-for="(imageUrl, index) in record.eliminate.url.split(',')"
                :key="index"
                :src="imageUrl"
                @click="preview(imageUrl)">
            </span>
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
  name: 'HiddenDangerControlDetail',

  data() {
    return {
      visible: false,
      loading: false,

      photoURL: null,
      photoDialogVisible: false,

      record: {
        basic: {},
        report: {},
        confirmation: {},
        eliminate: {}
      }
    }
  },

  computed: {
    statusText() {
      switch (this.record.basic.hiddenDangerStatus) {
      case 0:
        return '待确定'
      case 1:
        return '等待整改'
      case 2:
        return '整改完成'
      }
    },

    levelText() {
      switch (this.record.basic.hiddenDangerLevel) {
      case 0:
        return '无'
      case 1:
        return '重大隐患'
      case 2:
        return '一般隐患'
      }
    }
  },

  methods: {
    ...mapActions('hiddenDangerControl', ['loadData']),

    async show(id) {
      this.visible = true
      this.loading = true
      
      const result = await this.loadData(id)
      this.record = {
        basic: result.hiddenDangerManagement,
        report: result.reportInfo,
        confirmation: result.determineHidden,
        eliminate: result.eliminateHidden
      }
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
    &.level-1 .value {
      color: #FEA340;
    }

    &.level-2 .value {
      color: #F4D341;
    }
  }
}

.report-record, .hidden-danger-confirm, .hidden-danger-eliminate {
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

