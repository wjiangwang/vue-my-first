<template>
  <form-dialog :visible.sync="visible"
    :title="id ? '编辑二级项' : '新增二级项'"
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
  { name: 'twoCoding', label: '二级编码', inputType: 'string' },
  { name: 'name', label: '二级子项', inputType: 'string' }
]

const formRules = {
  twoCoding: { required: true, message: '请填写二级编码', trigger: 'blur' },
  name: { required: true, message: '请填写二级子项', trigger: 'blur' }
}

export default {
  name: 'RiskAssessmentSecondItemForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    riskId: Number,
    type: String
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
    ...mapActions('riskSecondItem', ['create', 'load', 'update']),

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

      const data = Object.assign({
        riskAssessmentId: this.riskId,
        identifyRiskType: this.type
      }, clone(formData))

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
