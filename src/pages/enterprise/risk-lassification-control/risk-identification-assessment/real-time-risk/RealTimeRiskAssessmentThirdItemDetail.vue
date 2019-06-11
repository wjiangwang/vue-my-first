<template>
  <div>
    <el-dialog
      title="作业风险详单"
      :visible.sync="visible"
      @close="clear"
      :close-on-click-modal="false"
      :lose-on-press-escape="false"
      class="risk-assessment-third-dialog"
      :append-to-body="appendToBody"
    >
      <div class="real-time-risk-assessment-third-body" v-loading="loading">
        <ul>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">风险点名称</div>
              <div class="li-item-content">{{thirdItemDetail.threeCoding}}</div>
            </div>
            <div>
              <div class="li-item-name">作业类型</div>
              <div class="li-item-content">{{thirdItemDetail.name}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-name">作业内容</div>
            <div class="li-item-content">{{thirdItemDetail.riskDescription}}</div>
          </li>
          <li class="li-height-2">
            <div class="li-item-name">风险描述</div>
            <div class="li-item-content">{{thirdItemDetail.identifyEvaluationStandard}}</div>
          </li>
          <li class="li-height-3">
            <div class="li-item-name">辨识评估标准</div>
            <div class="li-item-content">{{thirdItemDetail.identifyEvaluationStandard}}</div>
          </li>
          <li>
            <div class="li-item-name">导致后果</div>
            <div class="li-item-content">{{thirdItemDetail.identifyEvaluationStandard}}</div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">工程技术</div>
              <div class="li-item-content">{{thirdItemDetail.resultIn}}</div>
            </div>
            <div>
              <div class="li-item-name">个体防护</div>
              <div class="li-item-content">{{thirdItemDetail.resultIn}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">管理措施</div>
              <div class="li-item-content">{{thirdItemDetail.projectTechnology}}</div>
            </div>
            <div>
              <div class="li-item-name">培训教育</div>
              <div class="li-item-content">{{thirdItemDetail.managementMeasure}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-name">应急处理</div>
            <div class="li-item-content">{{thirdItemDetail.emergencyProcessing}}</div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">管理措施</div>
              <div class="li-item-content">{{controlDesc(thirdItemDetail.controlMeans)}}</div>
            </div>
            <div>
              <div class="li-item-name">管控周期</div>
              <div class="li-item-content">{{thirdItemDetail.controlPeriod}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">风险评估（L）</div>
              <div class="li-item-content">{{thirdItemDetail.minimumL}}</div>
            </div>
            <div>
              <div class="li-item-name">风险评估（E）</div>
              <div class="li-item-content">{{thirdItemDetail.riskAssessmentL}}</div>
            </div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">风险评估（C）</div>
              <div class="li-item-content">{{thirdItemDetail.minimumL}}</div>
            </div>
            <div>
              <div class="li-item-name">风险评估（D）</div>
              <div class="li-item-content">{{thirdItemDetail.riskAssessmentL}}</div>
            </div>
          </li>
          <li>
            <div>
              <div class="li-item-name">风险级别</div>
              <div class="li-item-content">{{riskLevelDesc(thirdItemDetail.riskLevel)}}</div>
            </div>
            <div class="li-item-first">
              <div class="li-item-name">隐患判断</div>
              <div class="li-item-content">{{levelText(thirdItemDetail.hiddenJudgeLevel)}}</div>
            </div>
          </li>
          <li class="li-height-2">
            <div class="li-item-name">风险管控措施</div>
            <div class="li-item-content">{{thirdItemDetail.measures}}</div>
          </li>
          <li>
            <div class="li-item-first">
              <div class="li-item-name">管控方式</div>
              <div class="li-item-content">{{controlDesc(thirdItemDetail.controlMeans)}}</div>
            </div>
            <div>
              <div class="li-item-name">管控级别</div>
              <div class="li-item-content">{{thirdItemDetail.controlLevel}}</div>
            </div>
          </li>
          <li>
            <div>
              <div class="li-item-name">管控周期</div>
              <div class="li-item-content">{{thirdItemDetail.controlPeriod}}</div>
            </div>
            <div class="li-item-first">
              <div class="li-item-name">备注</div>
              <div class="li-item-content">{{thirdItemDetail.remark}}</div>
            </div>
          </li>
          <!--  -->
        </ul>
      </div>
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
  name: 'RiskAssessmentThirdItemDetail',

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
      loading: false,
      id: null,
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
        twoSubprojectId: ''
      },
      dangerousGoods: []
    }
  },

  methods: {
    ...mapActions('riskThirdItem', ['load']),

    show (id) {
      this.id = id
      this.visible = true
      this.loading = true
      if (this.id) this.loadFormData()
    },

    async loadFormData () {
      // const result = await this.load(this.id)
      this.thirdItemDetail = await this.load(this.id)
      this.loading = false
    },

    attachmentText (t) {
      return decodeURI(t.slice(t.lastIndexOf('/') + 1))
    },

    strftime (t) {
      return t ? dayjs(t).format('YYYY-MM-DD') : ''
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

    async submit () {
      if (this.loading) return

      this.loading = true
      if (this.hirdItemDetail.status !== 1 && this.hirdItemDetail.status !== 2) {
        return this.error('请选择审核结果')
      }
      const result = await this.approveRecord(this.hirdItemDetail)
      this.loading = false
      if (result && result.status === 0) {
        this.$message({
          message: '审核成功',
          type: 'success'
        })
        this.clear()
      }

    },

    error (m) {
      this.loading = false
      MessageBox.alert(m)
    },

    clear () {
      this.loading = false
      this.visible = false
      this.dangerousGoods = []
      this.thirdItemDetail = {
        annualInterestRate: '',
        businessType: '',
        chemicalType: '',
        createDate: '',
        dangerPointName: '',
        dangerPointReporter: '',
        declareAttachment: '',
        declareLevel: '',
        email: '',
        evaluationOfAttachment: '',
        fax: '',
        fixedAssets: '',
        hazardPhotos: '',
        id: '',
        isAccident: '',
        isHiddenTrouble: '',
        isRescueTeams: '',
        latitude: '',
        longitude: '',
        mainProducts: '',
        hirdItemDetailAddress: '',
        hirdItemDetailCode: '',
        hirdItemDetailType: '',
        modifyDate: '',
        phone: '',
        pressureVessel: '',
        qiQi: '',
        regularTesting: '',
        storageOwnership: '',
        threePressureVessel: '',
        totalAssets: '',
        zipCode: '',
        status: ''
      }
    }
  }
}
</script>
<style lang="scss">
.risk-assessment-third-dialog {
  .el-dialog {
    min-width: 1000px;
    .el-dialog__body {
      /*padding: 0;*/
      /*>:nth-child(1) {
          padding: 30px 20px 1px;
        }*/
    }
    .real-time-risk-assessment-third-body {
      li {
        min-height: 45px;
      }
      .li-height-2 {
        min-height: 90px;
      }
      .li-height-3 {
        min-height: 135px;
      }
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
            height: auto;
            display: flex;
            align-items: center;
            .li-item-name {
              width: 30%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .li-item-content {
              width: 70%;
              flex-wrap: wrap;
              > span {
                margin-right: 5px;
                color: #37a9fa;
              }
            }
          }
          .li-item-name {
            width: 15%;
            text-align: right;
            height: auto;
            background-color: rgba(249, 253, 255, 1);
            box-sizing: border-box;
            border-right: 1px solid #e4f1fd;
            padding: 5px 10px;
            justify-content: center;
          }
          .li-item-content {
            text-indent: 2em;
            width: 85%;
            box-sizing: border-box;
            padding: 5px 10px;
            img {
              width: 120px;
              height: auto;
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
      }
    }
  }
}
</style>
