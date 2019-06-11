<template>
  <div class="drill-summary-dialog-container">
    <el-dialog :title="title" :visible.sync="visible" class="outer-dialog">
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="DrillSummary" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class>
            <el-form-item label="演练名称">
              <el-select
                v-model="DrillSummary.exerciseName"
                placeholder="请选择"
                clearable
                @change="handleDirllName"
              >
                <el-option
                  v-for="item in dirllNameSelect"
                  :key="item.id"
                  :label="item.exerciseTitle"
                  :value="item.exerciseTitle"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="伤亡描述">
              <el-input
                v-model="DrillSummary.casualtiesDescription"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="经济损失（万元）">
              <el-input v-model="DrillSummary.economicLosses"></el-input>
              <!-- <el-select v-model="DrillSummary.economicLoss" placeholder="请选择" clearable>
                <el-option
                  v-for="item in dropDown.economicLossSelect"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>-->
            </el-form-item>
            <el-form-item label="总结时间">
              <el-date-picker
                v-model="DrillSummary.conclusionTime"
                type="datetime"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="演练内容" class="content-editor-container">
              <quill-editor
                v-model="DrillSummary.exerciseContent"
                ref="contentEditor"
                :options="editorOption"
                :class="[{ 'isReadonly': readonly }, 'content-editor']"
                :disabled="readonly"
              ></quill-editor>
            </el-form-item>
            <el-form-item v-if="readonly" label="附件">
              <div class="downLoad" @click="downLoadAnnex">
                <span class="fileName">{{attachmentText(DrillSummary.attachment)}}</span>
                <img src="static/images/download.png">
                <span style="padding-left: 5px;">下载</span>
              </div>
            </el-form-item>
            <el-form-item v-else label="附件">
              <el-upload
                class="upload-demo"
                :action="uploadURL"
                :file-list="fileList"
                :before-upload="beforeUploadAnnex"
                :on-success="handleAnnexSuccess"
                :on-remove="handleAnnexRemove"
                :multiple="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <span style="color:#999999">10M内 仅限word</span>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" v-if="canEdit">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="clear">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clone from 'lodash/clone'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'
import { getUploadURL } from '@/modules/utils'

import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'


