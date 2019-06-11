<template>
  <form-dialog :visible.sync="visible"
    title="重置密码"
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
  { name: 'newPassword', label: '新密码', inputType: 'password', placeholder: '6～13位字母、数字、字符' },
  { name: 'confirmPassword', label: '确认密码', inputType: 'password', placeholder: '请再次输入新密码' }
]

const formRules = {
  newPassword: [
    { required: true, message: '请填写新密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ]
}

export default {
  name: 'ChangePasswordForm',

  components: {
    FormDialog,
    SimpleForm
  },

  data() {
    const confirmPasswordValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.$refs.form.formData.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      loading: false,
      id: null,
      formSchema,
      formRules: Object.assign({
        confirmPassword: { validator: confirmPasswordValidator, trigger: 'blur' }
      }, formRules)
    }
  },

  methods: {
    ...mapActions('adminUser', ['update']),

    show(id) {
      this.id = id
      this.visible = true
    },

    handleDialogClose() {
      this.$refs.form.reset()
      this.formSchema = formSchema.map(clone)
    },

    handleDialogSubmit() {
      this.$refs.form.submit()
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true
      await this.update({
        id: this.id,
        formData: { password: formData.confirmPassword }
      })

      this.loading = false
      this.visible = false
    }
  }
}
</script>
