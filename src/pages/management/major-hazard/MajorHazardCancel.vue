<template>
  <el-dialog :title="isEndit && isEnterprise ? '重大危险源核销登记申请' : isEnterprise ? '重大危险源核销登记申请详情' : isApprove ? '重大危险源核销登记审核' : '重大危险源核销登记审核详情'" :visible.sync="visible" class="major-hazard-clear-dialog" @close="clear" :append-to-body="appendToBody">
    <div class="clear-dialog-body" v-loading="loading">
      <el-form :model="majorHazard" label-width="100px" :rules="rules" label-suffix="：">
        <el-form-item label="核销编号">
          <el-input v-model="majorHazard.cancelAfterVerificationCode" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="法人单位名称">
          <el-input v-model="majorHazard.legalEnterpriseName" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="填报单位名称">
          <el-input v-model="majorHazard.applyEnterpriseName" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="填报单位地址">
          <el-input v-model="majorHazard.enterpriseAddress" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="邮政编码">
          <el-input v-model="majorHazard.zipCode" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="原重大危险源备案编号">
          <el-input v-model="majorHazard.forTheRecord" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="登记日期">
          <el-date-picker v-model="majorHazard.registrationTime" type="date" placeholder="" :disabled="disabled"></el-date-picker>
        </el-form-item>
        <el-form-item label="填报单位负责人姓名">
          <el-input v-model="majorHazard.responsibleName" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="填报单位负责人电话">
          <el-input v-model="majorHazard.responsiblePhone" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="填报人姓名">
          <el-input v-model="majorHazard.applyName" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="填报人电话">
          <el-input v-model="majorHazard.applyPhone" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="majorHazard.email" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="传真">
          <el-input v-model="majorHazard.fax" :disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="附件" class="form-item-upload">
          <upload-file v-if="isEndit" :avatar="majorHazard.attachment" @handleSuccess="handleFujianSuccess" :filedir="'cancel-attachment'" :multiple="true"></upload-file>
          <div v-else class="form-item-download">
            <span v-if="majorHazard.attachment.length" v-for="item in majorHazard.attachment.split(';')">{{attachmentText(item)}}</span>
            <el-button type="text" v-if="majorHazard.attachment.length" @click="handledownload(majorHazard.attachment)">
              <img src="static/images/download.png">
              <span>下载</span>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="审核结果" prop="status" v-if="!isEnterprise">
          <el-button @click="handleStatus(4)" size="" :class="majorHazard.status === 4 ? 'approve-button-yes' : 'is-active-yes'" :disabled="!isApprove">同意</el-button>
          <el-button @click="handleStatus(5)" size="" :class="majorHazard.status === 5 ? 'approve-button-no' : 'is-active-no'" :disabled="!isApprove">驳回</el-button>
        </el-form-item>
        <el-form-item label="备注原因" v-if="!isEnterprise">
          <el-input :rows="4" type="textarea" v-model="majorHazard.memo" placeholder="请输入" :disabled="!isApprove"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" v-if="isApprove">
      <el-button type="primary" @click="submit" :disabled="loading">确定</el-button>
      <el-button @click="clear" :disabled="loading">取消</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-if="isEndit">
      <el-button type="primary" @click="submitApply" :disabled="loading">保存</el-button>
      <el-button @click="clear" :disabled="loading">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import clone from 'lodash/clone'
  import find from 'lodash/find'
  import each from 'lodash/each'
  import { mapActions } from 'vuex'
  import { MessageBox } from 'element-ui'
  import UploadFile from '@/components/upload/uploadFile'

  export default {
    name: 'majorHazardCancel',

    components: {
      UploadFile
    },

    props: {
      isEnterprise: {
        type: Boolean,
        default: false
      },

      disabled: {
        type: Boolean,
        default: false
      },

      appendToBody: {
        type: Boolean,
        default: false
      },

      isApprove: {
        type: Boolean,
        default: false
      },

      isEndit: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: false,
        loading: false,
        id: null,
        majorHazard: {
          majorHazardId: '',
          majorHazardCode: '',
          cancelAfterVerificationCode: '',
          applyEnterpriseName: '',
          legalEnterpriseName: '',
          enterpriseAddress: '',
          zipCode: '',
          forTheRecord: '',
          registrationTime: '',
          responsibleName: '',
          responsiblePhone: '',
          applyName: '',
          applyPhone: '',
          email: '',
          fax: '',
          attachment: '',
          status: '',
          memo: ''
        },
        rules: {
          status: { required: true, message: '请选择审核结果', trigger: 'blur' }
        }
      }
    },

    methods: {
      ...mapActions('majorHazard', ['createCancel', 'loadCancel', 'approveCancel']),

      show({majorHazardId, majorHazardCode, cancelAfterVerificationId = ''}) {
        if (this.isEndit) {
          this.majorHazard.majorHazardId = majorHazardId
          this.majorHazard.majorHazardCode = majorHazardCode
        }
        this.id = cancelAfterVerificationId
        this.visible = true
        if (this.id) this.loadFormData()
      },

      async loadFormData() {
        this.loading = true
        const result = await this.loadCancel(this.id)
        this.majorHazard = result

        this.loading = false
      },

      attachmentText (t) {
        return decodeURI(t.slice(t.lastIndexOf('/') + 1))
      },

      handleFujianSuccess (url) {
        this.majorHazard.attachment = url
      },

      async submitApply () {
        if (this.loading) return

        this.loading = true
        await this.createCancel(this.majorHazard)
        this.clear()
      },

      handleStatus (o) {
        this.majorHazard.status = o
      },

      async submit () {
        if (this.loading) return

        this.loading = true
        if (this.majorHazard.status !== 4 && this.majorHazard.status !== 5) {
          return this.error('请选择审核结果')
        }
        const result = await this.approveCancel(this.majorHazard)
        this.loading = false
        if (result && result.status === 0) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.clear()
        }
      },

      handledownload (files) {
        each(files.split(';'), (i) => {
          window.open(i)
        })
      },

      error (m) {
        this.loading = false
        MessageBox.alert(m)
      },

      clear () {
        this.loading = false
        this.visible = false
        this.majorHazard = {
          majorHazardId: '',
          majorHazardCode: '',
          cancelAfterVerificationCode: '',
          applyEnterpriseName: '',
          legalEnterpriseName: '',
          enterpriseAddress: '',
          zipCode: '',
          forTheRecord: '',
          registrationTime: '',
          responsibleName: '',
          responsiblePhone: '',
          applyName: '',
          applyPhone: '',
          email: '',
          fax: '',
          attachment: '',
          status: '',
          memo: ''
        }
      }
    }
  }
