<template>
  <div class="rescue-resource-dialog-container">
    <el-dialog
      @close="clear()"
      :title="title"
      :visible.sync="visible"
      class="outer-dialog"
      :close-on-click-modal="false"
    >
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="rescueResource" label-width="140px" label-suffix="：" :disabled="readonly">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="装备类型">
                <el-select v-model="rescueResource.equipmentType" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dropDown.equipmentTypeSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机构代码">
                <el-input v-model="rescueResource.organizationCode" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="规格型号">
                <el-input v-model="rescueResource.specifications" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="出厂日期">
                <el-date-picker
                  v-model="rescueResource.deliveryTime"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="购买日期">
                <el-date-picker v-model="rescueResource.buyTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="所属队伍">
                <el-input v-model="rescueResource.subordinateTeam" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="移动电话">
                <el-input v-model="rescueResource.phone" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="定期保修间隔">
                <el-input v-model="rescueResource.timeWarrantyInterval" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="装备来源">
                <el-input v-model="rescueResource.sourcesEquipment" placeholder="请输入"></el-input>
              </el-form-item>
            </div>

            <div class="outer-body-r">
              <el-form-item label="装备名称">
                <el-input v-model="rescueResource.equipmentName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="资产类型">
                <el-select v-model="rescueResource.assetTypes" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dropDown.assetTypesSelect"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数量">
                <el-input v-model="rescueResource.number" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="使用年限">
                <el-date-picker v-model="rescueResource.discardTime" type="date" placeholder="请选择"></el-date-picker>
              </el-form-item>

              <el-form-item label="所属单位">
                <el-input v-model="rescueResource.subordinateUnits" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="负责人">
                <el-input v-model="rescueResource.head" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="储备库名称">
                <el-input v-model="rescueResource.reserveName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="地图坐标">
                <!-- TODO: 地图 -->
                <location-input :value="location" @input="mapClick"></location-input>
              </el-form-item>
            </div>
          </div>

          <div class>
            <el-form-item label="用途" class="content-editor-container">
              <quill-editor
                v-model="rescueResource.useDetails"
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

import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'


export default {
  name: 'RescueResourceForm',

  components: {
    FormDialog,
    SimpleForm,
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
        equipmentTypeSelect: [],
        assetTypesSelect: [],
      },
      rescueResource: {
        equipmentType: '',
        organizationCode: '',
        specifications: '',
        deliveryTime: '',
        buyTime: '',
        subordinateTeam: '',
        phone: '',
        timeWarrantyInterval: '',
        sourcesEquipment: '',
        assetTypes: '',
        number: '',
        discardTime: '',
        head: '',
        reserveName: '',
        latitude: '',
        longitude: '',
        useDetails: ''

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
        return '查看应急装备物资信息'
      } else {
        return this.id ? '编辑应急装备物资信息' : '新增应急装备物资信息'
      }
    },

    location () {
      if (this.rescueResource.latitude && this.rescueResource.longitude)
        return {
          latitude: this.rescueResource.latitude,
          longitude: this.rescueResource.longitude
        }
      else
        return null
    },

    canEdit () {
      return !this.readonly
    },
  },

  methods: {
    ...mapActions('enterpriseRescueResource', ['create', 'update', 'detail']),
    ...mapActions('getDropdownOption', ['getDropdown']),

    async show (id) {
      this.id = id
      this.visible = true
      this.loading = true
      if (this.id) this.rescueResource = await this.detail(this.id)
      this.dropDown.equipmentTypeSelect = await this.getDropdown({ type: '装备类型' })
      this.dropDown.assetTypesSelect = await this.getDropdown({ type: '资产类型' })
      this.loading = false

    },

    async submitForm () {
      if (this.loading) return
      let { equipmentName, equipmentType, assetTypes } = this.rescueResource
      if (!equipmentName) {
        return this.$notify.error({
          title: '错误',
          message: '请输入物资名称'
        })
      }

      this.loading = true

      if (this.id) {
        await this.update({ id: this.id, formData: this.rescueResource })
      } else {
        await this.create(this.rescueResource)
      }

      this.loading = false
      this.visible = false
      this.clear()
    },

    mapClick (map) {
      Object.assign(this.rescueResource, map)
    },

    clear () {
      this.loading = false
      this.visible = false
      this.rescueResource = {
        equipmentType: '',
        organizationCode: '',
        specifications: '',
        deliveryTime: '',
        buyTime: '',
        subordinateTeam: '',
        phone: '',
        timeWarrantyInterval: '',
        sourcesEquipment: '',
        assetTypes: '',
        number: '',
        discardTime: '',
        head: '',
        reserveName: '',
        latitude: '',
        longitude: '',
        useDetails: ''
      }
    },
  }
}
</script>

<style lang="scss">
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
.rescue-resource-dialog-container {
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