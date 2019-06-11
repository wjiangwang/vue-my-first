<template>
  <form-dialog :visible.sync="visible"
    :title="id ? '编辑部门' : '新增部门'"
    :append-to-body="true"
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
  { name: 'name', label: '部门名称', inputType: 'string' },
  { name: 'parentId', label: '父级部门', inputType: 'select', collection: [] },
  { name: 'description', label: '部门描述', inputType: 'text' }
]

const formRules = {
  name: { required: true, message: '请填写部门名称', trigger: 'blur' },
  parentId: { required: true, message: '请选择父级部门', trigger: 'change' }
}

export default {
  name: 'EnterpriseDepartmentForm',

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
      formSchema,
      formRules
    }
  },

  methods: {
    ...mapActions('enterpriseDepartment', [
      'create', 'load', 'update', 'loadParentList'
    ]),

    async show(id) {
      this.id = id
      this.visible = true
      
      this.loading = true
      if (this.id) await this.loadFormData()
      
      await this.updateParentSelectCollection()
      this.loading = false
    },

    async updateParentSelectCollection() {
      const result =
        await this.loadParentList({ enterpriseId: this.enterpriseId })
      
      const input = this.formSchema.find(input => input.name === 'parentId')
      input.collection = result.map(item => ({
        label: item.name,
        value: item.id || 0
      }))
    },

    handleDialogClose() {
      this.$refs.form.reset()
      this.formSchema = formSchema.map(clone)
    },

    handleDialogSubmit() {
      this.$refs.form.submit()
    },

    async loadFormData() {
      const result = await this.load(this.id)

      this.formSchema = formSchema.map(item => {
        item = clone(item)
        item.value = result[item.name]
        return item
      })
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true

      if (this.id) {
        await this.update({ id: this.id, formData })
      } else {
        await this.create(Object.assign({ companyId: this.enterpriseId }, formData))
      }
      
      this.loading = false
      this.visible = false
    }
  }
}
</script>
