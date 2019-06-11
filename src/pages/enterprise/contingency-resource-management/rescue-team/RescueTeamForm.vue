<template>
  <div class="rescue-team-dialog-container">
    <el-dialog
      @close="clear()"
      :title="title"
      :visible.sync="visible"
      class="outer-dialog"
      :close-on-click-modal="false"
    >
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="rescueTeam" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="队伍名称">
                <el-input v-model="rescueTeam.rescueTeamName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="资质等级">
                <el-input v-model="rescueTeam.qualificationLevel" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="服务区域">
                <el-input v-model="rescueTeam.serviceArea" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="办公室电话">
                <el-input v-model="rescueTeam.officePhone" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="总人数（人）">
                <el-input v-model="rescueTeam.totalPeopleNum" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="兼职人数（人）">
                <el-input v-model="rescueTeam.partTimePeopleNum" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="小队个数">
                <el-input v-model="rescueTeam.teamNum" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="截止期">
                <el-date-picker v-model="rescueTeam.asOfTime" type="date" placeholder="选择截止日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="地图坐标">
                <location-input :value="location" @input="mapClick"></location-input>
              </el-form-item>
            </div>
            <div class="outer-body-r">
              <el-form-item label="救援队类型">
                <el-select
                  v-model="rescueTeam.rescueTeamType"
                  placeholder="请输入或选择救援队类型"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in dropDown.teamTypeSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主要部门">
                <el-input v-model="rescueTeam.mainDepartment	" placeholder="请输入上级主管部门"></el-input>
              </el-form-item>
              <el-form-item label="主要负责人">
                <el-input v-model="rescueTeam.mainHead" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="值班电话">
                <el-input v-model="rescueTeam.onDutyPhone" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="专职人数（人）">
                <el-input v-model="rescueTeam.fullTimePeopleNum" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="中队个数">
                <el-input v-model="rescueTeam.squadronNum" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="成立时间">
                <el-date-picker v-model="rescueTeam.setUpTime" type="date" placeholder="选择成立时间"></el-date-picker>
              </el-form-item>
              <el-form-item label="发证日期">
                <el-date-picker
                  v-model="rescueTeam.getCertificateTime"
                  type="date"
                  placeholder="选择发证日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="救援队伍地址">
                <el-input v-model="rescueTeam.rescueTeamAddress" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </div>

          <div class>
            <el-form-item label="主要装备描述">
              <el-input
                v-model="rescueTeam.mainEquipment"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="专业描述">
              <el-input
                v-model="rescueTeam.professionalDescription"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="质量标准化等级">
              <el-input
                v-model="rescueTeam.qualityStandardLevel"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="发证机关">
              <el-input
                v-model="rescueTeam.licenseIssuingAgencies"
                placeholder="请输入"
                type="textarea"
                :rows="5"
              ></el-input>
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


export default {
  name: 'RescueTeamForm',

  components: {
    FormDialog,
    SimpleForm,
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
        teamTypeSelect: [],
      },
      rescueTeam: {
        rescueTeamName: '',
        qualificationLevel: '',
        serviceArea: '',
        officePhone: '',
        totalPeopleNum: '',
        partTimePeopleNum: '',
        teamNum: '',
        asOfTime: '',
        latitude: '',
        longitude: '',
        rescueTeamType: '',
        mainDepartment: '',
        mainHead: '',
        onDutyPhone: '',
        fullTimePeopleNum: '',
        squadronNum: '',
        setUpTime: '',
        getCertificateTime: '',
        rescueTeamAddress: '',
        mainEquipment: '',
        professionalDescription: '',
        qualityStandardLevel: '',
        licenseIssuingAgencies: '',
        isGovernmentCreate: 1,
      },
    }
  },

  computed: {
    title () {
      if (this.readonly) {
        return '查看救援队伍信息'
      } else {
        return this.id ? '编辑应急救援队伍信息' : '新增应急救援队伍信息'
      }
    },

    canEdit () {
      return !this.readonly
    },

    location () {
      if (this.rescueTeam.latitude && this.rescueTeam.longitude)
        return {
          latitude: this.rescueTeam.latitude,
          longitude: this.rescueTeam.longitude
        }
      else
        return null
    },
  },

  methods: {
    ...mapActions('enterpriseRescueTeam', ['create', 'update', 'detail']),
    ...mapActions('getDropdownOption', ['getDropdown']),

    async show (id) {
      this.id = id
      this.visible = true
      this.loading = true

      if (this.id) this.rescueTeam = await this.detail(this.id)

      this.dropDown.teamTypeSelect = await this.getDropdown({ type: '救援队类型' })
      this.loading = false
    },

    async submitForm () {
      if (this.loading) return
      let reg = /^\d+$/
      let { rescueTeamName, mainHead, totalPeopleNum, partTimePeopleNum, fullTimePeopleNum, teamNum, squadronNum, setUpTime } = this.rescueTeam
      if (!rescueTeamName) {
        return this.$notify.error({
          title: '错误',
          message: '请输入救援队名称'
        })
      }
      if ((totalPeopleNum && !reg.test(totalPeopleNum)) || (partTimePeopleNum && !reg.test(partTimePeopleNum) || (fullTimePeopleNum && !reg.test(fullTimePeopleNum)))) {
        return this.$notify.error({
          title: '错误',
          message: '人数只能为数字'
        })
      }
      if ((teamNum && !reg.test(teamNum)) || (squadronNum && !reg.test(squadronNum))) {
        return this.$notify.error({
          title: '错误',
          message: '队伍个数只能为数字'
        })
      }
      if (!mainHead) {
        return this.$notify.error({
          title: '错误',
          message: '请输入负责人'
        })
      }
      if (!setUpTime) {
        return this.$notify.error({
          title: '错误',
          message: '请选择救援队成立时间'
        })
      }

      this.loading = true
      if (this.id) {
        await this.update({ id: this.id, formData: this.rescueTeam })
      } else {
        await this.create(this.rescueTeam)
      }
      this.visible = false
      this.loading = false
      this.clear()
    },

    mapClick (map) {
      Object.assign(this.rescueTeam, map)
    },

    clear () {
      this.loading = false
      this.visible = false
      this.rescueTeam = {
        rescueTeamName: '',
        qualificationLevel: '',
        serviceArea: '',
        officePhone: '',
        totalPeopleNum: '',
        partTimePeopleNum: '',
        teamNum: '',
        asOfTime: '',
        latitude: '',
        rescueTeamType: '',
        mainDepartment: '',
        mainHead: '',
        onDutyPhone: '',
        fullTimePeopleNum: '',
        squadronNum: '',
        setUpTime: '',
        getCertificateTime: '',
        rescueTeamAddress: '',
        mainEquipment: '',
        professionalDescription: '',
        qualityStandardLevel: '',
        licenseIssuingAgencies: '',
      }
    },
  }
}
</script>

<style lang="scss" >
.rescue-team-dialog-container {
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