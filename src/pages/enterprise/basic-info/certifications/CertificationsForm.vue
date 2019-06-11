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
  { name: 'certificateName', label: '证书名称', inputType: 'string' },
  { name: 'certificateNumber', label: '证书编号', inputType: 'string' },
  { name: 'expirationTime', label: '证书过期时间', inputType: 'date' },
  { name: 'licenseOrg', label: '发证机关', inputType: 'string' },
  { name: 'licenseDate', label: '颁证时间', inputType: 'date' },
  { name: 'url', label: '上传证书', inputType: 'attachment', image: true }
]

const formRules = {
  certificateName: { required: true, message: '请输入证书名称', trigger: 'blur' },
  certificateNumber: { required: true, message: '请输入证书编号', trigger: 'blur' }
}

export default {
  name: 'EnterpriseCertificationForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    certificateType: String
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
        switch (this.certificateType) {
          case 'ENTERPRISE':
            return '查看企业合规性详情'
          case 'PERSONAL':
            return '查看岗位人员特证详情'
          case 'EQUIPMENT':
            return '查看设备证照详情'
        }
      } else if (this.id) {
        switch (this.certificateType) {
          case 'ENTERPRISE':
            return '编辑企业合规性'
          case 'PERSONAL':
            return '编辑岗位人员特证'
          case 'EQUIPMENT':
            return '编辑设备证照'
        }
      } else {
        switch (this.certificateType) {
          case 'ENTERPRISE':
            return '新增企业合规性'
          case 'PERSONAL':
            return '新增岗位人员特证'
          case 'EQUIPMENT':
            return '新增设备证照'
        }
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

      const data = Object.assign({ certificateType: this.certificateType }, clone(formData))

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
