<template>
  <form-dialog :visible.sync="visible"
    :title="id ? '编辑风险辨识评估' : '新增风险辨识评估'"
    @close="handleDialogClose"
    @submit="handleDialogSubmit">
    <simple-form label-width="120px"
      :form-schema="formSchema"
      :form-rules="formRules"
      size="small"
      ref="form"
      @submit="submitForm"
      v-loading="loading">
    </simple-form>
  </form-dialog>
</template>

<script>
import clone from 'lodash/clone'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'

const formSchema = [
  { name: 'oneCoding', label: '一级编码', inputType: 'string' },
  { name: 'riskName', label: '风险点名称', inputType: 'string' },
  { name: 'identifyRiskType', label: '辨识评估类型', inputType: 'string' },
  { name: 'identifyPerson', label: '辨识人', inputType: 'string' },
  { name: 'identifyDate', label: '辨识日期', inputType: 'date' },
  { name: 'auditor', label: '审核人', inputType: 'string' },
  { name: 'auditDate', label: '审核时间', inputType: 'date' },
  { name: 'status', label: '是否在产', inputType: 'boolean' }
]

const formRules = {
  oneCoding: { required: true, message: '请输入一级编码', trigger: 'blur' },
  riskName: { required: true, message: '请输入风险点名称', trigger: 'blur' }
}

export default {
  name: 'EnterpriseRiskAssessmentForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    enterpriseId: Number,
    fromSubLevel: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false,
      loading: false,
      id: null,
      formSchema,
      formRules
    }
  },

  methods: {
    ...mapActions('regionalRisk', ['create', 'load', 'update']),

    show(id) {
      this.id = id
      this.visible = true

      if (this.fromSubLevel)
        this.formSchema = this.formSchema.map(input => {
          if (input.name === 'oneCoding' || input.name === 'riskName')
            input.disabled = true

          return input
        })

      if (this.id) {
        this.formSchema = this.formSchema.slice(0, -1)
        this.loadFormData()
      }
    },

    handleDialogClose() {
      this.$refs.form.reset()
      this.formSchema = formSchema.map(clone)
    },

    handleDialogSubmit() {
      this.$refs.form.submit()
    },

    async loadFormData() {
      this.loading = true
      const result = await this.load(this.id)

      this.formSchema = this.formSchema.map(item => {
        item = clone(item)
        item.value = result[item.name]
        return item
      })

      this.loading = false
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true

      const data = Object.assign({ companyId: this.enterpriseId }, clone(formData))

      if (this.id) {
        await this.update({ id: this.id, formData: data })
      } else {
        await this.create(data)
      }

      if (this.fromSubLevel) this.$emit('submitted')

      this.loading = false
      this.visible = false
    }
  }
}
</script>
