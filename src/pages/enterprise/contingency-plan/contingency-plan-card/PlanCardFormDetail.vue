<template>
  <div class="plan-card-dialog-container">
    <el-dialog :title="title" :visible.sync="visible" class="outer-dialog" @close="clear()">
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="planCard" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="名称">
                <el-input v-model="planCard.disposalCardName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="主要负责人">
                <el-input v-model="planCard.mainHead" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="安全负责人">
                <el-input v-model="planCard.securityHead" placeholder="请输入"></el-input>
              </el-form-item>
            </div>

            <div class="outer-body-r">
              <el-form-item label="编号">
                <el-input v-model="planCard.disposalCardCode" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="主要负责人电话">
                <el-input v-model="planCard.mainHeadPhone" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="安全负责人电话">
                <el-input v-model="planCard.securityHeadPhone" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="outer-dialog-content" style="align-items: center;">
            <div>
              <el-form-item label="其他应急联系电话"></el-form-item>
            </div>
            <div style="text-align: right; margin: 0 4%" v-if="canEdit">
              <el-button type="success" size="small" @click="addPhone">新增</el-button>
            </div>
          </div>
          <el-table :data="emergencyPhones" stripe border slot-scope style="margin: 10px 0 20px 0;">
            <el-table-column type="index" label="序号" width="90"></el-table-column>
            <el-table-column prop="disposalCardPhoneName" label="名称"></el-table-column>
            <el-table-column prop="disposalCardPhone" label="电话"></el-table-column>
            <el-table-column prop="action" label="操作" width="120" v-if="canEdit">
              <template slot-scope="scope" width="110">
                <el-button
                  type="text"
                  style="color: #37A9FA"
                  @click="editContingencyPhone(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  style="color: #F7454A"
                  @click="detailContingencyPhone(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div>
            <el-form-item label="应急物资" v-if="readonly">
              <el-input v-model="planCard.erSupplies"></el-input>
            </el-form-item>
            <el-form-item label="应急物资" v-else>
              <el-select v-model="erSupplies" multiple placeholder="请选择，可多选" clearable>
                <el-option
                  v-for="(item, index) in dropDown.emergencySuppliesSelect"
                  :key="index"
                  :label="item.equipmentName"
                  :value="item.equipmentName"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="危险以及后果分析">
              <el-input v-model="planCard.conclusion" placeholder="请输入" type="textarea" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="处理措施">
              <el-input v-model="planCard.measures" placeholder="请输入" type="textarea" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="应急处置注意事项">
              <el-input v-model="planCard.attention" placeholder="请输入" type="textarea" :rows="5"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <el-dialog
        width="30%"
        :title="innerTitle"
        :visible.sync="innerVisible"
        append-to-body
        class="inner-dialog"
      >
        <div class="outer-dialog-body">
          <el-form :model="planCard" label-width="100px" label-suffix="：">
            <div class="outer-dialog-content" style="margin-right: 54px;">
              <el-form-item label="名称">
                <el-input v-model="disposalCardPhoneName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="电话号码">
                <el-input v-model="disposalCardPhone" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitPhone">保存</el-button>
          <el-button @click="innerClear">取消</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer" v-if="canEdit">
        <el-button type="primary" @click="submitForm" :disabled="loading">保存</el-button>
        <el-button @click="clear" :disabled="loading">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import remove from 'lodash/remove'
import { mapActions } from 'vuex'

