<template>
  <div class="enterprise-info">
    <div class="form-wrapper" v-loading="loading">
      <el-form label-suffix=":"
        label-width="140px"
        ref="form"
        :model="formData"
        size="small"
        :disabled="!canEdit || isRedirect">
        <div class="basic-info-fields">
          <component v-for="input in basicInfoFormSchema"
            :key="input.name"
            :is="`${input.inputType}-input`"
            :value="formData[input.name]"
            v-bind="input"
            @input="formData[input.name] = $event">
          </component>
        </div>

        <div class="text-fields">
          <component v-for="input in textFormSchema"
            :key="input.name"
            :is="`${input.inputType}-input`"
            :value="formData[input.name]"
            v-bind="input"
            @input="formData[input.name] = $event">
          </component>
        </div>

        <div class="contact-fields">
          <div class="section"
            v-for="(section, index) in contactFormSchema"
            :key="index">
            <div class="section-name">{{section.label}}</div>

            <div class="section-fields">
              <component v-for="input in section.schema"
                :key="input.name"
                :is="`${input.inputType}-input`"
                :value="formData[input.name]"
                v-bind="input"
                @input="formData[input.name] = $event">
              </component>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <div class="form-buttons" v-if="canEdit && !isRedirect">
      <el-button type="primary" size="medium" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import cloneDeep from 'lodash/cloneDeep'
  import { MessageBox } from 'element-ui'
  import ScrollView from '@/components/ScrollView'
  import enterpriseDistrictMixin from '@/mixins/enterprise-district-mixin'

  const basicInfoFormSchema = [
    { name: 'enterpriseName', label: '企业名称', inputType: 'string' },
    { name: 'areaCode', label: '归属地区', inputType: 'district', valueProp: 'code' },
    { name: 'areaCodeValue', label: '区域编号', inputType: 'string', readonly: true },
    { name: 'shortName', label: '企业简称', inputType: 'string' },
    { name: 'industryCategories', label: '行业类别', inputType: 'resource', resourceName: 'industryCategories' },
    { name: 'state', label: '企业状态', inputType: 'string' },
    { name: 'orgCode', label: '组织机构代码', inputType: 'string' },
    { name: 'address', label: '单位地址', inputType: 'string' },
    { name: 'economicType', label: '经济类型', inputType: 'resource', resourceName: 'economicType' },
    { name: 'nationalEconomy', label: '国民经济行业', inputType: 'cascader', resourceName: 'nationalEconomy' },
    { name: 'enterpriseScale', label: '企业规模', inputType: 'resource', resourceName: 'enterpriseCrossType' },
    { name: 'enterpriseGrade', label: '企业类型', inputType: 'resource', resourceName: 'enterpriseType', allowCreate: true },
    { name: 'administrativeAffiliation', label: '行政隶属关系', inputType: 'resource', resourceName: 'administrativeAffiliation' },
    { name: 'industrialCode', label: '工商编码', inputType: 'string' },
    { name: 'dealInAcrage', label: '生产经营面积', inputType: 'string' },
    { name: 'employeeNum', label: '从业人数', inputType: 'number' },
    { name: 'registerDate', label: '注册时间', inputType: 'date' },
    { name: 'label', label: '标签', inputType: 'resource', resourceName: 'label', allowCreate: true },
    { name: 'recordsProveNum', label: '备案证明编号', inputType: 'string' },
    { name: 'location', label: '地理位置', inputType: 'location' },
    { name: 'isMajorHazard', label: '是否有重大危险源', inputType: 'radio', collection: [{ label: '否', value: 0 }, { label: '是', value: 1 }], value: 0 }
  ]

  const textFormSchema = [
    { name: 'recordsProveDescribe', label: '备案证明编号描述', inputType: 'text' },
    { name: 'wordRange', label: '经营范围', inputType: 'text' },
    { name: 'enterpriseRemark', label: '企业备注', inputType: 'text' },
    { name: 'mainProduct', label: '主要产品', inputType: 'text' },
    { name: 'emergencyResponse', label: '应急预案', inputType: 'text' }
  ]

  const contactFormSchema = [
    {
      label: '法定代表信息',
      schema: [
        { name: 'corpdeleg', label: '代表人', inputType: 'string' },
        { name: 'corpdelegMpho', label: '移动电话', inputType: 'string' },
        { name: 'corpdelegPho', label: '固定电话', inputType: 'string' },
        { name: 'corpdelegEmail', label: '邮箱', inputType: 'string' },
        { name: 'corpdelegFax', label: '传真', inputType: 'string' }
      ]
    },
    {
      label: '企业负责人信息',
      schema: [
        { name: 'enterprinc', label: '负责人', inputType: 'string' },
        { name: 'principalMpho', label: '移动电话', inputType: 'string' },
        { name: 'principalPho', label: '固定电话', inputType: 'string' },
        { name: 'principalEmail', label: '邮箱', inputType: 'string' },
        { name: 'principalFax', label: '传真', inputType: 'string' }
      ]
    },
    {
      label: '企业联系人信息',
      schema: [
        { name: 'linkMan', label: '联系人', inputType: 'string' },
        { name: 'linkManPho', label: '移动电话', inputType: 'string' },
        { name: 'linkManMpho', label: '固定电话', inputType: 'string' },
        { name: 'linkManEmail', label: '邮箱', inputType: 'string' },
        { name: 'linkManFax', label: '传真', inputType: 'string' }
      ]
    }
  ]

  export default {
    name: 'EnterpriseInfo',

    components: {
      ScrollView
    },

    props: {
      canEdit: {
        type: Boolean,
        default: true
      },
      isRedirect: {
        type: Boolean,
        default: false
      }
    },

    mixins: [enterpriseDistrictMixin],

    data() {
      return {
        loading: false,

        basicInfoFormSchema: this.canEdit ? basicInfoFormSchema : basicInfoFormSchema.map(input => {
          let inputType = input.inputType
          if (inputType === 'resource') inputType = 'string'

          return Object.assign({}, input, { inputType })
        }),
        textFormSchema,
        contactFormSchema,

        formData: {},
        enterpriseId: ''
      }
    },

    methods: {
      ...mapActions('enterprise', ['load', 'update']),

      async getLoad () {
        let result = await this.load(this.$route.params.id)
        if (this.canEdit) result = result.coCompanyInfo ? result.coCompanyInfo : result
        if (!result.coCompanyInfo) {
          this.enterpriseId = result.id
        }
        basicInfoFormSchema.forEach(({ name }) => {
          if (name === 'location') {
            this.$set(this.formData, 'location', {
              longitude: result.longitude,
              latitude: result.latitude,
              address: result.address
            })
          } else if (name === 'areaCodeValue') {
            this.$set(this.formData, 'areaCodeValue', result['areaCode'])
          } else {
            this.$set(this.formData, name, result[name])
          }
        })

        textFormSchema.forEach(({ name }) => {
          this.$set(this.formData, name, result[name])
        })

        contactFormSchema.forEach(item => {
          item.schema.forEach(({ name }) => {
            this.$set(this.formData, name, result[name])
          })
        })
      },

      async submitForm() {
        try {
          const valid = await this.$refs.form.validate()
          if (valid) {
            this.loading = true
            const formData = cloneDeep(this.formData)
            if (formData.location) {
              formData.longitude = formData.location.longitude
              formData.latitude = formData.location.latitude
            }
            if (!formData.longitude && !formData.latitude) {
              return this.error('请选择地理位置')
            }
            if (!formData.label) {
              return this.error('请选择标签')
            }
            const result = await this.update({ id: this.$route.params.id ? this.$route.params.id : this.enterpriseId, formData })

            this.loading = false
            if (result && result.status === 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              if (this.$route.params.id) this.$parent.$parent.loadData()
              else this.getLoad()
            }
          }
        } catch (error) {}
      },

      error (m) {
        this.loading = false
        MessageBox.alert(m)
      }
    },

    created() {
      this.loading = true

      this.getLoad()

      this.loading = false
    },

    updated() {
      this.ready = true
    },

    watch: {
      ['formData.areaCode'](val) {
        if (!this.ready) return
        this.$set(this.formData, 'areaCodeValue', val)
      }
    }
  }
</script>

<style lang="scss" scoped>
.page-main {
  flex: none;
}

.enterprise-info {
  .form-wrapper {
    padding: 0 20px 20px;

    .basic-info-fields,
    .contact-fields .section-fields {
      display: flex;
      flex-wrap: wrap;

      /deep/ .el-form-item {
        width: 30%;
      }
    }

    .text-fields {
      display: flex;
      flex-wrap: wrap;
      background: #f5f5f5;
      padding: 20px;
      margin: 0 -20px;

      /deep/ .el-form-item {
        &:not(:last-child) {
          width: 45%;
        }

        &:last-child {
          width: calc(90% + 50px);
        }

        &:nth-child(2n + 1) {
          margin-right: 50px;
        }

        .el-form-item__label {
          text-align: left;
        }

        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }

    .contact-fields {
      .section:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }

      .section-name {
        font-size: 16px;
        line-height: 21px;
        margin: 20px 0;
      }
    }
  }
}
</style>