export default {
  name: 'DrillSummaryForm',

  components: {
    FormDialog,
    SimpleForm,
    quillEditor,

  },

  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      visible: false,
      loading: false,
      id: null,
      dirllNameSelect: [],
      fileList: [],
      DrillSummary: {
        attachment: '',
        casualtiesDescription: '',
        companyId: '',
        conclusionTime: '',
        createDate: '',
        economicLosses: '',
        exerciseContent: '',
        exerciseEnterprise: '',
        exerciseName: '',
        exerciseTitle: '',
        id: '',
        modifyDate: '',
        recordId: ''
      },
      editorOption: {
        placeholder: '',
        bounds: '.content-editor-container',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            ['link']
          ]
        }
      },
    }
  },

  computed: {
    title () {
      if (this.readonly) {
        return '查看演练总结'
      } else {
        return this.id ? '编辑演练总结' : '新增演练总结'
      }
    },
    canEdit () {
      return !this.readonly
    },
    uploadURL () {
      return getUploadURL() + '?filedir=drill-summary'
    }
  },

  methods: {
    ...mapActions('contingencyDrillSummary', ['create', 'detail', 'update']),
    ...mapActions('contingencyDrillRecord', ['loadAll']),

    async show (id) {
      this.dirllNameSelect = await this.loadAll()
      this.id = id

      this.visible = true

      if (this.id) this.loadFormData()
    },

    async loadFormData () {
      this.loading = true
      this.DrillSummary = await this.detail(this.id)
      this.fileList = []
      if (this.DrillSummary.attachment) {
        this.fileList.push({
          name: decodeURIComponent(this.DrillSummary.attachment.slice(this.DrillSummary.attachment.lastIndexOf('/') + 1)),
          url: this.DrillSummary.attachment
        })
      }
      this.loading = false
    },

    handleDirllName (o) {
      if (o) {
        if (_.find(this.dirllNameSelect, { exerciseTitle: o })) {
          this.DrillSummary.recordId = _.find(this.dirllNameSelect, { exerciseTitle: o }).id
        } else {
          this.DrillSummary.recordId = ''
        }
      } else {
        this.DrillSummary.recordId = ''
      }
    },

    async submitForm (formData) {
      if (this.loading) return
      let { economicLosses, exerciseName} = this.DrillSummary
      let reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      if (!exerciseName) {
        return this.$notify.error({
          title: '错误',
          message: '请选择演练名称'
        })
      }
      if ((economicLosses&&!reg.test(economicLosses))) {
        return this.$notify.error({
          title: '错误',
          message: '经济损失只能为数字'
        })
      }

      this.loading = true

      if (this.id) {
        await this.update({ id: this.id, formData: this.DrillSummary })
      } else {
        await this.create(this.DrillSummary)
      }

      this.loading = false
      this.visible = false
      this.clear()
    },

    attachmentText (t) {
      return decodeURI(t.slice(t.lastIndexOf('/') + 1))
    },

    clear () {
      this.loading = false
      this.visible = false
      this.dirllNameSelect = []
      this.DrillSummary = {
        attachment: '',
        casualtiesDescription: '',
        companyId: '',
        conclusionTime: '',
        createDate: '',
        economicLosses: '',
        exerciseContent: '',
        exerciseEnterprise: '',
        exerciseName: '',
        exerciseTitle: '',
        id: '',
        modifyDate: '',
        recordId: ''
      }
    },

    handleAnnexSuccess (res, file, fileList) {
      this.fileList = []
      this.fileList.push({
        name: file.name,
        url: file.response ? file.response.data : file.url
      })
      this.DrillSummary.attachment = res.data
    },

    handleAnnexRemove (file, fileList) {
      this.DrillSummary.attachment = ''
    },

    beforeUploadAnnex (file) {
      let isWORD = file.type === 'application/wps-writer' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      let isLt10M = file.size / 1024 / 1024 < 10
      if (!isWORD) {
        this.$message.error('上传附件只能是 word 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传附件大小不能超过 10MB!')
      }
      return isWORD && isLt10M
    },

    downLoadAnnex () {
      if (this.DrillSummary.attachment) {
        window.open(this.DrillSummary.attachment)
      }
    },

  }
}
</script>

<style lang="scss" >
.content-editor {
  min-width: 400px;
  /deep/ {
    .ql-container {
      height: 180px;
    }

    .ql-snow .ql-picker {
      line-height: 1;
    }
  }
}
.drill-summary-dialog-container {
  .isReadonly {
    border-top: 1px solid #ccc;
    /deep/.ql-toolbar {
      display: none;
    }
  }
  .downLoad {
    cursor: pointer;
    &:hover {
      color: #37a9fa;
    }
    .fileName {
      color: #37a9fa;
      padding: 5px;
    }
  }
  .execute {
    width: 120px;
    background-color: #f7454a;
    border-color: #f7454a;
    &:active {
      background-color: #a60005;
      border-color: #a60005;
    }
  }
  .outer-dialog {
    .el-dialog {
      min-width: 1000px;
      > .el-dialog__body {
        border-bottom: 1px solid #eee;
      }
      .outer-dialog-body {
        .outer-dialog-content {
          width: 100%;
          display: flex;
          .el-form-item {
            display: flex;
            align-items: center;
            .el-form-item__label {
              line-height: 20px;
              font-size: 12px;
            }
            .el-form-item__content {
              margin-left: 0 !important;
              width: calc(100% - 160px);
              .el-input {
                .el-input__inner {
                  height: 36px;
                  line-height: 36px;
                }
              }
            }
          }
          .form-item-upload {
            display: flex;
            align-items: end;
            .el-form-item__content {
              margin-top: -10px;
            }
          }
          > div {
            width: 44%;
            margin: 0 1%;
          }
          /*.outer-body-l {
                width: 50%;
              }
              .outer-body-l {
                width: 50%;
              }*/
        }
      }
    }
  }
}
</style>
