<template>
  <form-dialog :visible.sync="visible"
    :title="title"
    :show-buttons="!readonly"
    :append-to-body="true"
    @close="handleDialogClose"
    @submit="handleDialogSubmit">
    <simple-form label-width="120px"
      :form-schema="formSchema"
      :form-rules="formRules"
      size="small"
      ref="form"
      @submit="submitForm"
      :disabled="readonly"
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
  { name: 'url', label: '图片', inputType: 'attachment' },
  { name: 'certificateName', label: '证书名称', inputType: 'string' },
  { name: 'licenseIssuingAgencieses', label: '发证机关', inputType: 'string' },
  { name: 'certificateNumber', label: '证书编号', inputType: 'string' },
  { name: 'certificateType', label: '证书类型', inputType: 'resource', resourceName: 'certificateType' },
  { name: 'getCardTime', label: '颁证时间', inputType: 'date' },
  { name: 'effectiveDate', label: '生效时间', inputType: 'date' },
  { name: 'reviewTime', label: '复审时间', inputType: 'date' },
  { name: 'expirationTime', label: '过期时间', inputType: 'date' },
  { name: 'reviewPeriod', label: '复审周期', inputType: 'number', suffix: '天' },
  { name: 'jobCategory', label: '作业类别', inputType: 'resource', resourceName: 'industryCategories' },
  { name: 'certificateTypeWork', label: '证书工种', inputType: 'resource', resourceName: 'certificateTypeWork' },
  { name: 'jobTitle', label: '职称名称', inputType: 'resource', resourceName: 'jobTitle' },
  { name: 'jobTitleType', label: '职业类型', inputType: 'resource', resourceName: 'jobTitleType' },
  {
    name: 'evaluatorQualification', label: '评价师资格', inputType: 'radio', value: 0,
    collection: [{ label: '否', value: 0 }, { label: '是', value: 1 }]
  },
  {
    name: 'engineerQualification', label: '工程师资格', inputType: 'radio', value: 0,
    collection: [{ label: '否', value: 0 }, { label: '是', value: 1 }]
  },
  { name: 'operatingProject', label: '操作项目', inputType: 'text' }
]

const formRules = {
  certificateName: { required: true, message: '证书名称', trigger: 'blur' }
}

export default {
  name: 'EmployeeCertificateForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    employeeId: Number
  },

  data() {
    return {
      visible: false,
      loading: false,
      id: null,
      readonly: false,
      formSchema,
      formRules
    }
  },

  computed: {
    title() {
      if (this.id && this.readonly) {
        return '查看证书信息'
      } else if (this.id) {
        return '编辑证书信息'
      } else {
        return '新增证书信息'
      }
    }
  },

  methods: {
    ...mapActions('employeeCertificate', ['create', 'load', 'update']),

    show({ id, readonly = false } = {}) {
      this.id = id
      this.readonly = readonly
      this.visible = true
      
      if (this.id) this.loadFormData()
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

      this.formSchema = formSchema.map(item => {
        item = clone(item)
        item.value = result[item.name]
        return item
      })

      this.loading = false
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true
      
      const data = Object.assign({ coPersonId: this.employeeId }, clone(formData))

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
