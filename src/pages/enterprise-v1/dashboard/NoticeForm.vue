<template>
  <form-dialog :visible.sync="visible"
    title="更改部分描述"
    :append-to-body="true"
    @close="handleDialogClose"
    @closed="reload = false"
    @submit="handleDialogSubmit">
    <simple-form label-width="100px"
      :form-schema="formSchema"
      :form-rules="formRules"
      ref="form"
      @submit="submitForm"
      v-loading="loading"
      v-if="reload">
    </simple-form>
  </form-dialog>
</template>

<script>
import clone from 'lodash/clone'
import { mapState, mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'

const formSchema = [
  { name: 'remarkOne', label: '修改描述1', inputType: 'text' },
  { name: 'remarkTwo', label: '修改描述2', inputType: 'text' }
]

export default {
  name: 'NoticeForm',

  components: {
    FormDialog,
    SimpleForm
  },

  data() {
    return {
      formRules: {
        remarkOne: { required: true, message: '请填写描述1', trigger: 'blur' },
        remarkTwo: { required: true, message: '请填写描述2', trigger: 'blur' }
      },

      visible: false,
      loading: false,
      reload: false
    }
  },

  computed: {
    ...mapState('dashboardNotice', ['notice']),

    formSchema() {
      return clone(formSchema).map(input => {
        input.value = this.notice[input.name]
        return input
      })
    }
  },

  methods: {
    ...mapActions('dashboardNotice', ['load', 'update']),

    show(id) {
      this.visible = true
      this.reload = true
    },

    handleDialogClose() {
      this.$refs.form.reset()
    },

    handleDialogSubmit() {
      this.$refs.form.submit()
    },

    async submitForm(formData) {
      this.loading = true
      await this.update({ id: this.notice.id, formData })
      
      this.loading = false
      this.visible = false
    }
  }
}
</script>

