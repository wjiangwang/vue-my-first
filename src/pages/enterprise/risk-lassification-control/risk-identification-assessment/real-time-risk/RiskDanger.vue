<template>
  <div class="page regional-risk-danger">
    <div class="page-main" v-loading="flattenedSCLItems.loading">
      <div class="el-card is-never-shadow">
        <div class="name">
          <img src="@/assets/icons/risk.png" class="icon">
          <h1>{{risk.riskName}}</h1>
          <div class="risk-statistics">
            <div class="risk first">
              <span class="icon"></span>
              <span class="value">重大风险（{{risk.oneRisk}}）</span>
            </div>
            <div class="risk second">
              <span class="icon"></span>
              <span class="value">较大风险（{{risk.twoRisk}}）</span>
            </div>
            <div class="risk third">
              <span class="icon"></span>
              <span class="value">一般风险（{{risk.threeRisk}}）</span>
            </div>
            <div class="risk fourth">
              <span class="icon"></span>
              <span class="value">低风险（{{risk.fourRisk}}）</span>
            </div>

            <div class="hidden-danger first">
              <span class="icon"></span>
              <span class="value">一般隐患（{{risk.generalHidden}}）</span>
            </div>
            <div class="hidden-danger second">
              <span class="icon"></span>
              <span class="value">重大隐患（{{risk.majorHidden}}）</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-box">
        <div class="header">
          <el-button type="text"
            size="medium"
            class="button-image-icon"
            :loading="exporting"
            @click="exportData">
            <img src="@/assets/icons/file-xls.png" class="icon">
            导出
          </el-button>
        </div>
        <div class="table-data-container">
          <el-table class="table"
            size="small"
            :data="flattenedSCLItems"
            :span-method="mergeCells">
            <el-table-column label="风险点划分" align="center">
              <el-table-column label="编码及子项" align="center">
                <el-table-column label="二级编码" align="center" prop="twoCoding"></el-table-column>
                <el-table-column label="二级子项" align="center" prop="twoName"></el-table-column>
                <el-table-column label="三级编码" align="center" prop="threeCoding"></el-table-column>
                <el-table-column label="三级子项" align="center" prop="name"></el-table-column>
                <el-table-column label="风险描述" align="center" prop="riskDescription"></el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="安全检查辨识表（SCL）" align="center">
              <el-table-column
                label="辨识评价标准（紫色标注为重大隐患及重大风险判定项）" align="center"
                prop="identifyEvaluationStandard"
                min-width="240">
              </el-table-column>
              <el-table-column label="导致后果" align="center" prop="resultIn"></el-table-column>
              <el-table-column label="现有管控措施（灰色标注为未达标项）" align="center">
                <el-table-column label="工程技术" align="center"
                  prop="projectTechnology">
                </el-table-column>
                <el-table-column label="管理措施" align="center"
                  prop="managementMeasure">
                </el-table-column>
                <el-table-column label="培训教育" align="center"
                  prop="trainingEducation">
                </el-table-column>
                <el-table-column label="个体防护" align="center"
                  prop="individualProtection">
                </el-table-column>
                <el-table-column label="应急处理" align="center"
                  prop="emergencyProcessing">
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="风险矩阵评估表（LS）" align="center">
              <el-table-column label="风险评估分级" align="center">
                <el-table-column label="L" align="center"
                  prop="riskAssessmentL"
                  width="50">
                </el-table-column>
                <el-table-column label="S" align="center"
                  prop="riskAssessmentS"
                  width="50">
                </el-table-column>
                <el-table-column label="R" align="center"
                  prop="riskAssessmentR"
                  width="50">
                </el-table-column>
                <el-table-column label="风险级别" align="center">
                  <span slot-scope="{ row }" :class="['risk-level', `risk-level-${row.riskLevel}-bg`]">
                    {{row.riskLevel | riskLevel}}
                  </span>
                </el-table-column>
              </el-table-column>
              <el-table-column label="隐患判定级别" align="center">
                <span slot-scope="{ row }"
                  :class="[row.hiddenJudgeLevel !== 0 ? `hidden-danger-level hidden-danger-level-${row.hiddenJudgeLevel}-bg` : '']">
                  {{row.hiddenJudgeLevel | hiddenDangerLevel}}
                </span>
              </el-table-column>
              <el-table-column label="新增风险管控措施或纳入隐患治理及治理期间的降低风险措施"
                prop="measures"
                min-width="160"
                align="center">
              </el-table-column>
            </el-table-column>
            <el-table-column label="风险管控要求" align="center">
              <el-table-column label="管控手段" align="center" prop="controlMeans"></el-table-column>
              <el-table-column label="管控级别" align="center" prop="controlLevel"></el-table-column>
              <el-table-column label="管控专业" align="center" prop="controlProfessional"></el-table-column>
              <el-table-column label="管控周期" align="center" class-name="control-period-column">
                <el-table-column align="center" prop="controlPeriod"></el-table-column>
                <el-table-column align="center" prop="specialControlPeriod"></el-table-column>
              </el-table-column>
              <el-table-column label="周期影响因子" align="center" prop="specialControlPeriod "></el-table-column>
              <el-table-column label="导出标记" align="center" prop="exportTag"></el-table-column>
              <el-table-column label="备注" align="center" prop="remark"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import PageCard from '@/components/PageCard'

  export default {
    name: 'RiskSCL',

    components: {
      PageCard
    },

    data() {
      return {
        loading: true,
        exporting: false,
        risk: {
          id: '',
          fourRisk: '',
          generalHidden: '',
          majorHidden: '',
          oneRisk: '',
          riskName: '',
          threeRisk: '',
          twoRisk: ''
        }
      }
    },

    computed: {
      ...mapState('regionalRisk', ['flattenedSCLItems'])
    },

    methods: {
      ...mapActions('regionalRisk', ['loadRiskDanger', 'loadRiskDetail', 'export']),

      mergeCells({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex == 1) {
          const thirdItems = this.flattenedSCLItems
            .filter(item => item.twoCoding === row.twoCoding)
          const itemIndex = thirdItems.findIndex(item => item.id === row.id)

          if (itemIndex === 0) {
            return { rowspan: thirdItems.length, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
      },

      async exportData() {
        return
        this.exporting = true

        const response = await this.export({ riskAssessmentId: this.$route.params.id, type: 'SCL' })
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        )
        const link = document.createElement('a')

        const disposition = response.headers['content-disposition']
        let filename = '安全检查辨识表（SCL）'
        if (disposition) {
            const matches = disposition.match(/filename="(.+)"/)
            if (matches.length === 2) filename = matches[1]
        }

        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        this.exporting = false
      }
    },

    async created() {
      this.risk = await this.loadRiskDetail(this.$route.params.id)
      await this.loadRiskDanger(this.$route.params.id)
      this.loading = false
    },

    mounted() {
      this.$nextTick(() => {
        this.$el.querySelector('.control-period-column').setAttribute('rowspan', 0)
      })
    }
  }
</script>
<style lang="scss">
  .regional-risk-danger {
    height: calc(100% - 50px) !important;
    .page-main {
      display: flex;
      flex-direction: column;
      > .el-card {
        margin: 20px 0 0 20px;
        /*padding: 24px 20px;*/
        padding: 10px 20px;
        flex-direction: column;
        align-items: flex-start !important;
        position: relative;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        .name {
          display: flex;
          align-items: center;
          /*margin-bottom: 10px;*/

          .icon {
            width: 34px;
            height: 34px;
            margin-right: 8px;
          }

          h1 {
            font-size: 22px;
            line-height: 30px;
            margin: 0;
          }
        }

        .risk-statistics {
          font-size: 13px;
          color: #333;
          line-height: 17px;
          display: flex;
          align-items: center;
          margin-left: 30px;

          .risk, .hidden-danger {
            display: flex;
            align-items: center;
            margin-right: 20px;
          }

          .risk {
            .icon {
              width: 18px;
              height: 18px;
              margin-right: 5px;
            }

            &.first .icon {
              background: #FA5878;
            }

            &.second .icon {
              background: #FEA340;
            }

            &.third .icon {
              background: #F4D341;
            }

            &.fourth .icon {
              background: #37A9FA;
            }
          }

          .hidden-danger {
            .icon {
              width: 0;
              height: 0;
              border: 9px solid transparent;
              margin-top: -9px;
              margin-right: 5px;
            }

            &.first .icon {
              border-bottom: 18px solid#F4D341;
            }

            &.second .icon {
              border-bottom: 18px solid#FEA340;
            }
          }
        }

        .actions {
          position: absolute;
          top: 14px;
          right: 35px;

          .link-map img {
            width: 25px;
            height: 20px;
            margin-right: 30px;
          }

          .link-delete img {
            width: 14px;
            height: 18px;
          }
        }
      }

      > .content-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        .header {
          padding: 5px 20px;
          text-align: right;
        }

        .table-data-container {
          overflow: hidden;
          overflow-y: auto;
        }

        .table {
          flex: 1;
          width: 100%;
          border-left-width: 0;

          /deep/ .el-table__body-wrapper {
            min-height: 400px;
          }
        }

        .risk-level,
        .hidden-danger-level {
          height: 20px;
          padding: 0 5px;
          font-size: 12px;
          color: #fff;
          box-sizing: border-box;
          border-radius: 3px;
          display: inline-block;
        }
      }
    }
  }
</style>
