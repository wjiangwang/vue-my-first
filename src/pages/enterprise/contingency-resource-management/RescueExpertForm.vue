<template>
  <div class="rescue-expert-dialog-container">
    <el-dialog
      @close="clear()"
      :title="title"
      :visible.sync="visible"
      class="outer-dialog"
      :close-on-click-modal="false"
    >
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="rescueExpert" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="姓名">
                <el-input v-model="rescueExpert.name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <span v-if="readonly">{{ rescueExpert.sex}}</span>
                <el-radio-group v-else v-model="rescueExpert.sex">
                  <el-radio :label="'男'">男</el-radio>
                  <el-radio :label="'女'">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="机构代码">
                <el-input v-model="rescueExpert.organizationCode" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="民族">
                <el-select v-model="rescueExpert.national" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dropDown.nationalSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="籍贯">
                <el-input v-model="rescueExpert.nativePlace" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="健康状况">
                <el-input v-model="rescueExpert.health" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="毕业院校">
                <el-input v-model="rescueExpert.schoolGraduation" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="最高学历">
                <el-select v-model="rescueExpert.education" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dropDown.educationSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工作时间">
                <el-date-picker v-model="rescueExpert.entryDate" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="单位地址">
                <el-input v-model="rescueExpert.unitZipAddress" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="传真">
                <el-input v-model="rescueExpert.fax" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="行政职务">
                <el-input v-model="rescueExpert.duty" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="移动电话">
                <el-input v-model="rescueExpert.phone" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱">
                <el-input v-model="rescueExpert.email" placeholder="请输入"></el-input>
              </el-form-item>
            </div>

            <div class="outer-body-r">
              <el-form-item label="专家照片" style="height:163px">
                <upload-img
                  :avatar="rescueExpert.photo"
                  @handleSuccess="handleSuccess"
                  :filedir="'rescue-expert'"
                ></upload-img>
              </el-form-item>
              <el-form-item label="出生日期">
                <el-date-picker v-model="rescueExpert.birthDate" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>

              <el-form-item label="身份证号">
                <el-input v-model="rescueExpert.idNo" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="政治面貌">
                <el-select v-model="rescueExpert.politicsStatus" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dropDown.politicsStatusSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="所学专业">
                <el-input v-model="rescueExpert.professional" placeholder="请输入"></el-input>
              </el-form-item>

              <el-form-item label="工作单位">
                <el-input v-model="rescueExpert.workUnits" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="单位邮政">
                <el-input v-model="rescueExpert.unitZipCode" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="办公电话">
                <el-input v-model="rescueExpert.officePhone" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="职称">
                <el-input v-model="rescueExpert.dutyName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="专家类型">
                <el-input v-model="rescueExpert.expertsType" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="家庭电话">
                <el-input v-model="rescueExpert.familyPhone" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="家庭地址">
                <el-input v-model="rescueExpert.familyAddress" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </div>

          <div>
            <el-form-item label="专业特长描述" class="content-editor-container">
              <quill-editor
                v-model="rescueExpert.expertSkills"
                ref="contentEditor"
                :options="editorOption"
                :class="[{ 'isReadonly': readonly }, 'content-editor']"
                :disabled="readonly"
              ></quill-editor>
            </el-form-item>
            <el-form-item label="工作简历描述" class="content-editor-container">
              <quill-editor
                v-model="rescueExpert.jobResume"
                ref="contentEditor"
                :options="editorOption"
                :class="[{ 'isReadonly': readonly }, 'content-editor']"
                :disabled="readonly"
              ></quill-editor>
            </el-form-item>
            <el-form-item label="事故处置经历" class="content-editor-container">
              <quill-editor
                v-model="rescueExpert.accidentDisposalExperience"
                ref="contentEditor"
                :options="editorOption"
                :class="[{ 'isReadonly': readonly }, 'content-editor']"
                :disabled="readonly"
              ></quill-editor>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" v-if="canEdit">
        <el-button type="primary" @click="submitForm" :disabled="loading">保存</el-button>
        <el-button @click="clear" :disabled="loading">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clone from 'lodash/clone'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'
