<template>
  <div class="drill-plan-dialog-container">
    <el-dialog
      @close="clear()"
      :title="title"
      :visible.sync="visible"
      class="outer-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="outer-dialog-body">
        <el-form :model="drillPlan" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="计划名称">
                <el-input v-model="drillPlan.exercisePlanName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="计划类型">
                <el-input v-model="drillPlan.exercisePlanType" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker v-model="drillPlan.startTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="负责人员">
                <el-input v-model="drillPlan.head" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="关联预案">
                <el-input v-model="drillPlan.relatedPlans" placeholder="请输入"></el-input>
              </el-form-item>
            </div>

            <div class="outer-body-r">
              <el-form-item label="计划编号">
                <el-input v-model="drillPlan.exercisePlanCode" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="计划周期">
                <el-input v-model="cycleNum" placeholder="请输入" style="width:45%"></el-input>
                <el-select
                  v-model="cycleUnit"
                  placeholder="选择单位"
                  clearable
                  style="width:45%;padding-left:21px"
                >
                  <el-option v-for="item in cycleUnits" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="drillPlan.endTime" type="date" placeholder="请选择"></el-date-picker>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="drillPlan.headPhone" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
          </div>
          <div>
            <el-form-item label="计划内容" class="content-editor-container">
              <quill-editor
                v-model="drillPlan.exercisePlanDetails"
                ref="contentEditor"
                :options="editorOption"
                :class="[{ 'isReadonly': readonly }, 'content-editor']"
                :disabled="readonly"
              ></quill-editor>
            </el-form-item>
          </div>

          <div class="outer-dialog-content" style="align-items: center;">
            <div>
              <el-form-item label="演练方案"></el-form-item>
            </div>
            <div style="text-align: right; margin: 0 4%" v-if="canEdit">
              <el-button
                type="success"
                size="small"
                @click="newDrillScheme.show({}, drillPlanerScheme)"
              >新增</el-button>
            </div>
          </div>

          <el-table
            :data="drillPlanerScheme"
            stripe
            border
            slot-scope
            style="margin: 10px 0 20px 0;"
          >
            <el-table-column prop="exerciseTitle" label="演练标题"></el-table-column>
            <el-table-column prop="exerciseCode" label="编号"></el-table-column>
            <el-table-column prop="exerciseType" label="演练类型"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" :formatter="timeDesc"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" :formatter="timeDesc"></el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="{ row }" width="110">
                <div>
                  <span
                    type="text"
                    @click="detailDrillScheme.show(row)"
                    class="drill-detil"
                    style="color: #37A9FA"
                  >详情</span>
                  <el-button
                    type="text"
                    @click="editDrillScheme.show(row, drillPlanerScheme)"
                    style="color: #37A9FA"
                    v-if="!readonly"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    @click="deleteDrillScheme(row.exerciseCode)"
                    style="color: #F7454A"
                    v-if="!readonly"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" v-if="canEdit">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="clear">取消</el-button>
      </div>
    </el-dialog>

    <drill-plan-scheme ref="newDrillScheme" @handleScheme="handleScheme"></drill-plan-scheme>
    <drill-plan-scheme ref="editDrillScheme" @handleScheme="handleScheme"></drill-plan-scheme>
    <drill-plan-scheme :readonly="true" ref="detailDrillScheme"></drill-plan-scheme>
  </div>
</template>

<script>
import clone from 'lodash/clone'
import remove from 'lodash/remove'
import { mapActions } from 'vuex'
import { Loading } from 'element-ui'
import FormDialog from '@/components/FormDialog'
import SimpleForm from '@/components/SimpleForm'
import DrillPlanScheme from './DrillPlanScheme'
import dayjs from 'dayjs'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  name: 'DrillPlanForm',

  components: {
    FormDialog,
    SimpleForm,
    quillEditor,
    DrillPlanScheme
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
      cycleNum: '',
      cycleUnit: '',
      cycleUnits: ['小时', '天', '周', '月', '季', '年'],
      drillPlan: {
        companyId: '',
        cycle: '',
        endTime: '',
        exercisePlanCode: '',
        exercisePlanDetails: '',
        exercisePlanName: '',
        exercisePlanType: '',
        head: '',
        headPhone: '',
        id: '',
        relatedPlans: '',
        startTime: ''
      },
      drillPlanerScheme: [],
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
    newDrillScheme () {
      return this.$refs.newDrillScheme
    },

    editDrillScheme () {
      return this.$refs.editDrillScheme
    },

    detailDrillScheme () {
      return this.$refs.detailDrillScheme
    },

    title () {
      if (this.readonly) {
        return '查看演练计划'
      } else {
        return this.id ? '编辑演练计划' : '新增演练计划'
      }
    },

    canEdit () {
      return !this.readonly
    },
  },

  methods: {
    ...mapActions('contingencyDrillPlan', ['create', 'detail', 'update']),

    show (id) {
      this.id = id
      this.visible = true

      if (this.id) this.loadFormData()
      else this.drillPlan.exercisePlanCode = 'p' + new Date().getTime()
    },

    async loadFormData () {
      this.loading = true
      const result = await this.detail(this.id)
      this.drillPlan = result.erExercisePlan
      if (this.drillPlan && this.drillPlan.cycle) {
        this.cycleNum = this.drillPlan.cycle.split(' ')[0]
        this.cycleUnit = this.drillPlan.cycle.split(' ')[1]
      }
      this.drillPlanerScheme = result.erExerciseScheme

      this.loading = false
    },

    timeDesc (row, col, val) {
      return val ? dayjs(val).format('YYYY-MM-DD HH:mm') : ''
    },

    handleScheme (list) {
      this.drillPlanerScheme = list
    },

    async submit () {
      if (this.loading) return ''
      let { exercisePlanName, startTime } = this.drillPlan
      if (!exercisePlanName) {
        return this.$notify.error({
          title: '错误',
          message: '请输入计划名称'
        })
      }
      if (!startTime) {
        return this.$notify.error({
          title: '错误',
          message: '请输入演练计划开始时间'
        })
      }

      this.loading = true
      if (this.cycleNum && this.cycleUnit) this.drillPlan.cycle = this.cycleNum + ' ' + this.cycleUnit
      if (this.id) {
        await this.update({ id: this.id, formData: { erExercisePlan: this.drillPlan, erExerciseScheme: this.drillPlanerScheme } })
      } else {
        await this.create({ erExercisePlan: this.drillPlan, erExerciseScheme: this.drillPlanerScheme })
      }
      this.clear()
    },

    clear () {
      this.loading = false
      this.visible = false
      this.drillPlan = {
        companyId: '',
        cycle: '',
        endTime: '',
        exercisePlanCode: '',
        exercisePlanDetails: '',
        exercisePlanName: '',
        exercisePlanType: '',
        head: '',
        headPhone: '',
        id: '',
        relatedPlans: '',
        startTime: ''
      }
      this.drillPlanerScheme = []
      this.id = ''
    },

    deleteDrillScheme (code) {
      this.$confirm('确认删除该演练方案？', '确认删除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })
            this.drillPlanerScheme = remove(this.drillPlanerScheme, (i) => {
              return i.exerciseCode !== code
            })
            loading.close()
            done()
          } else {
            done()
          }
        }
      })
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
.drill-detil {
  &:hover {
    cursor: pointer;
  }
}
.drill-plan-dialog-container {
  .isReadonly {
    border-top: 1px solid #ccc;
    /deep/.ql-toolbar {
      display: none;
    }
  }
  .detailButton {
    color: #37a9fa;
    cursor: pointer;
    &:hover {
      color: #66b1ff;
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
