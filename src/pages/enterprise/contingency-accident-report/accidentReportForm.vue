<template>
  <div class="accident-report-dialog-container">
    <el-dialog :title="title" :visible.sync="visible" class="outer-dialog">
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="accidentReport" label-width="140px" label-suffix="：" :disabled="readonly">
          <div>
            <el-form-item label="事故名称">
              <el-input v-model="accidentReport.accidentName" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="涉事单位" v-if="isManagement">
                <el-select
                  v-model="accidentReport.companyId"
                  placeholder="请选择"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in dropDown.companyIdSelect"
                    :key="item.index"
                    :label="item.enterpriseName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="记录编号">
                <el-input v-model="accidentReport.code" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="事故级别">
                <el-select v-model="accidentReport.accidentLevel" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dropDown.accidentLevelSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事故坐标">
                <location-input :value="location" @input="mapClick"></location-input>
              </el-form-item>
              <el-form-item label="负责人员">
                <el-input v-model="accidentReport.head" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="受伤人数">
                <el-input v-model="accidentReport.injuredNum" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="经济损失（万元）">
                <el-input v-model="accidentReport.economicLosses" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
            <div class="outer-body-r">
              <el-form-item label="事故类别">
                <el-select v-model="accidentReport.accidentType" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dropDown.accidentTypeSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事故时间">
                <el-date-picker
                  v-model="accidentReport.accidentTime"
                  type="datetime"
                  placeholder="请选择"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="事故地点">
                <el-input v-model="accidentReport.accidentAddress" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="处理日期">
                <el-date-picker
                  v-model="accidentReport.disposalTime"
                  type="datetime"
                  placeholder="请选择"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="死亡人数">
                <el-input v-model="accidentReport.deathNum" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="影响范围（米）">
                <el-input v-model="accidentReport.scope" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </div>
          <div>
            <el-form-item label="事情经过">
              <el-input
                v-model="accidentReport.accidentProcess"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="损失情况">
              <el-input
                v-model="accidentReport.damageDetails"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="原因分析">
              <el-input
                v-model="accidentReport.causeAnalysis"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
          </div>
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="所在区域">
                <el-input v-model="accidentReport.area" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="经办科室">
                <el-input v-model="accidentReport.operationDepartment" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="经办人">
                <el-input v-model="accidentReport.operationPeople" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
            <div class="outer-body-r">
              <el-form-item label="是否结案">
                <span v-if="readonly">{{ accidentReport.isEnd===0? '未结案':'已结案'}}</span>
                <el-radio-group v-else v-model="accidentReport.isEnd">
                  <el-radio :label="0">未结案</el-radio>
                  <el-radio :label="1">已结案</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否公示">
                <span v-if="readonly">{{ accidentReport.isPublic===0? '不公示':'公示'}}</span>
                <el-radio-group v-else v-model="accidentReport.isPublic">
                  <el-radio :label="0">不公示</el-radio>
                  <el-radio :label="1">公示</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div>
            <el-form-item label="其他经办人">
              <el-input v-model="accidentReport.otherOperationPeople" placeholder="请输入，逗号隔开"></el-input>
            </el-form-item>
            <el-form-item label="处理情况">
              <el-input
                v-model="accidentReport.disposalDetails"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="人员伤亡情况">
              <el-input
                v-model="accidentReport.casualtiesDescription"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="赔偿金额（万元）">
              <el-input v-model="accidentReport.compensationMo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="事故赔偿情况">
              <el-input
                v-model="accidentReport.compensationDetails"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="处罚金额（万元）">
              <el-input v-model="accidentReport.punishmentMo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="事故处罚情况">
              <el-input
                v-model="accidentReport.punishmentDetails"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="readonly" label="附件">
              <div class="downLoad" @click="downLoadAnnex">
                <span
                  class="fileName"
                  v-for="item in accidentReport.attachment.split(';')"
                  :key="item.index"
                >{{item?fileName(item):'无附件'}}</span>
                <img
                  v-if="accidentReport.attachment"
                  src="static/images/download.png"
                  style="padding-left:10px"
                >
                <span v-if="accidentReport.attachment">下载</span>
              </div>
            </el-form-item>
            <el-form-item v-else label="附件">
              <upload-file
                :multiple="true"
                :avatar="accidentReport.attachment"
                @handleSuccess="handleAnnexSuccess"
                :filedir="'accident-report'"
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
import clone from 'lodash/clone'
import { mapActions } from 'vuex'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'
import UploadFile from '@/components/upload/uploadFile'

