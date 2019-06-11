<template>
  <div class="drill-record-dialog-container">
    <el-dialog :title="title" :visible.sync="visible" class="outer-dialog" @close="clear()">
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="DrillRecord" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="演练标题">
                <el-input
                  v-model="DrillRecord.exerciseTitle"
                  placeholder="请输入"
                  :disabled="DrillRecord.relatedPlans ? true : false"
                ></el-input>
              </el-form-item>
              <el-form-item label="观摩单位">
                <el-input
                  v-model="DrillRecord.inspectUnit"
                  placeholder="请输入"
                  :disabled="DrillRecord.relatedPlans ? true : false"
                ></el-input>
              </el-form-item>
              <el-form-item label="演练类型">
                <el-select
                  v-model="DrillRecord.exerciseType"
                  placeholder="请选择"
                  clearable
                  :disabled="DrillRecord.relatedPlans ? true : false"
                >
                  <el-option
                    v-for="item in drillTypeSelect"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="参演单位">
                <el-input v-model="DrillRecord.participateUnit" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="经费预算（万元）">
                <el-input v-model="DrillRecord.budget" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker v-model="DrillRecord.startTime" type="datetime" placeholder="请选择"></el-date-picker>
              </el-form-item>
            </div>
            <div class="outer-body-r">
              <el-form-item label="演练编号">
                <el-input v-model="DrillRecord.exerciseCode" disabled></el-input>
              </el-form-item>
              <el-form-item label="关联方案">
                <el-select
                  v-model="DrillRecord.relatedPlans"
                  placeholder="请输入"
                  clearable
                  filterable
                  @change="handleRelatedPlans"
                  :disabled="DrillRecord.status===1"
                >
                  <el-option
                    v-for="item in linkagePlanSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="演练形式">
                <el-input v-model="DrillRecord.exerciseWay" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="参练人员">
                <el-input
                  v-model="DrillRecord.participatePersonnel"
                  placeholder="请输入"
                  :disabled="DrillRecord.relatedPlans ? true : false"
                ></el-input>
              </el-form-item>
              <el-form-item label="演练地点">
                <el-input v-model="DrillRecord.exerciseAddress" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="DrillRecord.endTime" type="datetime" placeholder="请选择"></el-date-picker>
              </el-form-item>
            </div>
          </div>

          <div class>
            <el-form-item label="演练背景">
              <el-input
                v-model="DrillRecord.exerciseBackground"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="演练目的">
              <el-input
                v-model="DrillRecord.exercisePurpose"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="准备工作">
              <el-input
                v-model="DrillRecord.preparatoryWork"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="演练要求">
              <el-input
                v-model="DrillRecord.exerciseRequirements"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="演练内容">
              <el-input
                v-model="DrillRecord.exerciseContent"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="readonly" label="附件">
              <div class="downLoad" @click="downLoadAnnex">
                <span
                  class="fileName"
                  v-for="item in DrillRecord.exerciseAttachment.split(';')"
                  :key="item.index"
                >{{item ? attachmentText(item):'无附件'}}</span>
                <img
                  v-if="DrillRecord.exerciseAttachment"
                  src="static/images/download.png"
                  style="padding-left:10px"
                >
                <span v-if="DrillRecord.exerciseAttachment">下载</span>
              </div>
            </el-form-item>
            <el-form-item v-else label="上传附件">
              <upload-file
                :avatar="DrillRecord.exerciseAttachment"
                @handleSuccess="handleAnnexSuccess"
                :multiple="true"
                :filedir="'drill-record'"
              ></upload-file>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" v-if="canEdit">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button type="primary" class="execute" @click="execute(id)">立即执行</el-button>
        <el-button @click="clear">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'
import UploadFile from '@/components/upload/uploadFile'