export default {
  name: 'PlanCardFormDetail',

  components: {
  },

  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    canEdit () {
      return !this.readonly
    },

    title () {
      if (this.readonly) {
        return '查看应急处置卡'
      } else {
        return this.id ? '编辑应急处置卡' : '新增应急处置卡'
      }
    },

    innerTitle () {
      return this.uuid ? '编辑应急电话' : '新增应急电话'
    }
  },

  data () {
    return {
      visible: false,
      innerVisible: false,
      loading: false,
      id: null,
      uuid: null,
      dropDown: {
        emergencySuppliesSelect: []
      },
      erSupplies: [],
      disposalCardPhoneName: '',
      disposalCardPhone: '',
      planCard: {
        disposalCardName: '',
        mainHead: '',
        securityHead: '',
        disposalCardCode: '',
        mainHeadPhone: '',
        securityHeadPhone: '',
        erSupplies: '',
        conclusion: '',
        measures: '',
        attention: '',
        riskAssessmentId: null
      },
      emergencyPhones: [],
    }
  },

  methods: {
    ...mapActions('contingencyPlanCard', ['create', 'detail', 'update', 'erEquipmentMaterialAll']),

    async show (id) {
      this.id = id
      this.visible = true
      this.loading = true
      this.dropDown.emergencySuppliesSelect = await this.erEquipmentMaterialAll()

      if (this.id) {
        let result = await this.detail(this.id)
        this.planCard = result.erDisposalCard
        this.emergencyPhones = result.erDisposalCardPhoneList
      } else {
        this.planCard.disposalCardCode = 'p' + new Date().getTime()
      }
      this.loading = false
    },

    addPhone () {
      this.innerVisible = true
      this.uuid = ''
    },

    // 保存电话
    submitPhone () {
      if (this.loading) return
      if (!this.disposalCardPhoneName) {
        return this.$notify.error({
          title: '错误',
          message: '请输应急电话名称'
        })
      }
      if (!this.disposalCardPhone) {
        return this.$notify.error({
          title: '错误',
          message: '请输应急电话号码'
        })
      }

      this.loading = true
      if (this.uuid) {
        for (let item of this.emergencyPhones) {
          if (item.uuid === this.uuid) {
            item.disposalCardPhoneName = this.disposalCardPhoneName
            item.disposalCardPhone = this.disposalCardPhone
            break
          }
        }
      } else {
        let uuid = this.guid()
        let newPhone = { disposalCardPhoneName: this.disposalCardPhoneName, disposalCardPhone: this.disposalCardPhone, uuid }
        this.emergencyPhones.push(newPhone)
      }
      this.loading = false
      this.innerClear()

    },

    async submitForm () {
      if (this.loading) return
      let { disposalCardName, mainHeadPhone, mainHead } = this.planCard
      if (!disposalCardName) {
        return this.$notify.error({
          title: '错误',
          message: '请输入处置卡名称'
        })
      }
      if (!mainHead) {
        return this.$notify.error({
          title: '错误',
          message: '请输入主要负责人'
        })
      }

      this.planCard.riskAssessmentId = this.$route.params.id
      this.loading = true
      this.planCard.erSupplies = this.erSupplies.join(',')

      if (this.id) {
        await this.update({ id: this.id, formData: { erDisposalCard: this.planCard, erDisposalCardPhoneList: this.emergencyPhones } })
      } else {
        await this.create({ erDisposalCard: this.planCard, erDisposalCardPhoneList: this.emergencyPhones })
      }

      this.loading = false
      this.visible = false
      this.clear()
    },

    clear () {
      this.loading = false
      this.visible = false
      this.innerClear()
      this.erSupplies = [],
        this.emergencyPhones = [],
        this.planCard = {
          disposalCardName: '',
          mainHead: '',
          securityHead: '',
          disposalCardCode: '',
          mainHeadPhone: '',
          securityHeadPhone: '',
          erSupplies: '',
          conclusion: '',
          measures: '',
          attention: '',
          riskAssessmentId: null
        }
    },

    innerClear () {
      this.innerVisible = false
      this.disposalCardPhoneName = ''
      this.disposalCardPhone = ''
    },

    editContingencyPhone (row) {
      this.disposalCardPhoneName = row.disposalCardPhoneName
      this.disposalCardPhone = row.disposalCardPhone
      this.innerVisible = true
      this.uuid = row.uuid
    },

    detailContingencyPhone (row) {
      this.$confirm('是否删除该应急电话？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.emergencyPhones = remove(this.emergencyPhones, (i) => {
          return i.uuid !== row.uuid
        })
      })
    },

    guid () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
  },
}
</script>

<style lang="scss">
.plan-card-dialog-container {
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
