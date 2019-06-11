<template>
  <form-dialog :visible.sync="visible"
    :title="id ? '编辑实时风险辨识评估' : '新增实时风险辨识评估'"
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
  { name: 'twoCoding', label: '二级编码', inputType: 'string' },
  { name: 'name', label: '作业类型', inputType: 'string' }
]

const formRules = {
  name: { required: true, message: '请输入作业类型', trigger: 'blur' }
}

export default {
  name: 'RealTimeRiskForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
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
    ...mapActions('realTimeRisk', ['load', 'update']),

    show(id) {
      this.id = id
      this.visible = true

      this.formSchema = this.formSchema.map(input => {
        if (input.name === 'twoCoding')
          input.disabled = true

        return input
      })

      if (this.id) {
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

      if (this.id) {
        await this.update({ id: this.id, formData: formData })
      } else {
        await this.create(formData)
      }

      this.loading = false
      this.visible = false
    }
  }
}
</script>
