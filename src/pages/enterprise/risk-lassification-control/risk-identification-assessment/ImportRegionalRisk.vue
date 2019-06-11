<template>
  <el-dialog
    width="30%"
    :title="title"
    :visible.sync="visible"
    append-to-body
    @close="leadInClear()"
    class="inner-dialog"
    v-loading="submiting"
    :element-loading-text="loadingText"
  >
    <div class="outer-dialog-body">
      <el-form label-width="150px" label-suffix="：" ref="form" :model="formData" :rules="formRules">
        <div class="outer-dialog-content" style="margin-right: 54px;">
          <el-form-item prop="file" label="选择excel文件" v-if="type==='leadIn'">
            <el-upload
              class="upload"
              :action="importURL"
              :headers="importHeaders"
              :data="{ startSheetIndex:formData.startSheetIndex, endSheetIndex:formData.endSheetIndex }"
              :multiple="false"
              :file-list="formData.file"
              :auto-upload="false"
              :on-change="handleUploadChange"
              :on-success="handleUploadSuccess"
              :on-remove="handleUploadRemove"
              ref="uploader"
            >
              <el-button size="medium" :type="buttonType">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="file" label="选择excel文件" v-else>
            <el-upload
              class="upload"
              :action="importURL"
              :http-request="uploadSectionFile"
              :multiple="false"
              :file-list="formData.file"
              :auto-upload="false"
              :on-change="handleUploadChange"
              :on-success="handleUploadSuccess"
              :on-remove="handleUploadRemove"
              ref="uploader"
            >
              <el-button size="medium" :type="buttonType">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="选择sheet页码范围" prop="pages">
            <el-input-number
              v-model="formData.startSheetIndex"
              @change="handleStartSheetIndexChange"
              size="small"
              :min="1"
              :max="100"
            ></el-input-number>
            <span style="margin:0 5px">到</span>
            <el-input-number
              v-model="formData.endSheetIndex"
              @change="handleendSheetIndexChange"
              size="small"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.prevent="submit" :loading="submiting">确定</el-button>
      <el-button @click="leadInClear" :loading="submiting">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAPIBaseURL } from '@/modules/utils'
import { getSession } from '@/modules/authentication'
import axios from 'axios'

export default {
  name: 'RiskAssessmentImportForm',

  props: {
    enterpriseId: Number
  },

  data () {
    return {
      type: 'leadIn',
      visible: false,
      submiting: false,
      formData: {
        startSheetIndex: 1,
        endSheetIndex: 1,
        file: []
      },
      formRules: {
        //file: { required: true, message: '请选择文件', trigger: 'change' },
        // pages: { required: true, message: '请填写sheet页范围', trigger: 'change' }
      }
    }
  },

  computed: {
    importURL () {
      return this.type === 'leadIn' ? `${getAPIBaseURL()}/api/v2/regionalRisk/importCoRiskAssessment` : `${getAPIBaseURL()}/api/v2/regionalRisk/checkAccuracy`
    },

    importHeaders () {
      return {
        'Authorization': getSession().token
      }
    },
    title () {
      return this.type === 'leadIn' ? '导入区域风险辨识评估表' : '验证区域风险辨识评估表'
    },
    loadingText () {
      return this.type === 'leadIn' ? '正在导入......' : '正在导入并校验......'
    },
    buttonType () {
      return this.type === 'leadIn' ? 'primary' : 'success'
    }

  },

  methods: {
    show () {
      this.type = 'leadIn'
      this.visible = true
    },

    check () {
      this.type = 'checkXsl'
      this.visible = true

    },

    handleUploadChange (file) {
      this.formData.file = [file]
    },

    handleUploadRemove (file) {
      this.formData.file = []
    },

    handleStartSheetIndexChange () {

    },
    handleendSheetIndexChange () {

    },

    //自定义文件上传
    uploadSectionFile: function (param) {
      let fileObj = param.file

      let form = new FormData()
      form.append("file", fileObj)
      form.append("startSheetIndex", this.formData.startSheetIndex)
      form.append("endSheetIndex", this.formData.endSheetIndex)
      axios.post(
        `/api/v2/regionalRisk/checkAccuracy`, form,
        {
          baseURL: getAPIBaseURL(),
          responseType: 'blob',
          headers: {
            Authorization: getSession().token
          }
        }
      )
        .then(res => {
          this.submiting = false
          this.visible = false
          this.leadInClear()
          let url = window.URL.createObjectURL(res.data)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = res.headers['content-disposition']
            ? decodeURIComponent(
              res.headers['content-disposition'].split('filename=')[1]
            )
            : '检查报告.xls'
          a.click()
          window.URL.revokeObjectURL(url)
        })
        .catch(err => {
          this.submiting = false
          this.$message({
            message: '错误',
            type: 'error'
          })
          this.visible = false
          this.leadInClear()
        })

    },

    handleUploadSuccess (response, file) {
      this.submiting = false
      if (response.status === 0) {
        this.$message({
          message: '数据导入成功',
          type: 'success'
        })

        this.visible = false
        this.$emit('import-success')
        this.leadInClear()
      } else {
        file.status = 'ready'
        this.$alert(response.msg, `${response.msg.split('有误')[0]}有误`, { type: 'error', customClass: 'lead-in-error-msg' })
      }
    },

    async submit () {
      try {
        const valid = await this.$refs.form.validate()
        if (valid) {
          if (!this.formData.file.length) {
            this.$alert('请选择文件！！', '提示', { type: 'error' })
            return false
          }
          if (this.formData.startSheetIndex > this.formData.endSheetIndex) {
            this.$alert('请正确填写页码范围！！', '提示', { type: 'error' })
            return false
          }
          this.submiting = true
          this.$refs.uploader.submit()
        }
      } catch (error) { }
    },

    leadInClear () {
      this.formData = {
        startSheetIndex: 1,
        endSheetIndex: 1,
        file: []
      }
      this.visible = false
      this.submiting = false
    }
  }
}
</script>
<style lang="scss">
.lead-in-error-msg {
  .el-message-box__header {
    .el-message-box__title {
      span {
        color: #f56c6c;
        font-weight: 500;
      }
    }
  }
}
</style>

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
      color: #37a9fa;
      text-decoration: none;
    }
  }
}
</style>

