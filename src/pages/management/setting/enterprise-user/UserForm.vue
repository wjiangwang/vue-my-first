<template>
  <form-dialog :visible.sync="visible"
    :title="id ? '编辑人员' : '新增人员'"
    @close="handleDialogClose"
    @submit="handleDialogSubmit">
    <simple-form label-width="100px"
      :form-schema="formSchema"
      :form-rules="formRules"
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
  { name: 'account', label: '账号', inputType: 'string' },
  { name: 'password', label: '密码', inputType: 'string' },
  { name: 'nickname', label: '昵称', inputType: 'string' },
  { name: 'telephone', label: '手机', inputType: 'string' },
  { name: 'email', label: '邮箱', inputType: 'string' },
  // { name: 'controlLevelId', label: '级别', inputType: 'resource', resourceName: 'sysControlLevel', valueProp: 'value' },
  { name: 'status', label: '启用', inputType: 'boolean', value: 1 }
]

const formRules = {
  account: { required: true, message: '请填写账号', trigger: 'blur' },
  password: { required: true, message: '请填写密码', trigger: 'blur' },
  nickname: { required: true, message: '请填写昵称', trigger: 'blur' },
  // controlLevelId: { required: true, message: '请选择级别', trigger: 'change' }
}

export default {
  name: 'EnterpriseUserForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    enterpriseId: {
      type: Number,
      required: true
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
    ...mapActions('enterpriseUser', ['create', 'load', 'update']),

    show(id) {
      this.id = id
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
      formData.controlLevelId = ''
      if (this.loading) return

      this.loading = true

      if (this.id) {
        await this.update({id: this.id, formData })
      } else {
        await this.create(Object.assign({ companyId: this.enterpriseId }, formData))
      }

      this.loading = false
      this.visible = false
    }
  }
}
</script>
