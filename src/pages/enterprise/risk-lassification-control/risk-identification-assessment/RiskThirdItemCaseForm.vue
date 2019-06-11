<template>
  <form-dialog :visible.sync="visible"
    title="示例图片"
    @close="handleDialogClose"
    @submit="handleDialogSubmit"
    :show-buttons="!isRedirect">
    <simple-form label-width="100px"
      :form-schema="formSchema"
      :form-rules="formRules"
      ref="form"
      :disabled="!canEdit || isRedirect"
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
  { name: 'threeCoding', label: '三级编码', inputType: 'string', disabled: true },
  { name: 'name', label: '三级子项', inputType: 'string', disabled: true },
  { name: 'caseUrl', label: '图片', inputType: 'attachment', image: true }
]

const formRules = {
  caseUrl: { required: true, message: '请上传示例图片', trigger: 'change' }
}

export default {
  name: 'RiskThirdItemCaseForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    canEdit: Boolean,
    isRedirect: Boolean
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
    ...mapActions('enterpriseRiskThirdItem', ['updateCase']),

    show(item) {
      this.id = item.id
      this.visible = true
      this.formSchema = formSchema.map(input => {
        return Object.assign({ value: item[input.name] }, input)
      })
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
      await this.updateCase({ id: this.id, formData })

      this.loading = false
      this.visible = false
    }
  }
}
</script>
