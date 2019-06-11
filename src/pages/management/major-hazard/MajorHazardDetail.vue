<template>
  <div>
    <el-dialog :title="isEnterprise ? '重大危险源详细' : '审核重大危险源详细'" :visible.sync="visible" @close="clear" :close-on-click-modal="false" :lose-on-press-escape="false" class="major-hazard-approve-dialog" :append-to-body="appendToBody">
      <div v-loading="loading">
        <div class="major-hazard-approve-top">
          <div>填报人：{{majorHazard.recordPeople}}</div>
          <div>联系电话：{{majorHazard.recordPeoplePhone}}</div>
          <div>填报时间：{{strftime(majorHazard.createDate)}}</div>
        </div>
        <div class="major-hazard-approve-body">
          <ul>
            <li>
              <div class="li-item-name">风险单位名称</div>
              <div class="li-item-content">{{majorHazard.dangerPointName}}</div>
            </li>
            <li>
              <div class="li-item-name">生产经营活动类型</div>
              <div class="li-item-content">
                <el-radio-group disabled v-model="majorHazard.businessType">
                  <el-radio :label="'生产'">生产</el-radio>
                  <el-radio :label="'经营'">经营</el-radio>
                  <el-radio :label="'使用'">使用</el-radio>
                  <el-radio :label="'存储'">存储</el-radio>
                </el-radio-group>
              </div>
            </li>
            <li>
              <div class="li-item-name">主要产品</div>
              <div class="li-item-content">{{majorHazard.mainProducts}}</div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">生产存储场所所有权</div>
                <div class="li-item-content">
                  <el-radio-group disabled v-model="majorHazard.storageOwnership">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div>
                <div class="li-item-name">防雷防静电设施是否定期检测</div>
                <div class="li-item-content">
                  <el-radio-group disabled v-model="majorHazard.regularTesting">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">压力容器（台、套）</div>
                <div class="li-item-content">{{majorHazard.pressureVessel}}</div>
              </div>
              <div>
                <div class="li-item-name">三类压力容器（台、套）</div>
                <div class="li-item-content">{{majorHazard.threePressureVessel}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">重大危险源编号</div>
                <div class="li-item-content">{{majorHazard.majorHazardCode}}</div>
              </div>
              <div>
                <div class="li-item-name">重大危险源详细地址</div>
                <div class="li-item-content">{{majorHazard.majorHazardAddress}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">经度</div>
                <div class="li-item-content">{{majorHazard.longitude}}</div>
              </div>
              <div>
                <div class="li-item-name">纬度</div>
                <div class="li-item-content">{{majorHazard.latitude}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">∑qi/Qi</div>
                <div class="li-item-content">{{majorHazard.qiQi}}</div>
              </div>
              <div>
                <div class="li-item-name">申报等级</div>
                <div class="li-item-content">{{levelText(majorHazard.declareLevel)}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">危险源类型</div>
                <div class="li-item-content">{{majorHazard.majorHazardType}}</div>
              </div>
              <div>
                <div class="li-item-name">化学品类型</div>
                <div class="li-item-content">{{majorHazard.chemicalType}}</div>
              </div>
            </li>
            <li>
              <data-table :columns="tableColumns" :show-bottom-bar="false" :height="200"
                :data="dangerousGoods" class="li-item-table">
              </data-table>
            </li>
            <li>
              <div class="li-item-name">危险图片</div>
              <div class="li-item-content" v-if="majorHazard.hazardPhotos.length">
                <img v-for="item in majorHazard.hazardPhotos.split(';')" :src="item" alt="" style="margin-right: 10px;">
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">申报人</div>
                <div class="li-item-content">{{majorHazard.dangerPointReporter}}</div>
              </div>
              <div>
                <div class="li-item-name">联系电话</div>
                <div class="li-item-content">{{majorHazard.phone}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">申报时间</div>
                <div class="li-item-content">{{strftime(majorHazard.createDate)}}</div>
              </div>
              <div>
                <div class="li-item-name">邮政编码</div>
                <div class="li-item-content">{{majorHazard.zipCode}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">传真</div>
                <div class="li-item-content">{{majorHazard.fax}}</div>
              </div>
              <div>
                <div class="li-item-name">电子邮箱</div>
                <div class="li-item-content">{{majorHazard.email}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">固定资产</div>
                <div class="li-item-content">{{majorHazard.fixedAssets}}</div>
              </div>
              <div>
                <div class="li-item-name">年总资产</div>
                <div class="li-item-content">{{majorHazard.totalAssets}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">年利润</div>
                <div class="li-item-content">{{majorHazard.annualInterestRate}}</div>
              </div>
              <div>
                <div class="li-item-name">是否存在隐患</div>
                <div class="li-item-content">{{majorHazard.isHiddenTrouble === 1 ? '存在' : '不存在'}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">是否发生事故</div>
                <div class="li-item-content">{{majorHazard.isAccident === 1 ? '发生' : '未发生'}}</div>
              </div>
              <div>
                <div class="li-item-name">是否拥有救援队伍</div>
                <div class="li-item-content">{{majorHazard.isRescueTeams === 1 ? '拥有' : '未拥有'}}</div>
              </div>
            </li>
            <li>
              <div class="li-item-first">
                <div class="li-item-name">评估附件</div>
                <div class="li-item-content" v-if="majorHazard.evaluationOfAttachment.length">
                  <span v-for="item in majorHazard.evaluationOfAttachment.split(';')">{{attachmentText(item)}}</span>
                  <el-button type="text" @click="handledownload(majorHazard.evaluationOfAttachment)">
                    <img src="static/images/download.png">
                    <span>下载</span>
                  </el-button>
                </div>
              </div>
              <div>
                <div class="li-item-name">申报附件</div>
                <div class="li-item-content" v-if="majorHazard.declareAttachment.length">
                  <span v-for="item in majorHazard.declareAttachment.split(';')">{{attachmentText(item)}}</span>
                  <el-button type="text" @click="handledownload(majorHazard.declareAttachment)">
                    <img src="static/images/download.png">
                    <span>下载</span>
                  </el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="major-hazard-approve-form" v-if="!isEnterprise">
          <el-form :model="majorHazard" :rules="rules" label-width="100px" :disabled="disabled">
            <el-form-item label="审核结果：" prop="status">
              <el-button @click="handleStatus(1)" size="" :class="majorHazard.status === 1 ? 'approve-button-yes' : 'is-active-yes'">同意</el-button>
              <el-button @click="handleStatus(2)" size="" :class="majorHazard.status === 2 ? 'approve-button-no' : 'is-active-no'">驳回</el-button>
            </el-form-item>
            <el-form-item label="备注原因：">
              <el-input :rows="4" type="textarea" v-model="majorHazard.memo" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-else style="height: 30px;"></div>
      </div>
      <div class="action-button" v-if="!isEnterprise && !disabled">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button type="" @click="clear">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import clone from 'lodash/clone'
  import each from 'lodash/each'
  import { mapActions } from 'vuex'
  import { MessageBox } from 'element-ui'
  import DataTable from '@/components/DataTable'
  import dayjs from 'dayjs'

  const tableColumns = [
    { title: '序号', type: 'index', width: '65' },
    { title: '危险化学品名称', name: 'dangerousGoodsChemicalName' },
    { title: '违规号', name: 'violations' },
    { title: '所处装置或区域', name: 'location' },
    { title: '存储量', name: 'storage' },
    { title: 'qi/Qi', name: 'qiQi' },
    { title: '危险工艺名称', name: 'dangerousGoodsProcessName' },
    { title: '控制系统', name: 'controlSystem' }
  ]

  const rules = {
    status: { required: true, message: '请选择审核结果', trigger: 'blur' }
  }

  export default {
    name: 'majorHazardApprove',

    components: {
      DataTable
    },

    props: {
      appendToBody: {
        type: Boolean,
        default: false
      },

      disabled: {
        type: Boolean,
        default: false
      },

      isEnterprise: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: false,
        loading: false,
        id: null,
        tableColumns,
        rules,
        approve: {
          status: '',
          memo: ''
        },
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
          status: ''
        },
        dangerousGoods: []
      }
    },

    methods: {
      ...mapActions('majorHazard', ['load', 'approveRecord']),

      show(id) {
        this.id = id
        this.visible = true
        this.loading = true
        if (this.id) this.loadFormData()
      },

      async loadFormData() {
        const result = await this.load(this.id)
        this.majorHazard = result.majorHazard
        this.dangerousGoods = result.dangerousGoods
        this.loading = false
      },

      attachmentText (t) {
        return decodeURI(t.slice(t.lastIndexOf('/') + 1))
      },

      strftime (t) {
        return t ? dayjs(t).format('YYYY-MM-DD') : ''
      },

      levelText(level) {
        switch (level) {
        case 1:
          return '一级'
        case 2:
          return '二级'
        case 3:
          return '三级'
        case 4:
          return '四级'
        default:
          return '无'
        }
      },

      handledownload (files) {
        each(files.split(';'), (i) => {
          window.open(i)
        })
      },

      handleStatus (o) {
        this.majorHazard.status = o
      },

      async submit () {
        if (this.loading) return

        this.loading = true
        if (this.majorHazard.status !== 1 && this.majorHazard.status !== 2) {
          return this.error('请选择审核结果')
        }
        const result = await this.approveRecord(this.majorHazard)
        this.loading = false
        if (result && result.status === 0) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.clear()
        }

      },

      error (m) {
        this.loading = false
        MessageBox.alert(m)
      },

      clear () {
        this.loading = false
        this.visible = false
        this.dangerousGoods = []
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
          status: ''
        }
      }
    }
  }
</script>
<style lang="scss">
  .major-hazard-approve-dialog {
    .el-dialog {
      min-width: 1000px;
      .el-dialog__body {
        padding: 0;
        >:nth-child(1) {
          padding: 30px 20px 1px;
        }
      }
      .major-hazard-approve-top {
        display: flex;
        justify-content: space-between;
        color: #2A2A2A;
        font-family: 'PingFang SC';
        font-weight: 700;
        margin-bottom: 20px;
      }
      .major-hazard-approve-body {
        border: 1px solid #E4F1FD;
        ul {
          list-style: none;
          margin: 0 !important;
          padding: 0 !important;
          > :last-child {
            border-bottom: 0 !important;
          }
          li {
            width: 100%;
            display: flex;
            border-bottom: 1px solid #E4F1FD;
            .li-item-first {
              border-right: 1px solid #E4F1FD;
              > div {
                height: 100%;
                display: flex;
                align-items: center;
              }
            }

            > div {
              width: 50%;
              display: flex;
              align-items: center;
              .li-item-name {
                width: 30%;
                height: 100%;
                display: flex;
                align-items: center;
              }
              .li-item-content {
                width: 70%;
                flex-wrap: wrap;
                > span {
                  margin-right: 5px;
                  color: #37A9FA;
                }
                .el-button {
                  margin-left: 10px;
                  > span {
                    display: flex;
                    align-items: flex-end;
                    img {
                      width: 18px;
                      height: 21px;
                      margin-right: 5px;
                    }
                  }
                }
              }
            }
            .li-item-name {
              width: 15%;
              text-align: right;
              background-color: rgba(249,253,255,1);
              box-sizing: border-box;
              border-right: 1px solid #E4F1FD;
              padding: 5px 10px;
              justify-content: flex-end;
            }
            .li-item-content {
              width: 85%;
              box-sizing: border-box;
              padding: 5px 10px;
              img {
                width: 120px;
                height: auto;
              }
            }
            .li-item-table {
              width: calc(100% - 40px);
              margin: 0 20px 20px;
              .table {
                border-left-width: 1px;
              }
              .el-table td, .el-table th{
                padding: 5px 0;
              }
              .el-table__header-wrapper {
                thead tr th {
                  background-color: rgba(249,253,255,1);
                }
              }
            }
          }
        }
      }
      .major-hazard-approve-form {
        margin-top: 20px;
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
      .action-button {
        text-align: right;
        padding: 10px 20px;
        border-top: 1px solid #eee;
        button {
          padding: 8px 20px;
        }
      }
    }
  }
</style>
