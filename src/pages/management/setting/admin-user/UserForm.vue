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
import pick from 'lodash/pick'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'

const formSchema = [
  { name: 'account', label: '账号', inputType: 'string' },
  { name: 'password', label: '密码', inputType: 'string' },
  { name: 'nickname', label: '昵称', inputType: 'string' },
  { name: 'telephone', label: '手机', inputType: 'string' },
  { name: 'email', label: '邮箱', inputType: 'string' },
  { name: 'roleId', label: '角色', inputType: 'resource', resourceName: 'sysRole', valueProp: 'value' },
  { name: 'riskDistrictId', label: '区域', inputType: 'district', selectAny: true },
  { name: 'status', label: '启用', inputType: 'boolean', value: 1 }
]

const formRules = {
  account: { required: true, message: '请填写账号', trigger: 'blur' },
  password: { required: true, message: '请填写密码', trigger: 'blur' },
  nickname: { required: true, message: '请填写昵称', trigger: 'blur' },
  roleId: { required: true, message: '请选择角色', trigger: 'change' },
  riskDistrictId: { required: true, message: '请选择区域', trigger: 'change' }
}

export default {
  name: 'AdminUserForm',

  components: {
    FormDialog,
    SimpleForm
  },

  data() {
    return {
      visible: false,
      loading: false,
      id: null,
      formSchema
    }
  },

  computed: {
    formRules() {
      if (this.id) {
        return pick(formRules, ['account', 'nickname', 'roleId', 'riskDistrictId'])
      } else {
        return formRules
      }
    }
  },

  methods: {
    ...mapActions('adminUser', ['create', 'load', 'update']),

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
        if (item.name === 'password') return

        item = clone(item)
        item.value = result[item.name]
        return item
      }).filter(item => !!item)

      this.loading = false
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true

      if (this.id) {
        await this.update({id: this.id, formData })
      } else {
        await this.create(formData)
      }

      this.loading = false
      this.visible = false
    }
  }
}
</script>
