<template>
  <form-dialog :visible.sync="visible"
    :title="id ? '编辑角色' : '新增角色'"
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
  { name: 'name', label: '角色名称', inputType: 'string' }
]

const formRules = {
  name: { required: true, message: '请填写角色名称', trigger: 'blur' }
}

export default {
  name: 'AdminRoleForm',

  components: {
    FormDialog,
    SimpleForm
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
    ...mapActions('adminRole', ['create', 'load', 'update']),

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
      if (this.loading) return

      this.loading = true

      if (this.id) {
        await this.update({ id: this.id, formData })
      } else {
        await this.create(formData)
      }
      
      this.loading = false
      this.visible = false
    }
  }
}
</script>
