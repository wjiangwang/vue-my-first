<template>
  <div>
    <el-dialog title="三级子项详情" :visible.sync="visible" @close="clear" :close-on-click-modal="false" :lose-on-press-escape="false" class="risk-assessment-third-dialog" :append-to-body="appendToBody">
      <div class="risk-assessment-third-body" v-loading="loading">
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
              <div class="li-item-content">{{thirdItemDetail.minimumL * thirdItemDetail.riskAssessmentS}}</div>
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

    data() {
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
          twoSubprojectId: '',
          riskName: '',
          twoName: ''
        },
        dangerousGoods: []
      }
    },

    methods: {
      ...mapActions('riskThirdItem', ['load']),

      show(id) {
        this.id = id
        this.visible = true
        this.loading = true
        if (this.id) this.loadFormData()
      },

      async loadFormData() {
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

      levelText(level) {
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
  .risk-assessment-third-dialog {
    .el-dialog {
      width: 800px;
      .risk-assessment-third-body {
        border: 1px solid #E4F1FD;
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
            border-bottom: 1px solid #E4F1FD;
            .li-item-first {
              border-right: 1px solid #E4F1FD;
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
                  color: #37A9FA;
                }
              }
            }
            .li-item-name {
              width: 17%;
              text-align: right;
              background-color: rgba(249,253,255,1);
              box-sizing: border-box;
              border-right: 1px solid #E4F1FD;
              padding: 5px 10px;
              justify-content: flex-end;
            }
            .li-item-content {
              width: 83%;
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
              .el-table td, .el-table th{
                padding: 5px 0;
              }
              .el-table__header-wrapper {
                thead tr th {
                  background-color: rgba(249,253,255,1);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
