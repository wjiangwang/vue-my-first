<template>
<el-dialog :visible.sync="visible"
  title="导入教育培训问题"
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
            <a href="http://shuangkong.oss-cn-qingdao.aliyuncs.com/%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3%E6%96%87%E4%BB%B6/1547643057491/%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E9%97%AE%E9%A2%98%E6%A8%A1%E6%9D%BF.xls" target="_blank">下载《教育培训资料模版.xls》</a>
          </div>
        </li>
        <li>
          <div class="label">选择需要导入的excel文件</div>
          <div class="content">
            <el-form-item prop="file">
              <el-upload class="upload"
                :action="importURL"
                :headers="importHeaders"
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
      <el-button @click="clear">取消</el-button>
    </div>
  </template>
</el-dialog>
</template>

<script>
import { getAPIBaseURL } from '@/modules/utils'
import { getSession } from '@/modules/authentication'

export default {
  name: 'TrainingImportForm',

  data() {
    return {
      visible: false,
      submiting: false,
      formData: {
        file: []
      },
      formRules: {
        file: { required: true, message: '请选择文件', trigger: 'change' }
      }
    }
  },

  computed: {
    importURL() {
      return `${getAPIBaseURL()}/api/v2/trainingEducation/importTrainingEducationExcel`
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
      this.formData.file=[]
    },

    async submit() {
      try {
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.submiting = true
          this.$refs.uploader.submit()
        }
      } catch (error) {}
    },
    clear(){
      this.visible=false
      this.formData.file=[]
    }
  }
}
</script>

<style lang="scss" scoped>
.import-form {
  font-size: 14px;

  ul {
    list-style: decimal;
    margin: 0 20px 48px;
    padding: 0;

    li {
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