export default {
  name: 'accidentReportForm',

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
      isManagement: false,
      visible: false,
      loading: false,
      id: null,
      dropDown: {
        accidentTypeSelect: [],
        accidentLevelSelect: [],
        companyIdSelect: [],
      },
      accidentReport: {
        accidentName: '',
        companyId: '',
        code: '',
        accidentLevel: '',
        accidentMap: '',
        head: '',
        injuredNum: '',
        economicLosses: '',
        accidentType: '',
        accidentTime: '',
        accidentAddress: '',
        disposalTime: '',
        deathNum: '',
        scope: '',
        accidentProcess: '',
        damageDetails: '',
        causeAnalysis: '',
        area: '',
        operationDepartment: '',
        operationPeople: '',
        isEnd: 0,
        isPublic: 0,
        otherOperationPeople: '',
        disposalDetails: '',
        compensationDetails: '',
        punishmentDetails: '',
        punishmentMo: '',
        compensationMo: '',
        attachment: '',
        casualtiesDescription: '',
      },
    }
  },

  computed: {
    title () {
      if (this.readonly) {
        return '查看事故报送'
      } else {
        return this.id ? '编辑事故报送' : '新增事故报送'
      }
    },

    canEdit () {
      return !this.readonly
    },

    location () {
      if (this.accidentReport.latitude && this.accidentReport.longitude)
        return {
          latitude: this.accidentReport.latitude,
          longitude: this.accidentReport.longitude
        }
      else
        return null
    },
  },

  methods: {
    ...mapActions('contingencyAccidentReport', ['create', 'detail', 'update']),
    ...mapActions('getDropdownOption', ['getDropdown', 'getCompanyAll']),

    fileName (t) {
      return decodeURI(t.slice(t.lastIndexOf('/') + 1))
    },

    async show (obj) {
      this.isManagement = obj.isManagement
      this.id = obj.id
      this.visible = true
      this.loading = true
      this.id ? this.accidentReport = await this.detail(this.id) : this.accidentReport.code = 'p' + new Date().getTime()
      this.dropDown.accidentTypeSelect = await this.getDropdown({ type: '事故类型' })
      this.dropDown.accidentLevelSelect = await this.getDropdown({ type: '事故级别' })
      if (this.isManagement) this.dropDown.companyIdSelect = await this.getCompanyAll()
      this.loading = false
    },

    async submitForm () {
      if (this.loading) return
      let { accidentName, injuredNum, deathNum, economicLosses, punishmentMo, compensationMo, accidentTime } = this.accidentReport
      let regPeople = /^\d+$/
      let reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      if (!accidentName) {
        return this.$notify.error({
          title: '错误',
          message: '请填写事故名称'
        })
      }
      if (!accidentTime) {
        return this.$notify.error({
          title: '错误',
          message: '请填写事故时间'
        })
      }
      if ((injuredNum && !regPeople.test(injuredNum)) || (deathNum && !regPeople.test(deathNum))) {
        return this.$notify.error({
          title: '错误',
          message: '伤亡人数应为整数'
        })
      }
      if (!injuredNum) {
        this.accidentReport.injuredNum = 0
      }
      if (!deathNum) {
        this.accidentReport.deathNum = 0
      }
      if ((economicLosses && !reg.test(economicLosses))) {
        return this.$notify.error({
          title: '错误',
          message: '经济损失只能为数字'
        })
      }
      if ((punishmentMo && !reg.test(punishmentMo))) {
        return this.$notify.error({
          title: '错误',
          message: '处罚只能为数字'
        })
      }
      if ((compensationMo && !reg.test(compensationMo))) {
        return this.$notify.error({
          title: '错误',
          message: '赔偿只能为数字'
        })
      }

      this.loading = true
      if (this.id) {
        await this.update({ id: this.id, formData: this.accidentReport })
      } else {
        await this.create(this.accidentReport)
      }
      this.loading = false
      this.visible = false
      this.clear()
    },

    mapClick (map) {
      Object.assign(this.accidentReport, map)
    },

    clear () {
      this.loading = false
      this.visible = false
      this.innerVisible = false
      this.accidentReport = {
        accidentName: '',
        companyId: '',
        code: '',
        accidentLevel: '',
        accidentMap: '',
        head: '',
        injuredNum: '',
        economicLosses: '',
        accidentType: '',
        accidentTime: '',
        accidentAddress: '',
        disposalTime: '',
        deathNum: '',
        scope: '',
        accidentProcess: '',
        damageDetails: '',
        causeAnalysis: '',
        area: '',
        operationDepartment: '',
        operationPeople: '',
        isEnd: 0,
        isPublic: 0,
        otherOperationPeople: '',
        disposalDetails: '',
        compensationDetails: '',
        punishmentDetails: '',
        punishmentMo: '',
        compensationMo: '',
        attachment: '',
        casualtiesDescription: '',
      }
    },

    downLoadAnnex () {
      if (!this.accidentReport.attachment.length) { return false }
      for (let url of this.accidentReport.attachment.split(';')) {
        let link = document.createElement('a')
        let filename = this.fileName(url)
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },

    handleAnnexSuccess (url) {
      this.accidentReport.attachment = url
    }
  }
}
</script>
<style lang="scss" >
.accident-report-dialog-container {
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
  .execute {
    width: 120px;
    background-color: #250c0d;
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
        }
      }
    }
  }
}
</style>
