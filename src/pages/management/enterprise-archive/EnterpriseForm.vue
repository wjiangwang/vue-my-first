<template>
  <div class="page">
    <breadcrumb :items="breadcrumbItems"></breadcrumb>

    <div class="page-main">
      <page-card>
        <simple-form label-width="120px"
          form-width="680px"
          :form-schema="formSchema"
          :form-rules="formRules"
          ref="form"
          @submit="submitForm">
        </simple-form>

        <template slot="footer">
          <div class="form-buttons">
            <el-button type="primary" @click.prevent.stop="form.submit()">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </div>
        </template>
      </page-card>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { mapActions } from 'vuex'
import enterpriseDistrictMixin from '@/mixins/enterprise-district-mixin'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'
import SimpleForm from '@/components/SimpleForm'

const formSchema = [
  { name: 'enterpriseName', label: '企业名称', inputType: 'string' },
  { name: 'account', label: '管理员账号', inputType: 'string' },
  { name: 'shortName', label: '企业简称', inputType: 'string' },
  { name: 'corpdeleg', label: '法人代表', inputType: 'string' },
  { name: 'orgCode', label: '统一信用代码', inputType: 'string' },
  { name: 'label', label: '标签', inputType: 'resource', resourceName: 'label', allowCreate: true },
  { name: 'enterpriseGrade', label: '企业类型', inputType: 'resource', resourceName: 'enterpriseType' },
  { name: 'administrativeAffiliation', label: '行政隶属关系', inputType: 'resource', resourceName: 'administrativeAffiliation' },
  { name: 'nationalEconomy', label: '国民经济行业', inputType: 'cascader', resourceName: 'nationalEconomy' },
  { name: 'economicType', label: '经济类型', inputType: 'resource', resourceName: 'economicType' },
  { name: 'enterpriseScale', label: '企业规模', inputType: 'resource', resourceName: 'enterpriseCrossType' },
  { name: 'isFourCompanies', label: '四上企业', inputType: 'boolean' },
  { name: 'scaleAbove', label: '规模以上', inputType: 'boolean' },
  { name: 'areaCode', label: '区域', inputType: 'district', valueProp: 'code' },
  { name: 'address', label: '单位地址', inputType: 'string' },
  { name: 'location', label: '地理位置', inputType: 'location' }
]

const formRules = {
  enterpriseName: { required: true, message: '请输入企业名称', trigger: 'blur' },
  account: { required: true, message: '请输入管理员账号', trigger: 'blur' },
  shortName: { required: true, message: '请输入企业简称', trigger: 'blur' },
  corpdeleg: { required: true, message: '请输入法人代表', trigger: 'blur' },
  orgCode: { required: true, message: '请输入统一信用代码', trigger: 'blur' },
  areaCode: { required: true, message: '请选择区域', trigger: 'blur' },
  address: { required: true, message: '请填写地址', trigger: 'blur' },
  location: { required: true, message: '请选择地理位置', trigger: 'blur' }
}

export default {
  name: 'EnterpriseForm',

  components: {
    Breadcrumb,
    PageCard,
    SimpleForm
  },

  props: {
    isGroup: {
      type: Boolean,
      default: false
    }
  },

  mixins: [enterpriseDistrictMixin],

  data() {
    return {
      loading: false,
      formSchema: formSchema,
      formRules: formRules
    }
  },

  computed: {
    form() {
      return this.$refs.form
    },

    breadcrumbItems() {
      return [
        this.isGroup ? { name: '一企一档', route: { name: 'enterprise-archive' } } : { name: '一企一档', route: { name: 'enterprise-archives' } },
        { name: '新增企业' }
      ]
    }
  },

  methods: {
    ...mapActions('enterprise', ['create']),

    async submitForm(formData) {
      if (this.loading) return

      this.loading = true

      const data = cloneDeep(formData)
      data.longitude = data.location.longitude
      data.latitude = data.location.latitude

      const result = await this.create(data)
      this.loading = false

      if (result.status === 0) this.$router.go(-1)
    }
  }
}
</script>
