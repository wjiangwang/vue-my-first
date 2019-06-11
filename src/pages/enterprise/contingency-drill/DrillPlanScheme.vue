<template>
  <div class="drill-plan2-dialog-container">
    <el-dialog :title="title" :visible.sync="visible" class="outer-dialog">
      <div class="outer-dialog-body">
        <el-form :model="drillScheme" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="演练标题">
                <el-input v-model="drillScheme.exerciseTitle" placeholder></el-input>
              </el-form-item>
              <el-form-item label="演练类型">
                <el-select v-model="drillScheme.exerciseType" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in drillTypeSelect"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="drillScheme.endTime" type="datetime" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>

            <div class="outer-body-r">
              <el-form-item label="演练编号">
                <el-input v-model="drillScheme.exerciseCode" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker v-model="drillScheme.startTime" type="datetime" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div style="padding-right:21px">
            <el-form-item label="参练人员">
              <el-input v-model="drillScheme.participatePersonnel" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="观摩单位">
              <el-input v-model="drillScheme.inspectUnit" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="演练内容" class="content-editor-container">
              <quill-editor
                v-model="drillScheme.exerciseDetails"
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
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="clear">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import find from 'lodash/find'
import { MessageBox } from 'element-ui'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { mapActions } from 'vuex'

export default {
  name: 'DrillPlanForm2',

  components: {
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
      innerVisible: false,
      loading: false,
      drillTypeSelect: [],
      drillSchemes: [],
      drillScheme: {},
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
        return '查看演练方案'
      } else {
        return this.id ? '编辑演练方案' : '新增演练方案'
      }
    },
    canEdit () {
      return !this.readonly
    },
  },

  methods: {
    ...mapActions('getDropdownOption', ['getDropdown']),

    async show (row, list) {
      this.drillTypeSelect = await this.getDropdown({ type: '演练类型' })
      this.drillScheme = row
      if (!this.drillScheme.exerciseCode) {
        this.drillScheme.exerciseCode = 'd' + new Date().getTime()
      }
      this.drillSchemes = list
      this.visible = true
    },

    submit () {
      if (this.loading) return
      let { exerciseTitle } = this.drillScheme
      if (!exerciseTitle) {
        return this.$notify.error({
          title: '错误',
          message: '请输入演练标题'
        })
      }

      this.loading = true
      let item = find(this.drillSchemes, { exerciseCode: this.drillScheme.exerciseCode })
      if (item) {
        let otherItem = find(this.drillSchemes, (i) => {
          return i.exerciseCode !== this.drillScheme.exerciseCode && i.exerciseTitle === this.drillScheme.exerciseTitle
        })
        if (otherItem) {
          return this.error('演练标题重复！')
        }
        for (let i of this.drillSchemes) {
          if (i.exerciseCode === this.drillScheme.exerciseCode) {
            i = this.drillScheme
            break
          }
        }
      } else {
        let otherItem = find(this.drillSchemes, (i) => {
          return i.exerciseTitle === this.drillScheme.exerciseTitle
        })
        if (otherItem) {
          return this.error('演练标题重复！')
        }
        this.drillSchemes.push(this.drillScheme)
      }
      this.$emit('handleScheme', this.drillSchemes)
      this.clear()
    },

    error (m) {
      this.loading = false
      MessageBox.alert(m)
    },

    clear () {
      this.loading = false
      this.visible = false
    },
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
.drill-plan2-dialog-container {
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
                .el-input__2 {
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