</script>
<style lang="scss">
  .major-hazard-clear-dialog {
    .el-dialog {
      width: 600px;
      .clear-dialog-body {
        .el-form {
          width: 500px;
          margin: auto;
        }
        .el-form-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          .el-form-item__label {
            line-height: 20px;
            font-size: 12px;
          }
          .el-form-item__content {
            margin-left: 0 !important;
            width: calc(100% - 100px);
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
            margin-top: -5px;
            .form-item-download {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              > span {
                color: #37A9FA;
                margin: 0 5px;
                line-height: 30px;
              }
              button {
                margin-left: 10px;
                padding: 0;
                > span {
                  display: flex;
                  align-items: flex-end;
                  img {
                    margin-right: 2px;
                  }
                }
              }
            }
          }
        }
        .approve-button-yes {
          color: white;
          background-color: #59D987;
          border: 1px solid #59D987;
          padding: 8px 20px;
        }
        .approve-button-no {
          color: white;
          background-color: #F7454A;
          border: 1px solid #F7454A;
          padding: 8px 20px;
        }
        .is-active-yes {
          padding: 8px 20px;
          &:hover {
            color: white;
            background-color: #59D987;
            border: 1px solid #59D987;
          }
        }
        .is-active-no {
          padding: 8px 20px;
          &:hover {
            color: white;
            background-color: #F7454A;
            border: 1px solid #F7454A;
          }
        }
      }
      .el-dialog__footer {
        border-top: 1px solid #eee;
        button {
          padding: 8px 20px;
        }
      }
    }
  }
</style>
