<template>
  <el-dialog :visible.sync="visible"
    title="导入风险辨识评估"
    width="600px">
    <div class="import-form"
      v-loading="submiting"
      element-loading-text="正在导入...">
      <el-form ref="form"
        :model="formData"
        :rules="formRules"
        size="medium">
        <ul>
          <li>
            <div class="label">
              请按照数据模板的格式准备要导入的数据
            </div>
            <div class="content">
              <p>
                <a href="http://shuangkong.oss-cn-qingdao.aliyuncs.com/%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3%E6%96%87%E4%BB%B6/1535183921769/%E9%A3%8E%E9%99%A9%E8%BE%A8%E8%AF%86%E8%AF%84%E4%BC%B0%E8%A1%A8%EF%BC%88JHA%2BLEC%EF%BC%89%E5%8F%8A%E9%9A%90%E6%82%A3%E6%8E%92%E6%9F%A5%E6%B8%85%E5%8D%95.docx" target="_blank">下载《风险辨识评估表（JHA+LEC）模版.docx》</a>
              </p>
              <a href="https://shuangkong.oss-cn-qingdao.aliyuncs.com/%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3%E6%96%87%E4%BB%B6/1535183308658/%E5%AE%89%E5%85%A8%E6%A3%80%E6%9F%A5%E8%BE%A8%E8%AF%86%E8%A1%A8%EF%BC%88SCL%EF%BC%89.docx" target="_blank">
                下载《安全检查辨识表（SCL+LS）模版.docx》
              </a>
            </div>
          </li>
          <li>
            <div class="label">
              选择导入模板类型
            </div>
            <div class="content">
              <el-form-item prop="type">
                <el-select placeholder="请选择"
                  v-model="formData.type"
                  :clearable="true"
                  style="width: 400px;">
                  <el-option v-for="(template, index) in templateSelectOptions"
                    :key="index"
                    :label="template.name"
                    :value="template.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </li>
          <li>
            <div class="label">选择需要导入的excel文件</div>
            <div class="content">
              <el-form-item prop="file">
                <el-upload class="upload"
                  :action="importURL"
                  :headers="importHeaders"
                  :data="{ type: formData.type, companyId: enterpriseId }"
                  :multiple="false"
                  :file-list="formData.file"
                  :auto-upload="false"
                  :on-change="handleUploadChange"
                  :on-success="handleUploadSuccess"
                  ref="uploader">
                  <el-button size="medium">添加文件</el-button>
                </el-upload>
              </el-form-item>
            </div>
          </li>
        </ul>
      </el-form>
    </div>

    <template slot="footer">
      <div class="form-buttons">
        <el-button type="primary"
          :loading="submiting"
          @click.prevent="submit">
          保存
        </el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getAPIBaseURL } from '@/modules/utils'
import { getSession } from '@/modules/authentication'

export default {
  name: 'RiskAssessmentImportForm',

  props: {
    enterpriseId: Number
  },

  data() {
    return {
      visible: false,
      submiting: false,
      templateSelectOptions: [
        { name: '风险辨识评估表（JHA+LEC）', value: 'JHA' },
        { name: '风险辨识评估表（SCL+LS）', value: 'SCL' }
      ],
      formData: {
        type: null,
        file: []
      },
      formRules: {
        type: { required: true, message: '请选择导入模板类型', trigger: 'change' },
        file: { required: true, message: '请选择文件', trigger: 'change' }
      }
    }
  },

  computed: {
    importURL() {
      return `${getAPIBaseURL()}/api/v1/coRiskAssessment/wordImport`
    },

    importHeaders() {
      return {
        'Authorization': getSession().token
      }
    }
  },

  methods: {
    show() {
      this.visible = true
    },

    handleUploadChange(file) {
      this.formData.file = [file]
    },

    handleUploadSuccess(response, file) {
      this.submiting = false

      if (response.status === 0) {
        this.$message({
          message: '数据导入成功',
          type: 'success'
        })

        this.visible = false
        this.$emit('import-success')
      } else {
        file.status = 'ready'
        this.$alert(response.msg, '提示', { type: 'error' })
      }
    },

    async submit() {
      try {
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.submiting = true
          this.$refs.uploader.submit()
        }
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.import-form {
  font-size: 14px;

  ul {
    list-style: decimal;
    margin: 0 20px;
    padding: 0;

    li:not(:last-child) {
      margin-bottom: 30px;
    }
  }

  .label {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .content {
    a {
      color: #37A9FA;
      text-decoration: none;
    }
  }
}
</style>

