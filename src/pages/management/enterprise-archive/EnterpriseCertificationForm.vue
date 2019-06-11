<template>
  <form-dialog :visible.sync="visible"
    :title="title"
    :show-buttons="!readonly"
    @close="handleDialogClose"
    @submit="handleDialogSubmit">
    <simple-form label-width="120px"
      :form-schema="formSchema"
      :form-rules="formRules"
      :disabled="readonly"
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
  { name: 'certName', label: '证书名称', inputType: 'string' },
  { name: 'licenseOrg', label: '发证机关', inputType: 'string' },
  { name: 'certCode', label: '证书批准文号', inputType: 'string' },
  { name: 'certType', label: '证书类型', inputType: 'string' },
  { name: 'licenseDate', label: '颁证时间', inputType: 'date' },
  { name: 'startDate', label: '证书生效时间', inputType: 'date' },
  { name: 'endDate', label: '证书过期时间', inputType: 'date' },
  { name: 'originalCertificate', label: '证书正本', inputType: 'attachment', image: true },
  { name: 'certificateCopy', label: '证书副本', inputType: 'attachment', image: true },
  { name: 'permitted', label: '许可范围', inputType: 'text' },
  { name: 'remark', label: '备注说明', inputType: 'string' }
]

const formRules = {
  certName: { required: true, message: '请输入证书名称', trigger: 'blur' }
}

export default {
  name: 'EnterpriseCertificationForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    enterpriseId: Number
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
        return '查看资质许可证信息'
      } else if (this.id) {
        return '编辑资质许可证信息'
      } else {
        return '新增资质许可证信息'
      }
    }
  },

  methods: {
    ...mapActions('enterpriseCertification', ['create', 'load', 'update']),

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
      
      const data = Object.assign({ companyId: this.enterpriseId }, clone(formData))

      if (this.id) {
        await this.update({id: this.id, formData: data })
      } else {
        await this.create(data)
      }
      
      this.loading = false
      this.visible = false
    }
  }
}
</script>
