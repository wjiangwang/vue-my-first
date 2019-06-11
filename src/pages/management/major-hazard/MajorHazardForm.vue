<template>
  <div class="major-hazard-dialog-container">
    <el-dialog :title="id ? '重新申请重大危险源信息' : '新增重大危险源信息申请'" :visible.sync="visible" class="outer-dialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="clear">
      <div class="outer-dialog-body" v-loading="loading">
        <el-form :model="majorHazard" label-width="140px" label-suffix="：" :rules="majorHazardRules" ref="majorHazardRuleForm">
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="危险点名称" prop="">
                <el-select v-model="majorHazard.dangerPointName" placeholder="请选择对应的风险点" clearable filterable @change="handleRiskId">
                  <el-option v-for="item in risks"
                    :key="item.id"
                    :label="item.riskName"
                    :value="item.riskName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话" prop="">
                <el-input v-model="majorHazard.phone" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="主要产品" prop="">
                <el-input v-model="majorHazard.mainProducts" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="防雷防静电设施是否定期检测" prop="">
                <el-radio-group v-model="majorHazard.regularTesting">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="压力容器（台、套）" prop="">
                <el-input v-model="majorHazard.pressureVessel" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="重大危险源编号" prop="">
                <el-input v-model="majorHazard.majorHazardCode" :disabled="majorHazard.id ? true : false" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="经度" prop="">
                <el-input v-model="majorHazard.longitude" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="纬度" prop="">
                <el-input v-model="majorHazard.latitude" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="∑qi/Qi" prop="">
                <el-input v-model="majorHazard.qiQi" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="危险源类型" prop="">
                <el-select v-model="majorHazard.majorHazardType" placeholder="" clearable>
                  <el-option v-for="item in majorHazardTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="outer-body-r">
              <el-form-item label="危险源上报人" prop="">
                <el-input v-model="majorHazard.dangerPointReporter" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="生产经营活动类型" prop="">
                <el-select v-model="majorHazard.businessType" placeholder="请选择" clearable>
                  <el-option v-for="item in businessTypes"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产存储场所所有权" prop="">
                <el-radio-group v-model="majorHazard.storageOwnership">
                  <el-radio :label="0">自有</el-radio>
                  <el-radio :label="1">租赁</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-input style="visibility: hidden;" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="三类压力容器（台、套）" prop="">
                <el-input v-model="majorHazard.threePressureVessel" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="重大危险源详细地址" prop="">
                <el-input v-model="majorHazard.majorHazardAddress" placeholder=""></el-input>
              </el-form-item>
              <el-form-item>
                <el-input style="visibility: hidden;" placeholder=""></el-input>
              </el-form-item>
              <el-form-item style="margin-left: 140px;">
                <location-map :value="location" :parent="this" @handleLocation="handleLocation"></location-map>
              </el-form-item>
              <el-form-item label="申报等级" prop="">
                <el-select v-model="majorHazard.declareLevel" placeholder="" clearable>
                  <el-option v-for="item in declareLevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="化学品类型" prop="">
                <el-select v-model="majorHazard.chemicalType" placeholder="" clearable>
                  <el-option v-for="item in chemicalTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="outer-dialog-content" style="align-items: center;">
            <div>
              <el-form-item label="选择危险品" prop="">
              </el-form-item>
            </div>
            <div style="text-align: right; margin: 0 4%">
              <el-button type="success" size="small" @click="innerVisible = true">
                新增
              </el-button>
            </div>
          </div>
          <el-table :data="dangerousGoods" stripe border slot-scope class="li-item-table" height="200px">
            <el-table-column type="index" label="序号" width="65"></el-table-column>
            <el-table-column prop="dangerousGoodsChemicalName" label="危险化学品名称" width="120"></el-table-column>
            <el-table-column prop="violations" label="危规号"></el-table-column>
            <el-table-column prop="location" label="所处装置或区域" width="120"></el-table-column>
            <el-table-column prop="storage" label="存储量"></el-table-column>
            <el-table-column prop="qiQi" label="qi/Qi"></el-table-column>
            <el-table-column prop="dangerousGoodsProcessName" label="危险工艺名称" width="110"></el-table-column>
            <el-table-column prop="controlSystem" label="控制系统"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope" width="110">
                <el-button type="text" style="color: #37A9FA" @click="editDangerous(scope.row)">编辑</el-button>
                <el-button type="text" style="color: #F7454A" @click="editDelete(scope.row.uuid)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item label="危险图片" prop="">
            <upload-img :multiple="true" :avatar="majorHazard.hazardPhotos" @handleSuccess="handleSuccess" :filedir="'hazard-picture'"></upload-img>
          </el-form-item>
          <div class="outer-dialog-content">
            <div class="outer-body-l">
              <el-form-item label="邮政编码" prop="">
                <el-input v-model="majorHazard.zipCode" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="">
                <el-input v-model="majorHazard.email" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="年总资产" prop="">
                <el-input v-model="majorHazard.totalAssets" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="是否存在隐患" prop="">
                <el-radio-group v-model="majorHazard.isHiddenTrouble">
                  <el-radio :label="0">不存在</el-radio>
                  <el-radio :label="1">存在</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否拥有救援队伍" prop="">
                <el-radio-group v-model="majorHazard.isRescueTeams">
                  <el-radio :label="1">拥有</el-radio>
                  <el-radio :label="0">未拥有</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="评估附件" class="form-item-upload" prop="">
                <upload-file :avatar="majorHazard.evaluationOfAttachment" @handleSuccess="handlePingufujianSuccess" :filedir="'hazard-attachment'"></upload-file>
              </el-form-item>
            </div>
            <div class="outer-body-r">
              <el-form-item label="传真" prop="">
                <el-input v-model="majorHazard.fax" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="固定资产" prop="">
                <el-input v-model="majorHazard.fixedAssets" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="年利率" prop="">
                <el-input v-model="majorHazard.annualInterestRate" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="是否发生事故" prop="">
                <el-radio-group v-model="majorHazard.isAccident">
                  <el-radio :label="0">未发生</el-radio>
                  <el-radio :label="1">发生过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item >
                <el-input style="visibility: hidden;"></el-input>
              </el-form-item>
              <el-form-item label="申报附件" class="form-item-upload" prop="">
                <upload-file :avatar="majorHazard.declareAttachment" @handleSuccess="handleShenbaofujianSuccess" :filedir="'hazard-attachment'"></upload-file>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <el-dialog width="30%" :title="hazardGdoos.name ? '编辑危险品' : '新增危险品'" :visible.sync="innerVisible" append-to-body class="inner-dialog"  :close-on-click-modal="false" :close-on-press-escape="false" @close="gdoosClear">
        <div>
          <el-form :model="hazardGdoos" label-width="130px" :rules="rules" ref="ruleForm" label-suffix="：">
            <div class="inner-dialog-content">
              <el-form-item label="危险化学品" prop="dangerousGoodsChemicalName">
                <el-input v-model="hazardGdoos.dangerousGoodsChemicalName"></el-input>
              </el-form-item>
              <el-form-item label="危规号" prop="violations">
                <el-input v-model="hazardGdoos.violations"></el-input>
              </el-form-item>
              <el-form-item label="所处装置或区域" prop="location">
                <el-input v-model="hazardGdoos.location"></el-input>
              </el-form-item>
              <el-form-item label="存储量" prop="storage">
                <el-input v-model="hazardGdoos.storage" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="qi/Qi" prop="qiQi">
                <el-input v-model="hazardGdoos.qiQi" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="危险工艺名称" prop="dangerousGoodsProcessName">
                <el-input v-model="hazardGdoos.dangerousGoodsProcessName" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="控制系统" prop="controlSystem">
                <el-input v-model="hazardGdoos.controlSystem" placeholder=""></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="gdoosSubmit">保存</el-button>
          <el-button @click="gdoosClear">取消</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" :disabled="loading">保存</el-button>
        <el-button @click="clear" :disabled="loading">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import clone from 'lodash/clone'
  import find from 'lodash/find'
  import each from 'lodash/each'
  import remove from 'lodash/remove'
  import { mapActions } from 'vuex'
  import { MessageBox } from 'element-ui'
  import LocationMap from '@/components/LocationMap'
  import UploadImg from '@/components/upload/uploadImg'
  import UploadFile from '@/components/upload/uploadFile'
  import { getAPIBaseURL } from '@/modules/utils'
  import axios from 'axios'

  export default {
    name: 'majorHazardForm',

    components: {
      LocationMap,
      UploadImg,
      UploadFile
    },

    props: {
      enterpriseId: {
        type: Number
      }
    },

    data() {
      return {
        visible: false,
        innerVisible: false,
        loading: false,
        id: null,
        risks: [],
        majorHazardTypes: [],
        chemicalTypes: [],
        declareLevels: [
          {
            id: 1,
            name: '一级'
          },
          {
            id: 2,
            name: '二级'
          },
          {
            id: 3,
            name: '三级'
          },
          {
            id: 4,
            name: '四级'
          }
        ],
        businessTypes: ['生产', '经营', '使用', '存储'],
        majorHazard: {
          annualInterestRate: '',
          businessType: '',
          chemicalType: '',
          createDate: '',
          dangerPointName: '',
          dangerPointReporter: '',
          declareAttachment: '',
          declareLevel: '',
          email: '',
          evaluationOfAttachment: '',
          fax: '',
          fixedAssets: '',
          hazardPhotos: '',
          id: '',
          isAccident: '',
          isHiddenTrouble: '',
          isRescueTeams: '',
          latitude: '',
          longitude: '',
          mainProducts: '',
          majorHazardAddress: '',
          majorHazardCode: '',
          majorHazardType: '',
          modifyDate: '',
          phone: '',
          pressureVessel: '',
          qiQi: '',
          regularTesting: '',
          storageOwnership: '',
          threePressureVessel: '',
          totalAssets: '',
          zipCode: '',
          location: '',
          riskId: ''
        },
        dangerousGoods: [],
        hazardGdoos: {
          controlSystem: '',
          dangerousGoodsChemicalName: '',
          dangerousGoodsProcessName: '',
          location: '',
          majorHazardId: '',
          qiQi: '',
          storage: '',
          violations: '',
          uuid: ''
        },
        majorHazardRules: {},
        rules: {
          dangerousGoodsChemicalName: { required: true, message: '请填写危险化学品', trigger: 'blur' },
          violations: { required: true, message: '请填写危规号', trigger: 'blur' },
          location: { required: true, message: '请填写所处装置或区域', trigger: 'blur' },
          storage: { required: true, message: '请填写存储量', trigger: 'blur' },
          qiQi: { required: true, message: '请填写qi/Qi', trigger: 'blur' },
          dangerousGoodsProcessName: { required: true, message: '请填写危险工艺名称', trigger: 'blur' },
          controlSystem: { required: true, message: '请填写控制系统', trigger: 'blur' }
        }
      }
    },

    computed: {
      location () {
        return {
          address: this.majorHazard.location,
          longitude: this.majorHazard.longitude,
          latitude: this.majorHazard.latitude
        }
      }
    },

    methods: {
      ...mapActions('majorHazard', ['create', 'load', 'riskList']),
      ...mapActions('getDropdownOption', ['getDropdown']),

      async show(id) {
        this.risks = await this.riskList()
        this.majorHazardTypes = await this.getDropdown({type: '危险源类型'})
        this.chemicalTypes = await this.getDropdown({type: '化学品类型'})
        this.id = id
        this.visible = true
        if (this.id) this.loadFormData()
      },

      async loadFormData() {
        this.loading = true
        const result = await this.load(this.id)

        this.majorHazard = result['majorHazard']
        this.dangerousGoods = result['dangerousGoods']
        this.loading = false
      },

      handleRiskId (o) {
        if (o) {
          if (find(this.risks, {riskName: o})) {
            this.majorHazard.riskId = find(this.risks, {riskName: o}).id
          } else {
            this.majorHazard.riskId = ''
          }
        } else {
          this.majorHazard.riskId = ''
        }
      },

      handleSuccess (url) {
        this.majorHazard.hazardPhotos = url
      },

      handlePingufujianSuccess (url) {
        this.majorHazard.evaluationOfAttachment = url
      },

      handleShenbaofujianSuccess (url) {
        this.majorHazard.declareAttachment = url
      },

      handleLocation ({address, latitude, longitude}) {
        this.majorHazard.location = address
        this.majorHazard.latitude = latitude
        this.majorHazard.longitude = longitude
      },

      async submit () {
        this.loading = true
        if (!this.majorHazard.majorHazardCode) {
          return this.error('请输入重大危险源编号')
        }
        if (!this.majorHazard.declareLevel) {
          return this.error('请选择申报等级')
        }
        if (!this.dangerousGoods.length) {
          return this.error('请选择危险品')
        }
        await this.create({majorHazard: this.majorHazard, dangerousGoods: this.dangerousGoods})
        this.clear()
      },

      gdoosSubmit () {
        this.$refs.ruleForm.validate((v) => {
          if (v) {
            if (this.hazardGdoos.uuid) {
              let hazardGdooName = find(this.dangerousGoods, (i) => {
                return i.dangerousGoodsChemicalName === this.hazardGdoos.dangerousGoodsChemicalName && i.uuid !== this.hazardGdoos.uuid
              })
              if (hazardGdooName) {
                return this.error('危险化学品重复！')
              }
              let hazardGdooV = find(this.dangerousGoods, (i) => {
                return i.violations === this.hazardGdoos.violations && i.uuid !== this.hazardGdoos.uuid
              })
              if (hazardGdooV) {
                return this.error('危规号重复！')
              }
              if (find(this.dangerousGoods, {uuid: this.hazardGdoos.uuid})) {
                let dangerousGoods = []
                each(this.dangerousGoods, (i) => {
                  if (i.uuid === this.hazardGdoos.uuid) {
                    i = this.hazardGdoos
                  }
                  dangerousGoods.push(i)
                })
                this.dangerousGoods = clone(dangerousGoods)
                dangerousGoods = []
              }
            } else {
              if (find(this.dangerousGoods, {dangerousGoodsChemicalName: this.hazardGdoos.dangerousGoodsChemicalName})) {
                return this.error('危险化学品重复！')
              }
              if (find(this.dangerousGoods, {violations: this.hazardGdoos.violations})) {
                return this.error('危规号重复！')
              }
              this.hazardGdoos.uuid = this.guid()
              this.dangerousGoods.push(clone(this.hazardGdoos))
            }
            this.gdoosClear()
          }
        })
      },

      editDangerous (row) {
        this.innerVisible = true
        this.hazardGdoos = clone(row)
      },

      editDelete (uuid) {
        this.$confirm('是否删除该危险品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dangerousGoods = remove(this.dangerousGoods, (i) => {
            return i.uuid !== uuid
          })
        })
      },

      guid () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
          return v.toString(16)
        })
      },

      error (m) {
        this.loading = false
        MessageBox.alert(m)
      },

      clear () {
        this.loading = false
        this.visible = false
        this.innerVisible = false
        this.majorHazard = {
          annualInterestRate: '',
          businessType: '',
          chemicalType: '',
          createDate: '',
          dangerPointName: '',
          dangerPointReporter: '',
          declareAttachment: '',
          declareLevel: '',
          email: '',
          evaluationOfAttachment: '',
          fax: '',
          fixedAssets: '',
          hazardPhotos: '',
          id: '',
          isAccident: '',
          isHiddenTrouble: '',
          isRescueTeams: '',
          latitude: '',
          longitude: '',
          mainProducts: '',
          majorHazardAddress: '',
          majorHazardCode: '',
          majorHazardType: '',
          modifyDate: '',
          phone: '',
          pressureVessel: '',
          qiQi: '',
          regularTesting: '',
          storageOwnership: '',
          threePressureVessel: '',
          totalAssets: '',
          zipCode: '',
          location: '',
          riskId: ''
        }
      },

      gdoosClear () {
        this.innerVisible = false
        this.hazardGdoos = {
          controlSystem: '',
          dangerousGoodsChemicalName: '',
          dangerousGoodsProcessName: '',
          location: '',
          majorHazardId: '',
          qiQi: '',
          storage: '',
          violations: '',
          uuid: ''
        }
      }
    }
  }
</script>
<style lang="scss">
  .major-hazard-dialog-container {
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
          .li-item-table {
            margin: 10px 0 20px 0;
            td, th{
              padding: 5px 0;
            }
            tbody {
              .el-button {
                padding: 0;
              }
            }
          }
        }
      }
    }
  }
  .inner-dialog {
    .inner-dialog-content {
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
    }
  }
</style>