export default {
  name: 'DrillRecordForm',

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
      loading: false,
      id: null,
      drillTypeSelect: [],
      linkagePlanSelect: [],
      DrillRecord: {
        budget: '',
        companyId: '',
        createDate: '',
        endTime: '',
        exerciseAddress: '',
        exerciseAttachment: '',
        exerciseBackground: '',
        exerciseCode: '',
        exerciseContent: '',
        exercisePurpose: '',
        exerciseRequirements: '',
        exerciseTitle: '',
        exerciseType: '',
        exerciseWay: '',
        id: '',
        inspectUnit: '',
        modifyDate: '',
        participatePersonnel: '',
        participateUnit: '',
        preparatoryWork: '',
        relatedPlans: '',
        startTime: '',
        status: 0
      }
    }
  },

  computed: {
    title () {
      if (this.readonly) {
        return '查看演练记录'
      } else {
        return this.id ? '编辑演练记录' : '新增演练记录'
      }
    },
    canEdit () {
      return !this.readonly
    }
  },

  methods: {
    ...mapActions('contingencyDrillRecord', ['create', 'detail', 'update', 'relatedPlans', 'loadInfo']),
    ...mapActions('getDropdownOption', ['getDropdown']),

    async show (id) {
      this.id = id
      this.visible = true
      this.drillTypeSelect = await this.getDropdown({ type: '演练类型' })
      this.linkagePlanSelect = await this.relatedPlans()
      if (this.id) this.loadFormData()
      else this.DrillRecord.exerciseCode = 'd' + new Date().getTime()
    },

    async loadFormData () {
      this.loading = true
      this.DrillRecord = await this.detail(this.id)

      this.loading = false
    },

    async handleRelatedPlans (o) {
      if (o) {
        if (_.find(this.linkagePlanSelect, { name: o })) {
          let id = _.find(this.linkagePlanSelect, { name: o }).id
          let result = await this.loadInfo(id)
          Object.assign(this.DrillRecord, result)
        }
      } else {
        Object.assign(this.DrillRecord, {
          exerciseCode: 'd' + new Date().getTime(),
          exerciseTitle: '',
          exerciseType: '',
          inspectUnit: '',
          participatePersonnel: ''
        })
      }
    },

    async execute (id) {
      this.id = id
      this.DrillRecord.status = 1
      this.submitForm()
    },

    async submitForm () {
      if (this.loading) return
      let { budget, exerciseTitle} = this.DrillRecord
      let reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      if (!exerciseTitle) {
        return this.$notify.error({
          title: '错误',
          message: '请输入演练标题或选择关联方案'
        })
      }
      if ((budget&&!reg.test(budget))) {
        return this.$notify.error({
          title: '错误',
          message: '预算金额只能为数字'
        })
      }

      this.loading = true

      if (this.id) {
        await this.update({ id: this.id, formData: this.DrillRecord })
      } else {
        await this.create(this.DrillRecord)
      }

      this.loading = false
      this.visible = false
      this.clear()
    },

    clear () {
      this.loading = false
      this.visible = false
      this.DrillRecord = {
        budget: '',
        companyId: '',
        createDate: '',
        endTime: '',
        exerciseAddress: '',
        exerciseAttachment: '',
        exerciseBackground: '',
        exerciseCode: '',
        exerciseContent: '',
        exercisePurpose: '',
        exerciseRequirements: '',
        exerciseTitle: '',
        exerciseType: '',
        exerciseWay: '',
        id: '',
        inspectUnit: '',
        modifyDate: '',
        participatePersonnel: '',
        participateUnit: '',
        preparatoryWork: '',
        relatedPlans: '',
        startTime: '',
        status: ''
      }
    },

    handleAnnexSuccess (url) {
      this.DrillRecord.exerciseAttachment = url
    },

    downLoadAnnex () {
      if (!this.ContingencyPlanForm.attachment.length) { return false }
      for (let url of this.ContingencyPlanForm.attachment.split(';')) {
        window.open(url)
      }
    },

    attachmentText (t) {
      return decodeURI(t.slice(t.lastIndexOf('/') + 1))
    }
  }
}

</script>
<style lang="scss" >
.drill-record-dialog-container {
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
