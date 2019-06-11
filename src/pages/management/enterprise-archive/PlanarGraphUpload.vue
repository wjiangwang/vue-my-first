<template>
  <form-dialog :visible.sync="visible"
    title="上传平面图"
    width="600px"
    @close="handleDialogClose"
    @submit="handleDialogSubmit">
    <simple-form label-width="130px"
      :form-schema="formSchema"
      size="small"
      formWidth="99%"
      ref="form"
      class="planar-graph-form"
      @submit="submitForm"
      v-loading="loading">
    </simple-form>
  </form-dialog>
</template>

<script>
import clone from 'lodash/clone'
import { mapState, mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'

const formSchema = [
  { name: 'url', label: '黑线平面图', inputType: 'attachment', multiple: false, image: true, filedir: 'map-images' },
  { name: 'blackUrl', label: '白线平面图', inputType: 'attachment', multiple: false, image: true, filedir: 'map-images' }
]

export default {
  name: 'PlanarGraphUpload',

  components: {
    FormDialog,
    SimpleForm
  },

  data() {
    return {
      visible: false,
      loading: false,
      formSchema: clone(formSchema)
    }
  },

  computed: {
    ...mapState('enterpriseRiskGraph', ['planarGraph'])
  },

  methods: {
    ...mapActions('enterpriseRiskGraph', ['savePlanarGraph']),

    show() {
      this.visible = true
      this.formSchema = clone(formSchema).map(input => {
        input.value = this.planarGraph && this.planarGraph[input.name]
        return input
      })
    },

    handleDialogClose() {
      this.$refs.form.reset()
      this.formSchema = clone(formSchema).map(input => {
        input.value = this.planarGraph && this.planarGraph[input.name]
        return input
      })
    },

    handleDialogSubmit() {
      this.$refs.form.submit()
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true
      await this.savePlanarGraph(formData)
      
      this.loading = false
      this.visible = false
    }
  }
}
</script>
