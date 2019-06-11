<template>
  <form-dialog :visible.sync="visible"
    :title="title"
    :show-buttons="!readonly"
    width="820px"
    @close="handleDialogClose"
    @submit="handleDialogSubmit">
    <simple-form label-width="130px"
      :form-schema="readonly ? formSchemaForReadonly : formSchema"
      :form-rules="formRules"
      :disabled="readonly"
      size="small"
      formWidth="99%"
      ref="form"
      @submit="submitForm"
      v-loading="loading">
    </simple-form>
  </form-dialog>
</template>

<script>
import omit from 'lodash/omit'
import clone from 'lodash/clone'
import cloneDeep from 'lodash/cloneDeep'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'

const formSchema = (type) => {
  return [
    {
      fieldset: true,
      legend: '风险点划分',
      inputs: [
        { name: 'threeCoding', label: '三级编码', inputType: 'string', disabled: true },
        { name: 'name', label: '三级子项', inputType: 'string' },
        { name: 'riskDescription', label: '风险描述', inputType: 'string' }
      ]
    },
    {
      fieldset: true,
      legend: type === 'JHA' ? '工作危害分析辨识表（JHA）' : '安全检查辨识表（SCL）',
      inputs: [
        { name: 'identifyEvaluationStandard', label: '辨识评价标准', inputType: 'string' },
        { name: 'resultIn', label: '导致后果', inputType: 'string' },
        { name: 'projectTechnology', label: '工程技术', inputType: 'string' },
        { name: 'managementMeasure', label: '管理措施', inputType: 'string' },
        { name: 'trainingEducation', label: '培训教育', inputType: 'string' },
        { name: 'individualProtection', label: '个体防护', inputType: 'string' },
        { name: 'emergencyProcessing', label: '应急处理', inputType: 'string' }
      ]
    },
    {
      fieldset: true,
      legend: type === 'JHA' ? '作业条件危险性评估表（LEC）' : '风险矩阵分析评价表（LS）',
      inputs: [
        { name: 'riskAssessmentL', label: '风险评估（L）', inputType: 'string' },
        {
          name: type === 'JHA' ? 'riskAssessmentE' : 'riskAssessmentS',
          label: type === 'JHA' ? '风险评估（E）' : '风险评估（S）',
          inputType: 'string'
        },
        {
          name: type === 'JHA' ? 'riskAssessmentC' : 'riskAssessmentR',
          label: type === 'JHA' ? '风险评估（C）' : '风险评估（R）',
          inputType: 'string'
        },
        type === 'JHA' ? {
          name: 'riskAssessmentD', label: '风险评估（D）', inputType: 'string'
        } : null,
        {
          name: 'riskLevel', label: '风险级别', inputType: 'select',
          collection: [
            { label: '重大风险', value: 1 },
            { label: '较大风险', value: 2 },
            { label: '一般风险', value: 3 },
            { label: '低风险 ', value: 4 }
          ]
        },
        {
          name: 'hiddenJudgeLevel', label: '隐患判断级别', inputType: 'select',
          collection: [
            { label: '无', value: 0 },
            { label: '重大隐患', value: 1 },
            { label: '一般隐患', value: 2 }
          ]
        },
        { name: 'measures', label: '风险管控措施', inputType: 'string' }
      ].filter(input => !!input)
    },
    {
      fieldset: true,
      legend: '风险管控要求',
      inputs: [
        {
          name: 'controlMeans', label: '管控手段', inputType: 'select',
          collection: [
            { label: '无', value: '无' },
            { label: '台账', value: '台账' },
            { label: '拍照', value: '拍照' }
          ]
        },
        { name: 'controlLevel', label: '管控级别', inputType: 'resource', resourceName: 'sysControlLevel' },
        { name: 'controlProfessional', label: '管控专业', inputType: 'string' },
        {
          name: 'controlPeriod', label: '正常管控周期', inputType: 'resource', resourceName: 'controlPeriod'
        },
        {
          name: 'specialControlPeriod', label: '非正常管控周期', inputType: 'resource', resourceName: 'controlPeriod'
        },
        { name: 'periodicInfluenceFactor', label: '周期影响因子', inputType: 'resource', resourceName: 'multidimensional' },
        { name: 'exportTag', label: '导出标记', inputType: 'string' },
        { name: 'remark', label: '备注', inputType: 'string' }
      ]
    }
  ]
}

const formRules = {
  threeCoding: { required: true, message: '请填写三级编码', trigger: 'blur' },
  name: { required: true, message: '请填写三级子项', trigger: 'blur' },
  riskLevel: { required: true, message: '请选择风险级别', trigger: 'change' },
  hiddenJudgeLevel: { required: true, message: '请选择隐患判断级别', trigger: 'change' },
  controlLevel: { required: true, message: '请选择管控级别', trigger: 'change' },
  controlPeriod: { required: true, message: '请选择管控周期', trigger: 'change' },
  controlMeans: { required: true, message: '请选择措施方式', trigger: 'change' }
}

export default {
  name: 'RealTimeRiskDetailForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    type: String,
    secondItemId: ''
  },

  data() {
    return {
      visible: false,
      loading: false,
      id: null,
      readonly: false,
      formSchema: formSchema(this.type),
      formRules
    }
  },

  computed: {
    title() {
      if (this.id && this.readonly) {
        return '查看三级子项'
      } else if (this.id) {
        return '编辑三级子项'
      } else {
        return '新增三级子项'
      }
    },

    formSchemaForReadonly() {
      return this.formSchema.map(item => {
        return {
          fieldset: item.fieldset,
          legend: item.legend,
          inputs: item.inputs.map(input => {
            return Object.assign({}, input, {
              inputType: input.inputType === 'resource' ? 'string' : input.inputType
            })
          })
        }
      })
    }
  },

  methods: {
    ...mapActions('realTimeRiskThird', ['load', 'update']),

    show({ id, readonly = false } = {}) {
      this.id = id
      this.readonly = readonly
      this.visible = true

      if (this.id) this.loadFormData()
    },

    handleDialogClose() {
      this.$refs.form.reset()
      this.formSchema = formSchema(this.type)
    },

    handleDialogSubmit() {
      this.$refs.form.submit()
    },

    async loadFormData() {
      this.loading = true
      const result = await this.load(this.id)

      this.formSchema = this.formSchema.map(item => {
        const inputs = cloneDeep(item.inputs)
        item = omit(item, 'inputs')

        item.inputs = inputs.map(input => {
          input.value = result[input.name]
          return input
        })

        return item
      })

      this.loading = false
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true

      const data = Object.assign({
        twoSubprojectId: this.secondItemId
      }, clone(formData))

      if (this.id) {
        await this.update({ id: this.id, formData: data })
      } else {
        await this.create(data)
      }

      this.loading = false
      this.visible = false
    }
  }
}
</script>
