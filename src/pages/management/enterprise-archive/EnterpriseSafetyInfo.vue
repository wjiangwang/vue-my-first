<template>
  <div class="enterprise-safety-info">
    <div class="form-wrapper" v-loading="loading">
      <el-form label-suffix=":"
        label-width="180px"
        ref="form"
        :model="formData"
        size="small"
        :disabled="!canEdit || isRedirect">
        <div class="section management-section">
          <div class="name">安全生产管理机构</div>
          <div class="fields">
            <component v-for="input in managementSchema"
              :key="input.name"
              :is="`${input.inputType}-input`"
              :value="formData[input.name]"
              v-bind="input"
              @input="formData[input.name] = $event">
            </component>
          </div>
        </div>

        <div class="section">
          <div class="name">安全生产标准信息</div>
          <div class="fields">
            <component v-for="input in standardSchema"
              :key="input.name"
              :is="`${input.inputType}-input`"
              :value="formData[input.name]"
              v-bind="input"
              @input="formData[input.name] = $event">
            </component>
          </div>
        </div>
      </el-form>
    </div>

    <div class="form-buttons" v-if="canEdit && !isRedirect">
      <el-button type="primary" size="medium" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>

<script>
import clone from 'lodash/clone'
import { mapActions } from 'vuex'
import ScrollView from '@/components/ScrollView'

const managementSchema = [
  { name: 'organizationName', label: '安全管理机构名称', inputType: 'string' },
  { name: 'fullTimeManagement', label: '专职安全管理人员数量', inputType: 'number', suffix: '个' },
  { name: 'partTimeManagement', label: '兼职安全管理人员数量', inputType: 'number', suffix: '个' },
  { name: 'specialOperationsNum', label: '特种作业人数', inputType: 'number', suffix: '个' },
  { name: 'companyEmployeesNum', label: '企业从业人数', inputType: 'number', suffix: '个' },
  { name: 'partTimeEmergency', label: '兼职应急人数', inputType: 'number', suffix: '个' },
  { name: 'fullTimeEmergency', label: '专职应急人数', inputType: 'number', suffix: '个' }
]

const standardSchema = [
  { name: 'supervisionOrgan', label: '安检机构', inputType: 'string' },
  { name: 'certState', label: '证书状态', inputType: 'string' },
  { name: 'holdingOrgan', label: '评审组织', inputType: 'string' },
  { name: 'reviewOrgan', label: '评审单位', inputType: 'string' },
  { name: 'applicationType', label: '申请类型', inputType: 'string' },
  { name: 'specialty', label: '所属专业', inputType: 'string' },
  { name: 'holdingOrganUnitLicense', label: '评审组织单位执照号', inputType: 'string' },
  { name: 'reviewOrganUnitLicense', label: '评审单位营业执照号', inputType: 'string' },
  { name: 'certNumber', label: '标准化证书编号', inputType: 'string' },
  { name: 'reviewOrganCode', label: '评审单位代码', inputType: 'string' },
  { name: 'issueOrganUnitCode', label: '证书颁发单位执照号', inputType: 'string' },
  { name: 'issueOrganMonitorCode', label: '证书颁发监查部门代码', inputType: 'string' },
  { name: 'supervisionOrganCode', label: '标准化安检机构代码', inputType: 'string' },
  { name: 'standardLevel', label: '标准化等级', inputType: 'string' },
  { name: 'issueDate', label: '发证日期', inputType: 'date' },
  { name: 'expirationDate', label: '有效期限', inputType: 'date' },
  { name: 'revocationDate', label: '撤销日期', inputType: 'date' },
  { name: 'attachment', label: '上传证书', inputType: 'attachment', image: true }
]

export default {
  name: 'EnterpriseSafetyInfo',

  components: {
    ScrollView
  },

  props: {
    canEdit: {
      type: Boolean,
      default: false
    },

    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,

      managementSchema,
      standardSchema,

      formData: {},
      id: ''
    }
  },

  methods: {
    ...mapActions('enterpriseSafety', ['load', 'update']),

    async getLoad () {
      const result = await this.load(this.$route.params.id)
      if (result && result.id) {
        this.id = result.id
      }
      managementSchema.forEach(({ name }) => {
        this.$set(this.formData, name, result[name])
      })

      standardSchema.forEach(({ name }) => {
        this.$set(this.formData, name, result[name])
      })
    },

    async submitForm() {
      try {
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.loading = true

          const result = await this.update({
            id: this.$route.params.id ? this.$route.params.id : this.id, formData: clone(this.formData)
          })

          this.loading = false

          if (result && result.status === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
          if (this.id) this.getLoad()
        }
      } catch (error) {}
    }
  },

  created() {
    this.loading = true
    this.getLoad()

    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.enterprise-safety-info {
  flex: 1;
  position: relative;

  .form-wrapper {
    padding: 0 20px 20px;

    .section {
      .name {
        font-size: 16px;
        line-height: 21px;
        margin: 20px 0;
      }

      .fields {
        display: flex;
        flex-wrap: wrap;

        /deep/ .el-form-item {
          width: 45%;
          &:nth-child(2n+1) {
            margin-right: 30px;
          }
        }
      }

      &:first-child {
        border-bottom: 1px solid #ccc;
      }

      &.management-section .fields /deep/ .el-form-item{
        &:first-child {
          width: 70%;
        }
        &:nth-child(2n) {
          margin-right: 30px;
        }
      }
    }
  }
}
</style>
