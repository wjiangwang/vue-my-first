<template>
  <form-dialog :visible.sync="visible"
    :title="id ? `编辑${hierarchyName}` : `新增${hierarchyName}`"
    @closed="handleDialogClosed"
    @submit="handleDialogSubmit">
    <simple-form label-width="100px"
      :form-schema="formSchema"
      :form-rules="formRules"
      ref="form"
      @submit="submitForm"
      v-loading="loading"
      v-if="formShow">
    </simple-form>
  </form-dialog>
</template>

<script>
import clone from 'lodash/clone'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'

export default {
  name: 'HierarchyJobForm',

  components: {
    FormDialog,
    SimpleForm
  },

  props: {
    hierarchy: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      visible: false,
      loading: false,
      formShow: false,
      id: null,
      name: null,
      structureType: 1
    }
  },

  computed: {
    hierarchyName() {
      switch (this.hierarchy) {
      case 1:
        return '岗位'
      case 2:
        return '班组'
      case 3:
        return '部门'
      case 4:
        return '公司'
      }
    },

    formSchema() {
      return [
        { name: 'name', label: `${this.hierarchyName}名称`, inputType: 'string', value: this.name },
        {
          name: 'structureType', label: '管控类型', inputType: 'radio', value: this.structureType,
          collection: [{ label: '定时管控', value: 1 }, { label: '实时管控', value: 2 }]
        }
      ]
    },

    formRules() {
      return {
        name: { required: true, message: `请填写${this.hierarchyName}名称`, trigger: 'blur' }
      }
    }
  },

  methods: {
    ...mapActions('hierarchyJob', ['create', 'update']),

    show(job = {}) {
      this.visible = true
      this.formShow = true

      this.id = job.id
      this.name = job.name
      this.structureType = job.structureType || 1
    },

    handleDialogClosed() {
      this.formShow = false
    },

    handleDialogSubmit() {
      this.$refs.form.submit()
    },

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true
      if (this.id) {
        await this.update({ id: this.id, formData })
        this.$emit('updated')
      } else {
        await this.create({ formData, hierarchy: this.hierarchy })
      }

      this.loading = false
      this.visible = false
    }
  }
}
</script>
