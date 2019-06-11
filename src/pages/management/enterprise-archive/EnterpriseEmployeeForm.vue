<template>
  <form-dialog :visible.sync="visible"
    :title="title"
    :show-buttons="!readonly"
    width="820px"
    @close="handleDialogClose"
    @submit="handleDialogSubmit">
    <simple-form label-width="130px"
      :form-schema="formSchema"
      :form-rules="formRules"
      :disabled="readonly"
      size="small"
      formWidth="99%"
      ref="form"
      class="employee-form"
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
  { name: 'headImg', label: '头像', inputType: 'attachment', multiple: false, image: true },
  { name: 'name', label: '姓名', inputType: 'string' },
  {
    name: 'sex', label: '性别', inputType: 'radio',
    collection: [{ label: '男', value: '男' }, { label: '女', value: '女' }]
  },
  { name: 'national', label: '民族', inputType: 'resource', resourceName: 'national' },
  { name: 'age', label: '年龄', inputType: 'number' },
  { name: 'nativePlace', label: '籍贯', inputType: 'string' },
  { name: 'education', label: '学历', inputType: 'resource', resourceName: 'educationBackground' },
  { name: 'attributionDepartment', label: '归属部门', inputType: 'enterprise-department' },
  { name: 'duty', label: '职务', inputType: 'resource', resourceName: 'companyPosition', allowCreate: true },
  { name: 'entryDate', label: '入职时间', inputType: 'date' },
  { name: 'idNo', label: '身份证号', inputType: 'string' },
  { name: 'politicsStatus', label: '政治面貌', inputType: 'resource', resourceName: 'politicalLandscape' },
  { name: 'birthDate', label: '出生日期', inputType: 'date' },
  { name: 'schoolGraduation', label: '毕业学校', inputType: 'string' },
  { name: 'cellphone', label: '手机号码', inputType: 'string' },
  { name: 'jobNumber', label: '工号', inputType: 'string' },
  { name: 'jobDate', label: '参工日期', inputType: 'date' },
  { name: 'dutyName', label: '职称', inputType: 'resource', resourceName: 'titleManagement' },
  { name: 'status', label: '状态', inputType: 'resource', resourceName: 'companyStatus' },
  { name: 'personalEmail', label: '个人邮箱', inputType: 'string' },
  { name: 'qqNum', label: 'QQ号码', inputType: 'string' },
  { name: 'maritalStatus', label: '婚姻状况', inputType: 'resource', resourceName: 'maritalStatus' },
  { name: 'houseAddress', label: '家庭住址', inputType: 'string' },
  { name: 'houseLinkman', label: '家庭联系人', inputType: 'string' },
  { name: 'housePhone', label: '家庭电话', inputType: 'string' },
  {
    name: 'isSanwuPerson', label: '是否是三无人员', inputType: 'radio',
    collection: [{ label: '是', value: 1 }, { label: '否', value: 0 }]
  }
]

const formRules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' }
}

export default {
  name: 'EnterpriseEmployeeForm',

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
      readonly: false,
      formSchema: formSchema.map(input => {
        const newInput = Object.assign({}, input)

        if (newInput.inputType === 'enterprise-department') {
          if (this.enterpriseId) {
            newInput.enterpriseId = this.enterpriseId
          } else {
            newInput.inputType = 'string'
          }
        }

        return newInput
      }),
      formRules
    }
  },

  computed: {
    title() {
      if (this.id && this.readonly) {
        return '查看企业人员信息'
      } else if (this.id) {
        return '编辑企业人员信息'
      } else {
        return '新增企业人员信息'
      }
    }
  },

  methods: {
    ...mapActions('enterpriseEmployee', ['create', 'load', 'update']),

    show({ id, readonly = false } = {}) {
      this.id = id
      this.readonly = readonly
      this.visible = true

      if (this.id) this.loadFormData()
    },

    handleDialogClose() {
      this.$refs.form.reset()
      this.formSchema = formSchema.map(input => {
        const newInput = Object.assign({}, input)

        if (newInput.inputType === 'enterprise-department') {
          if (this.enterpriseId) {
            newInput.enterpriseId = this.enterpriseId
          } else {
            newInput.inputType = 'string'
          }
        }

        return newInput
      })
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

      const data = Object.assign({ companyId: this.enterpriseId }, clone(formData))

      if (this.id) {
        await this.update({id: this.id, formData: data })
      } else {
        await this.create(data)
      }

      this.loading = false
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-form {
  display: flex;
  flex-wrap: wrap;

  /deep/ .el-form-item {
    width: 50%;
    &:first-child {
      width: 100%;
    }
  }
}
</style>

