<template>
  <div class="risk-jha" v-loading="loading">
    <div class="header">
      <div class="title">
        作业活动比较图

        <el-button type="text"
          size="medium"
          class="button-image-icon"
          :loading="exporting"
          @click="exportData">
          <img src="@/assets/icons/file-xls.png" class="icon">
          导出
        </el-button>
      </div>
      <div class="statistics">
        <div class="item" v-for="(subject, index) in jhaStatistics"
          :key="index">
          {{subject.twoName}}
          <div class="count">
            <span v-for="(item, itemIndex) in subject.items"
              :key="itemIndex"
              :class="['risk-level', `risk-level-${item.riskLevel}`]">
            </span>
          </div>
        </div>
      </div>
    </div>
    <el-table class="table"
      size="small"
      :data="flattenedJHAItems"
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
      <el-table-column label="工作危害分析辨识表（JHA）" align="center">
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
      <el-table-column label="作业条件危险性评估表（LEC）" align="center">
        <el-table-column label="风险评估分级" align="center">
          <el-table-column label="L"
            align="center"
            prop="riskAssessmentL"
            width="50">
          </el-table-column>
          <el-table-column label="E"
            align="center"
            prop="riskAssessmentE"
            width="50">
          </el-table-column>
          <el-table-column label="C"
            align="center"
            prop="riskAssessmentC"
            width="50">
          </el-table-column>
          <el-table-column label="D"
            align="center"
            prop="riskAssessmentD"
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
        <el-table-column label="新增风险管控措施或纳入隐患治理及治理期间的降低风险措"
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
        <el-table-column label="周期影响因子" align="center" prop="specialControlPeriod	"></el-table-column>
        <el-table-column label="导出标记" align="center" prop="exportTag"></el-table-column>
        <el-table-column label="备注" align="center" prop="remark"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'RiskJHA',

  data() {
    return {
      loading: true,
      exporting: false
    }
  },

  computed: {
    ...mapState('risk', ['jhaItems', 'flattenedJHAItems', 'jhaStatistics'])
  },

  methods: {
    ...mapActions('risk', ['loadRiskJHA', 'export']),

    mergeCells({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const thirdItems = this.flattenedJHAItems
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
      this.exporting = true

      const response = await this.export({ riskAssessmentId: this.$route.params.id, type: 'JHA' })
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      )
      const link = document.createElement('a')

      const disposition = response.headers['content-disposition']
      let filename = '安全检查辨识表（JHA）'
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
    await this.loadRiskJHA(this.$route.params.id)
    this.loading = false
  },

  mounted() {
    this.$nextTick(() => {
      this.$el.querySelector('.control-period-column').setAttribute('rowspan', 0)
    })
  }
}
</script>

<style lang="scss" scoped>
.risk-jha {
  flex: 1;
  margin-top: -14px;
  width: 100%;
  display: flex;
  flex-direction: column;

  .header {
    margin: 10px 0 12px;
    padding: 0 15px;

    .title {
      font-size: 14px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .statistics {
      font-size: 13px;

      .item {
        margin-top: 15px;
        display: flex;
        align-items: center;

        .count {
          margin-left: 8px;
        }

        .count .risk-level {
          width: 15px;
          height: 24px;
          display: inline-block;
          margin-right: 4px;

          &.risk-level-4 {
            background: #37A9FA;
          }

          &.risk-level-3 {
            background: #F4D341;
          }

          &.risk-level-2 {
            background: #FEA340;
          }

          &.risk-level-1 {
            background: #FA5878;
          }
        }
      }
    }
  }

  .table {
    flex: 1;
    width: 100%;
    border-left-width: 0;

    /deep/ .el-table__body-wrapper {
      min-height: 400px;
    }
  }

  .risk-level, .hidden-danger-level {
    height: 20px;
    padding: 0 5px;
    font-size: 12px;
    color: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    display: inline-block;
  }
}
</style>