import UploadImg from '@/components/upload/uploadImg'

import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'


export default {
  name: 'RescueExpertForm',

  components: {
    FormDialog,
    SimpleForm,
    UploadImg,
    quillEditor
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
      dropDown: {
        nationalSelect: [],
        educationSelect: [],
        politicsStatusSelect: [],
      },
      rescueExpert: {
        name: '',
        sex: '',
        organizationCode: '',
        national: '',
        nativePlace: '',
        health: '',
        schoolGraduation: '',
        education: '',
        entryDate: '',
        unitZipAddress: '',
        fax: '',
        duty: '',
        phone: '',
        email: '',
        photo: '',
        birthDate: '',
        idNo: '',
        politicsStatus: '',
        professional: '',
        createTime: '',
        workUnits: '',
        unitZipCode: '',
        officePhone: '',
        dutyName: '',
        expertsType: '',
        familyPhone: '',
        familyAddress: '',
        expertSkills: '',
        jobResume: '',
        accidentDisposalExperience: '',
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
        return '查看救援专家信息'
      } else {
        return this.id ? '编辑救援专家信息' : '新增救援专家信息'
      }
    },

    canEdit () {
      return !this.readonly
    },
  },

  methods: {
    ...mapActions('enterpriseRescueExpert', ['create', 'detail', 'update']),
    ...mapActions('getDropdownOption', ['getDropdown']),

    async show (id) {
      this.id = id
      this.visible = true
      this.loading = true
      if (this.id) this.rescueExpert = await this.detail(this.id)
      this.dropDown.nationalSelect = await this.getDropdown({ type: '民族' })
      this.dropDown.educationSelect = await this.getDropdown({ type: '学历' })
      //this.dropDown.expertsTypeSelect = await this.getDropdown({ type: '专家类型' })
      this.dropDown.politicsStatusSelect = await this.getDropdown({ type: '政治面貌' })
      this.loading = false
    },

    async submitForm (formData) {
      if (this.loading) return

      let { name, professional} = this.rescueExpert
      if (!name) {
        return this.$notify.error({
          title: '错误',
          message: '请输入专家姓名'
        })
      }
      if (!professional) {
        return this.$notify.error({
          title: '错误',
          message: '请输入专业名称'
        })
      }

      this.loading = true

      if (this.id) {
        await this.update({ id: this.id, formData: this.rescueExpert })
      } else {
        await this.create(this.rescueExpert)
      }

      this.loading = false
      this.visible = false
      this.clear()
    },

    clear () {
      this.rescueExpert = {
        name: '',
        sex: '',
        organizationCode: '',
        national: '',
        nativePlace: '',
        health: '',
        schoolGraduation: '',
        education: '',
        entryDate: '',
        unitZipAddress: '',
        fax: '',
        duty: '',
        phone: '',
        email: '',
        photo: '',
        birthDate: '',
        idNo: '',
        politicsStatus: '',
        professional: '',
        createTime: '',
        workUnits: '',
        unitZipCode: '',
        officePhone: '',
        dutyName: '',
        expertsType: '',
        familyPhone: '',
        familyAddress: '',
        expertSkills: '',
        jobResume: '',
        accidentDisposalExperience: '',
      }
      this.loading = false
      this.visible = false
    },

    handleSuccess (url) {
      this.rescueExpert.photo = url
    }
  }
}
</script>

<style lang="scss" >
.content-editor {
  width: 800px;
  /deep/ {
    .ql-container {
      height: 180px;
    }

    .ql-snow .ql-picker {
      line-height: 1;
    }
  }
}
.rescue-expert-dialog-container {
  .isReadonly {
    border-top: 1px solid #ccc;
    /deep/.ql-toolbar {
      display: none;
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
        }
      }
    }
  }
}
</style>
