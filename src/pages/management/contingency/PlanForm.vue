<template>
  <div class="contingency-plan-form">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="30%"
      class="outer-dialog"
      @close="clear()"
      :close-on-click-modal="false"
    >
      <div class="outer-dialog-body" v-loading="loading">
        <el-form
          :model="ContingencyPlanForm"
          label-width="100px"
          label-suffix="："
          :disabled="readonly"
        >
          <div class>
            <el-form-item label="预案名称">
              <el-input v-model="ContingencyPlanForm.planName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="预案类型">
              <el-select v-model="ContingencyPlanForm.planType" placeholder="请选择" clearable>
                <el-option
                  v-for="item in dropDown.planTypeSelect"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预案级别">
              <el-select v-model="ContingencyPlanForm.planLevel" placeholder="请选择" clearable>
                <el-option
                  v-for="item in dropDown.planLevelSelect"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预案编号">
              <el-input v-model="ContingencyPlanForm.planCode" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="关联事件">
              <el-input v-model="ContingencyPlanForm.relatedEvents" placeholder="请输入"></el-input>
              <!-- <el-select v-model="ContingencyPlanForm.relatedEvents" placeholder="请选择" clearable>
                <el-option
                  v-for="item in dropDown.relatedEventsSelect"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>-->
            </el-form-item>
            <el-form-item label="制定人">
              <el-input v-model="ContingencyPlanForm.makingPeople" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="制定时间">
              <el-date-picker
                v-model="ContingencyPlanForm.makingTime"
                type="datetime"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>

            <el-form-item v-if="readonly" label="附件">
              <div class="downLoad" @click="downLoadAnnex">
                <span
                  class="fileName"
                  v-for="item in ContingencyPlanForm.attachment.split(';')"
                  :key="item.index"
                >{{item?fileName(item):'无附件'}}</span>
                <img
                  v-if="ContingencyPlanForm.attachment"
                  src="static/images/download.png"
                  style="padding-left:10px"
                >
                <span v-if="ContingencyPlanForm.attachment">下载</span>
              </div>
            </el-form-item>
            <el-form-item v-else label="附件">
              <upload-file
                :multiple="true"
                :avatar="ContingencyPlanForm.attachment"
                @handleSuccess="handleAnnexSuccess"
                :filedir="'contingency-plan'"
              ></upload-file>
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
import { mapActions } from 'vuex'
import clone from 'lodash/clone'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'
import UploadFile from '@/components/upload/uploadFile'


export default {
  name: 'ContingencyPlanFormForm',

  components: {
    FormDialog,
    SimpleForm,
    UploadFile
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
      innerVisible: false,
      loading: false,
      id: null,
      dropDown: {
        planTypeSelect: [],
        planLevelSelect: [],
        // relatedEventsSelect: [],
      },
      ContingencyPlanForm: {
        planName: '',
        planType: '',
        planCode: '',
        planLevel: '',
        makingTime: '',
        makingPeople: '',
        relatedEvents: '',
        attachment: '',
      },
    }
  },

  computed: {
    title () {
      if (this.readonly) {
        return '查看应急预案信息'
      } else {
        return this.id ? '编辑应急预案信息' : '新增应急预案信息'
      }
    },

    canEdit () {
      return !this.readonly
    }
  },

  methods: {
    ...mapActions('contingencyPlan', ['create', 'load', 'update', 'detail']),
    ...mapActions('getDropdownOption', ['getDropdown']),

    fileName (t) {
      return decodeURI(t.slice(t.lastIndexOf('/') + 1))
    },

    async show (id) {
      this.id = id
      this.visible = true
      this.loading = true

      if (this.id) this.ContingencyPlanForm = await this.detail(this.id)

      this.dropDown.planTypeSelect = await this.getDropdown({ type: '预案类型' })
      this.dropDown.planLevelSelect = await this.getDropdown({ type: '预案级别' })
      // this.dropDown.relatedEventsSelect = await this.getDropdown({ type: '关联事件' })

      this.loading = false
    },

    async submitForm () {
      if (this.loading) return

      if (!this.ContingencyPlanForm.planName) {
        return this.$notify.error({
          title: '错误',
          message: '请输入预案名称'
        })
      }
      if (!this.ContingencyPlanForm.planCode) {
        return this.$notify.error({
          title: '错误',
          message: '请输入预案编号'
        })
      }

      this.loading = true
      if (this.id) {
        await this.update({ id: this.id, formData: this.ContingencyPlanForm })
      } else {
        await this.create(this.ContingencyPlanForm)
      }
      this.visible = false
      this.loading = false
      this.clear()
    },

    clear () {
      this.loading = false
      this.visible = false
      this.innerVisible = false
      this.ContingencyPlanForm = {
        planName: '',
        planType: '',
        planCode: '',
        planLevel: '',
        makingTime: '',
        makingPeople: '',
        attachment: '',
        relatedEvents: null,
      }
    },

    handleAnnexSuccess (url) {
      this.ContingencyPlanForm.attachment = url
    },

    downLoadAnnex () {
      if (!this.ContingencyPlanForm.attachment.length) { return false }
      for (let url of this.ContingencyPlanForm.attachment.split(';')) {
        let link = document.createElement('a')
        let filename = this.fileName(url)
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.contingency-plan-form {
  .downLoad {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: #37a9fa;
    }
    .fileName {
      color: #37a9fa;
      padding: 5px;
    }
  }

  .outer-dialog {
    .el-dialog {
      min-width: 600px;
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
