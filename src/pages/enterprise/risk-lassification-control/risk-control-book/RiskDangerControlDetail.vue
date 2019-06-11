<template>
  <div>
    <el-dialog
      title="风险管控详情"
      :visible.sync="visible"
      @close="clear"
      :close-on-click-modal="false"
      :lose-on-press-escape="false"
      class="risk-danger-show-dialog"
      :append-to-body="appendToBody"
    >
      <div class="risk-danger-show-body" v-loading="loading">
        <ul>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">风险区域</div>
              <div class="li-item-content">{{thirdItemDetail.riskName}}</div>
            </div>
            <div>
              <div class="li-item-name">管控项目</div>
              <div class="li-item-content">{{thirdItemDetail.twoName}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">管控内容</div>
              <div class="li-item-content">{{thirdItemDetail.name}}</div>
            </div>
            <div>
              <div class="li-item-name">风险等级</div>
              <div class="li-item-content">{{riskLevelDesc(thirdItemDetail.riskLevel)}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-name">风险描述</div>
            <div class="li-item-content">{{thirdItemDetail.riskDescription}}</div>
          </li>
          <li>
            <div class="li-item-name">辨识评价标准</div>
            <div class="li-item-content">{{thirdItemDetail.identifyEvaluationStandard}}</div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">初始风险评估(L)</div>
              <div class="li-item-content">{{thirdItemDetail.minimumL}}</div>
            </div>
            <div>
              <div class="li-item-name">实时风险评估(L)</div>
              <div class="li-item-content">{{thirdItemDetail.riskAssessmentL}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">初始风险评估(S)</div>
              <div class="li-item-content">{{thirdItemDetail.riskAssessmentS}}</div>
            </div>
            <div>
              <div class="li-item-name">实时风险评估(S)</div>
              <div class="li-item-content">{{thirdItemDetail.riskAssessmentS}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">初始风险评估(R)</div>
              <div
                class="li-item-content"
              >{{thirdItemDetail.minimumL * thirdItemDetail.riskAssessmentS}}</div>
            </div>
            <div>
              <div class="li-item-name">实时风险评估(R)</div>
              <div class="li-item-content">{{thirdItemDetail.riskAssessmentR}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-name">风险管控措施</div>
            <div class="li-item-content">{{thirdItemDetail.measures}}</div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">管控手段</div>
              <div class="li-item-content">{{controlDesc(thirdItemDetail.controlMeans)}}</div>
            </div>
            <div>
              <div class="li-item-name">管控级别</div>
              <div class="li-item-content">{{thirdItemDetail.controlLevel}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">管控岗位</div>
              <div class="li-item-content">{{thirdItemDetail.controlProfessional}}</div>
            </div>
            <div>
              <div class="li-item-name">管控周期</div>
              <div class="li-item-content">{{thirdItemDetail.controlPeriod}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">工程技术</div>
              <div class="li-item-content">{{thirdItemDetail.projectTechnology}}</div>
            </div>
            <div>
              <div class="li-item-name">导致后果</div>
              <div class="li-item-content">{{thirdItemDetail.resultIn}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">管理措施</div>
              <div class="li-item-content">{{thirdItemDetail.managementMeasure}}</div>
            </div>
            <div>
              <div class="li-item-name">培训教育</div>
              <div class="li-item-content">{{thirdItemDetail.trainingEducation}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">个体防护</div>
              <div class="li-item-content">{{thirdItemDetail.individualProtection}}</div>
            </div>
            <div>
              <div class="li-item-name">应急处理</div>
              <div class="li-item-content">{{thirdItemDetail.emergencyProcessing}}</div>
            </div>
          </li>
          <li
            class="li-control-content"
            v-if="riskList && riskList.length"
            v-for="(item, idx) in riskList"
          >
            <div class="li-item-name">{{item.controlOrReview === 1 ? '管控记录' : '复核流程'}}</div>
            <div class="li-item-content" v-if="item.controlOrReview === 1">
              <div>
                <div style="margin-bottom: 10px; color: #37A9FA;">{{strftime(item.date)}}</div>
                <div style="margin-bottom: 10px;">{{item.nickName}}</div>
                <div style="margin-bottom: 10px;">{{item.controlMsg}}</div>
                <img
                  v-if="item.url"
                  v-for="img in item.url.split(',')"
                  :src="img"
                  style="margin-right: 10px;"
                  @click="preview(item.url)"
                >
              </div>
            </div>
            <div class="li-item-content" v-else>
              <div>
                <div style="margin-bottom: 10px; color: #37A9FA">{{strftime(item.date)}}</div>
                <div style="margin-bottom: 10px;">{{item.nickName}}</div>
                <div>{{item.controlMsg}}</div>
              </div>
            </div>
          </li>
          <li class="li-control-content" v-if="!riskList.length">
            <div class="li-item-name">管控记录</div>
            <div class="li-item-content" style="color: #fa5878;">管控逾期</div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="photoDialogVisible"
      :append-to-body="true"
      custom-class="photo-preview-dialog"
    >
      <img width="100%" :src="photoURL">
    </el-dialog>
  </div>
</template>

<script>
import clone from 'lodash/clone'
import each from 'lodash/each'
import { mapActions } from 'vuex'
import { MessageBox } from 'element-ui'
import DataTable from '@/components/DataTable'
import dayjs from 'dayjs'

export default {
  name: 'RiskDangerControlDetail',

  components: {
    DataTable
  },

  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    },

    isEnterprise: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      visible: false,
      photoDialogVisible: false,
      photoURL: '',
      loading: false,
      id: null,
      threeId: null,
      thirdItemDetail: {
        caseUrl: '',
        controlLevel: '',
        controlMeans: '',
        controlPeriod: '',
        controlProfessional: '',
        createDate: '',
        demergencyProcessing: '',
        dindividualProtection: '',
        dmanagementMeasure: '',
        dprojectTechnology: '',
        dtrainingEducation: '',
        emergencyProcessing: '',
        exportTag: '',
        hiddenJudgeLevel: '',
        id: '',
        identifyEvaluationStandard: '',
        individualProtection: '',
        isNormalControls: '',
        isSystem: '',
        lawsRegulations: '',
        managementMeasure: '',
        measures: '',
        minimumL: '',
        modifyDate: '',
        name: '',
        periodicInfluenceFactor: '',
        projectTechnology: '',
        remark: '',
        resultIn: '',
        riskAssessmentC: '',
        riskAssessmentD: '',
        riskAssessmentE: '',
        riskAssessmentL: '',
        riskAssessmentR: '',
        riskAssessmentS: '',
        riskDescription: '',
        riskLevel: '',
        specialControlPeriod: '',
        structureId: '',
        threeCoding: '',
        trainingEducation: '',
        twoSubprojectId: '',
        riskName: '',
        twoName: ''
      },
      riskList: []
    }
  },

  methods: {
    ...mapActions('riskControlLedger', ['load']),

    show (id, threeId) {
      this.id = id
      this.threeId = threeId
      this.visible = true
      this.loading = true
      if (this.id) this.loadFormData()
    },

    async loadFormData () {
      const result = await this.load({ riskStandingId: this.id, threeId: this.threeId })
      this.thirdItemDetail = result.threeSubproject
      this.riskList = result.riskList
      this.loading = false
    },

    attachmentText (t) {
      return decodeURI(t.slice(t.lastIndexOf('/') + 1))
    },

    strftime (t) {
      return t ? dayjs(t).format('YYYY-MM-DD HH:mm') : ''
    },

    levelText (level) {
      switch (level) {
        case 1:
          return '重大隐患'
        case 2:
          return '一般隐患'
        default:
          return '无'
      }
    },

    riskLevelDesc (level) {
      switch (level) {
        case 1:
          return '重大风险'
        case 2:
          return '较大风险'
        case 3:
          return '一般风险'
        case 4:
          return '低风险'
        default:
          return '无'
      }
    },

    controlDesc (control) {
      switch (control) {
        case 1:
          return '台帐'
        case 2:
          return '拍照'
        default:
          return '无'
      }
    },

    handledownload (files) {
      each(files.split(';'), (i) => {
        window.open(i)
      })
    },

    handleStatus (o) {
      this.hirdItemDetail.status = o
    },

    error (m) {
      this.loading = false
      MessageBox.alert(m)
    },
    preview (photoURL) {
      console.log(photoURL)
      this.photoURL = photoURL
      this.photoDialogVisible = true
    },
    clear () {
      this.loading = false
      this.visible = false
      this.thirdItemDetail = {
        caseUrl: '',
        controlLevel: '',
        controlMeans: '',
        controlPeriod: '',
        controlProfessional: '',
        createDate: '',
        demergencyProcessing: '',
        dindividualProtection: '',
        dmanagementMeasure: '',
        dprojectTechnology: '',
        dtrainingEducation: '',
        emergencyProcessing: '',
        exportTag: '',
        hiddenJudgeLevel: '',
        id: '',
        identifyEvaluationStandard: '',
        individualProtection: '',
        isNormalControls: '',
        isSystem: '',
        lawsRegulations: '',
        managementMeasure: '',
        measures: '',
        minimumL: '',
        modifyDate: '',
        name: '',
        periodicInfluenceFactor: '',
        projectTechnology: '',
        remark: '',
        resultIn: '',
        riskAssessmentC: '',
        riskAssessmentD: '',
        riskAssessmentE: '',
        riskAssessmentL: '',
        riskAssessmentR: '',
        riskAssessmentS: '',
        riskDescription: '',
        riskLevel: '',
        specialControlPeriod: '',
        structureId: '',
        threeCoding: '',
        trainingEducation: '',
        twoSubprojectId: '',
        riskName: '',
        twoName: ''
      }
    }
  }
}
</script>
<style lang="scss">
.risk-danger-show-dialog {
  .el-dialog {
    width: 800px;
    .risk-danger-show-body {
      border: 1px solid #e4f1fd;
      ul {
        list-style: none;
        margin: 0 !important;
        padding: 0 !important;
        > :last-child {
          border-bottom: 0 !important;
        }
        .li-item-title {
          padding: 10px 20px;
          font-size: 16px;
          font-weight: 800;
          box-sizing: border-box;
        }
        li {
          width: 100%;
          display: flex;
          border-bottom: 1px solid #e4f1fd;
          .li-item-first {
            border-right: 1px solid #e4f1fd;
            > div {
              height: 100%;
              display: flex;
              align-items: center;
            }
          }

          > div {
            width: 50%;
            display: flex;
            align-items: center;
            .li-item-name {
              width: 34%;
              height: 100%;
              display: flex;
              align-items: center;
            }
            .li-item-content {
              width: 66%;
              flex-wrap: wrap;
              > span {
                margin-right: 5px;
                color: #37a9fa;
              }
            }
          }
          .li-item-name {
            width: 17%;
            text-align: right;
            background-color: rgba(249, 253, 255, 1);
            box-sizing: border-box;
            border-right: 1px solid #e4f1fd;
            padding: 5px 10px;
            justify-content: flex-end;
          }
          .li-item-content {
            width: 83%;
            box-sizing: border-box;
            padding: 5px 10px;
            img {
              width: auto;
              height: 90px;
              &:hover{
                cursor: pointer;
              }
            }
          }
          .li-item-table {
            width: calc(100% - 40px);
            margin: 0 20px 20px;
            .table {
              border-left-width: 1px;
            }
            .el-table td,
            .el-table th {
              padding: 5px 0;
            }
            .el-table__header-wrapper {
              thead tr th {
                background-color: rgba(249, 253, 255, 1);
              }
            }
          }
        }
        .li-control-content {
          min-height: 100px;
        }
      }
    }
  }
}
</style>
