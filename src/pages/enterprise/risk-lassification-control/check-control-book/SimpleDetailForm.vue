<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="detailFormVisible"
      :close-on-click-modal="false"
      :lose-on-press-escape="false"
      class="simple-detail-form-risk-assessment-third-dialog"
      :append-to-body="appendToBody"
    >
      <div class="real-time-risk-assessment-third-body" v-loading="loading">
        <ul v-for="item in DetailForm" :key="item.index">
          <li v-if="item.type==='content1'" :class="'li-height-'+item.height">
            <div class="li-item-content" style="width:100%;justify-content: center">一、{{item.title}}</div>
          </li>
          <li v-if="item.type==='content1'" :class="'li-height-'+item.height">
            <div class="li-item-first" style="width:70%">
              <div class="li-item-name" :style="'width:'+(1500/70)+'%'">排查项目</div>
              <div class="li-item-content" :style="'width:'+(5500/70)+'%'">{{item.riskDescription}}</div>
            </div>
            <div style="width:30%">
              <div class="li-item-name" style="width:50%">排查结果</div>
              <div class="li-item-content">{{item.checkResult}}</div>
            </div>
          </li>
          <li v-if="item.type==='content1'" :class="'li-height-'+item.height">
            <div class="li-item-name">排查部位</div>
            <div class="li-item-content">{{item.location}}</div>
          </li>
          <li v-if="item.type==='content1'" :class="'li-height-'+item.height">
            <div class="li-item-first-double">
              <div>
                <div class="li-item-name" style="width:109%">排查人员</div>
                <div class="li-item-content">{{item.inspectionName}}</div>
              </div>
              <div>
                <div
                  class="li-item-name"
                  style="width:109%;border-left: 1px solid #e4f1fd;"
                >{{item.checkTimeName}}</div>
                <div
                  class="li-item-content"
                >{{item.controlsTime==='/'?'/':timeDesc(item.controlsTime)}}</div>
              </div>
            </div>
            <div>
              <div class="li-item-name">排查岗位</div>
              <div class="li-item-content">{{item.structureName}}</div>
            </div>
          </li>
          <li v-if="item.type==='content1'" :class="'li-height-'+item.height">
            <div class="li-item-first">
              <div class="li-item-name">排查方式</div>
              <div class="li-item-content">{{item.method}}专业性隐患排查</div>
            </div>
            <div>
              <div class="li-item-name">排查分类</div>
              <div class="li-item-content">{{item.hiddenType}}</div>
            </div>
          </li>
          <li v-if="item.type==='content1'" :class="'li-height-5'">
            <div class="li-item-name">排查标准</div>
            <div class="li-item-content">{{item.identifyEvaluationStandard}}</div>
          </li>
          <li
            v-if="item.type==='content1'"
            :class="'li-height-4'"
            style="border-bottom:1px solid #e4f1fd !important;"
          >
            <div class="li-item-name">现场排查影像资料</div>
            <div class="li-item-content" style="justify-content: start;overflow:hidden">
              <div
                class="table-item-img"
                @click.stop="preview(handleImgUrl(item.url,0))"
                :style="'background: url('+ handleImgUrl(item.url,0) +')  no-repeat center/cover;'"
              ></div>
              <div
                class="table-item-img"
                @click.stop="preview(handleImgUrl(item.url,1))"
                :style="'background: url('+ handleImgUrl(item.url,1) +')  no-repeat center/cover;'"
              ></div>
              <!-- <img
                v-for="img in item.url.split(',')"
                :key="img"
                style="margin-right: 10px;"
                :style="'background: url('+ img +')  no-repeat center/cover;'"
                @click="preview(item.url)"
              >-->
            </div>
          </li>
        </ul>
        <!-- 第二部分 -->
        <ul v-for="item in DetailForm" :key="item.index">
          <li v-if="item.type==='content2'" :class="'li-height-'+item.height">
            <div class="li-item-content" style="width:100%;justify-content: center">二、{{item.title}}</div>
          </li>
          <li v-if="item.type==='content2'" :class="'li-height-'+item.height">
            <div class="li-item-first-double">
              <div>
                <div class="li-item-name" style="width:109%">{{item.peopleType}}</div>
                <div class="li-item-content">{{item.reviewName}}</div>
              </div>
              <div>
                <div class="li-item-name" style="width:109%;border-left: 1px solid #e4f1fd;">确认工位</div>
                <div class="li-item-content">{{item.reviewStructure}}</div>
              </div>
              <!-- <div>
                <div
                  class="li-item-name"
                  style="width:109%;border-left: 1px solid #e4f1fd;"
                >{{item.timeType}}</div>
                <div class="li-item-content">{{item.reviewTime==='/'?'/':timeDesc(item.reviewTime)}}</div>
              </div>-->
            </div>
            <div class="li-item-first-double">
              <div>
                <div class="li-item-name" style="width:109%;">{{item.timeType}}</div>
                <div class="li-item-content">{{item.reviewTime==='/'?'/':timeDesc(item.reviewTime)}}</div>
              </div>
              <div>
                <div class="li-item-name" style="width:109%;border-left: 1px solid #e4f1fd;">确认结果</div>
                <div class="li-item-content">{{item.reviewResult?item.reviewResult:'/'}}</div>
              </div>
            </div>
          </li>
          <li v-if="item.type==='content2'" :class="'li-height-'+item.height">
            <div class="li-item-first-double">
              <div>
                <div class="li-item-name" style="width:109%;">隐患等级</div>
                <div class="li-item-content">{{item.stateHiddenTrouble}}</div>
              </div>
              <div>
                <div class="li-item-name" style="width:109%;border-left: 1px solid #e4f1fd;">整改责任人</div>
                <div class="li-item-content">{{item.principalPersonnel}}</div>
              </div>
              <!--  -->
            </div>
            <div class="li-item-first-double">
              <div>
                <div class="li-item-name" style="width:109%;">整改时限</div>
                <div
                  class="li-item-content"
                >{{item.rectificationDate==='/'?'/':timeDesc(item.rectificationDate)}}</div>
              </div>
              <div>
                <div class="li-item-name" style="width:109%;border-left: 1px solid #e4f1fd;">整改资金</div>
                <div class="li-item-content">{{item.planPrice}}</div>
              </div>
            </div>
          </li>
          <li v-if="item.type==='content2'" :class="'li-height-3'">
            <div class="li-item-name">{{item.measureName}}</div>
            <div class="li-item-content">{{item.rectificationMeasures}}</div>
          </li>
          <li
            v-if="item.type==='content2'"
            :class="'li-height-4'"
            style="border-bottom:1px solid #e4f1fd !important"
          >
            <div class="li-item-name">{{item.imgName}}</div>
            <div class="li-item-content" style="justify-content: start;overflow:hidden">
              <div
                class="table-item-img"
                @click.stop="preview(handleImgUrl(item.url,0))"
                :style="'background: url('+ handleImgUrl(item.url,0) +')  no-repeat center/cover;'"
              ></div>
              <div
                class="table-item-img"
                @click.stop="preview(handleImgUrl(item.url,1))"
                :style="'background: url('+ handleImgUrl(item.url,1) +')  no-repeat center/cover;'"
              ></div>
              <!-- <img
                v-for="img in item.url.split(',')"
                :key="img"
                style="margin-right: 10px;"
                :style="'background: url('+ img +')  no-repeat center/cover;'"
                @click="preview(item.url)"
              >-->
            </div>
          </li>
        </ul>
        <!-- 第三部分 -->
        <ul v-for="item in DetailForm" :key="item.index">
          <li v-if="item.type==='content3'" :class="'li-height-'+item.height">
            <div class="li-item-content" style="width:100%;justify-content: center">三、{{item.title}}</div>
          </li>
          <li v-if="item.type==='content3'" :class="'li-height-'+item.height">
            <div class="li-item-first-double">
              <div>
                <div class="li-item-name" style="width:109%">验收责任人</div>
                <div class="li-item-content">{{item.acceptancePersonnel}}</div>
              </div>
              <div>
                <div class="li-item-name" style="width:109%;border-left: 1px solid #e4f1fd;">验收时间</div>
                <div
                  class="li-item-content"
                >{{item.acceptanceDate==='/'?'/':timeDesc(item.acceptanceDate)}}</div>
              </div>
            </div>
            <div>
              <div class="li-item-name">验收结果</div>
              <div
                class="li-item-content"
              >{{(item.acceptancePersonnel!=='/' && item.acceptanceDate!=='/') ?'隐患治理完成':'/'}}</div>
            </div>
          </li>
          <li
            v-if="item.type==='content3'"
            :class="'li-height-4'"
            style="border-bottom:1px solid #e4f1fd !important;"
          >
            <div class="li-item-name">现场验收影像资料</div>
            <div class="li-item-content" style="justify-content: start;overflow:hidden">
              <div
                class="table-item-img"
                @click.stop="preview(handleImgUrl(item.url,0))"
                :style="'background: url('+ handleImgUrl(item.url,0) +')  no-repeat center/cover;'"
              ></div>
              <div
                class="table-item-img"
                @click.stop="preview(handleImgUrl(item.url,1))"
                :style="'background: url('+ handleImgUrl(item.url,1) +')  no-repeat center/cover;'"
              ></div>
              <!-- <img
                v-for="img in item.url.split(',')"
                :key="img"
                style="margin-right: 10px;"
                :style="'background: url('+ img +')  no-repeat center/cover;'"
                @click="preview(item.url)"
              >-->
            </div>
          </li>
          <li v-if="item.type==='content3'" :class="'li-height-4'">
            <div class="li-item-name">备注及其他</div>
            <div class="li-item-content">{{item.remark}}</div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="photoDialogVisible"
      :append-to-body="true"
      custom-class="photo-preview-dialog"
    >
      <img width="100%" :src="photoURL">
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'SimpleDetailForm',
  components: {

  },
  props: {
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      loading: true,
      id: '',
      type: null,
      photoURL: null,
      photoDialogVisible: false,
      detailFormVisible: false,
      detail: {}
    }
  },

  computed: {
    DetailForm () {
      let {
        acceptanceDate, //验收时间
        riskDescription,//排查项目
        controlsUrl,// 排查图片
        rectificationDate,//整改时限
        stateHiddenTrouble,//隐患等级
        reviewUrl,
        hiddenParameterCode,
        controlMsg,// 驳回意见
        planPrice,//整改资金
        remark,
        hiddenType,//排查分类
        identifyEvaluationStandard,//排查标准
        method,//排查方式
        structureName,//排查岗位
        hiddenFlowUrl,
        principalPersonnel,//整改责任人
        controlsTime,//第一部分 时间
        acceptancePersonnel,//验收责任人
        rectificationMeasures,//整改措施
        location,//排查部位
        inspectionName,//排查人员
        reviewName,//确认人
        reviewTime,
        reviewStructure//确认工位
      } = this.detail
      let formType = hiddenParameterCode ? hiddenParameterCode.match(/^[\d\D]*(?=T)/g)[0] : ''
      let content1 = { method, hiddenType, identifyEvaluationStandard, structureName, controlsTime, location, riskDescription, inspectionName, url: controlsUrl }
      let content2 = { reviewStructure,principalPersonnel, rectificationMeasures, planPrice, rectificationDate, stateHiddenTrouble, reviewTime, reviewName, url: reviewUrl }
      let content3 = { acceptanceDate, acceptancePersonnel, remark, url: hiddenFlowUrl }

      switch (formType) {
        case 'YHTZP5':
          return [
            { title: '隐患排查（！！！执行逾期！！！）', checkResult: '无隐患', checkTimeName: '逾期时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（因执行逾期无法确认）', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见及整改措施', imgName: '现场驳回影像资料及现场确认影像资料', type: 'content2', ...content2 },
            { title: '排查或隐患确认（因执行逾期无法确认）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1C5':
          return [
            { title: '隐患排查（按时执行）', checkResult: '无隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（！！！执行逾期！！！）', peopleType: '逾期工位', timeType: '逾期时间', measureName: '驳回意见及整改措施', imgName: '现场驳回影像资料及现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（因执行逾期无法确认）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1C0':
          return [
            { title: '隐患排查（按时执行）', checkResult: '无隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（执行中）', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见及整改措施', imgName: '现场驳回影像资料及现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（因执行中无法确认）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1C1':
          return [
            { title: '隐患排查（按时执行）', checkResult: '无隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（无隐患）', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见及整改措施', imgName: '现场驳回影像资料及现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（无隐患）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP0C2':
          return [
            { title: '隐患排查（按时执行）', checkResult: '无隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（按时执行）', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见', imgName: '现场驳回影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（无隐患）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y0':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（执行中）', peopleType: '确认工位', timeType: '确认时间', measureName: '驳回意见及整改措施', imgName: '现场驳回影像资料及现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（因执行中无法确认）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y1Z0':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（按时执行）', reviewResult: '存在隐患', peopleType: '确认人', timeType: '确认时间', measureName: '整改措施', imgName: '现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（执行中）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y5Z0':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（！！！执行逾期！！！）', reviewResult: '存在隐患', peopleType: '确认人', timeType: '确认时间', measureName: '整改措施', imgName: '现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（执行中）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y2':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（按时执行）', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见', imgName: '现场驳回影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（无隐患）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y3':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（！！！执行逾期！！！）', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见', imgName: '现场驳回影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（无隐患）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y1Z1':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（按时执行）', reviewResult: '存在隐患', peopleType: '确认人', timeType: '确认时间', measureName: '整改措施', imgName: '现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（按时执行）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y1Z5':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（按时执行）', reviewResult: '存在隐患', peopleType: '确认人', timeType: '确认时间', measureName: '整改措施', imgName: '现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（！！！执行逾期！！！）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y5Z1':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（！！！执行逾期！！！）', reviewResult: '存在隐患', peopleType: '确认人', timeType: '确认时间', measureName: '整改措施', imgName: '现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（按时执行）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y5Z5':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（！！！执行逾期！！！）', reviewResult: '存在隐患', peopleType: '确认人', timeType: '确认时间', measureName: '整改措施', imgName: '现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（！！！执行逾期！！！）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP0':
          return [
            { title: '隐患排查（执行中）', checkResult: '无隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（因执行中无法确认）', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见及整改措施', imgName: '现场驳回影像资料及现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（因执行中无法确认）', type: 'content3', ...content3 },
          ]
          break;
        case 'YHTZP1Y5':
          return [
            { title: '隐患排查（按时执行）', checkResult: '存在隐患', checkTimeName: '排查时间', type: 'content1', ...content1 },
            { title: '排查或隐患确认（！！！执行逾期！！！）', peopleType: '逾期工位', timeType: '确认时间', measureName: '驳回意见及整改措施', imgName: '现场驳回影像资料及现场确认影像资料', type: 'content2', ...content2 },
            { title: '隐患治理（因执行逾期无法确认）', type: 'content3', ...content3 },
          ]
          break;
        default:
          return [
            { title: '', checkTimeName: '排查时间', type: 'content1', url: '' },
            { title: '', peopleType: '确认人', timeType: '确认时间', measureName: '驳回意见', imgName: '现场驳回影像资料', type: 'content2', url: '' },
            { title: '', type: 'content3', url: '' },
          ]
          break;
      }


    }
  },

  methods: {
    ...mapActions('hiddenCheckControlBook', ['loadListData', 'getTree', 'filterListData', 'loadDetail']),

    async show (type) {
      this.detailFormVisible = true
      this.detail = await this.loadDetail(type)
      this.loading = false
    },

    preview (photoURL) {
      if (!photoURL) return false
      this.photoURL = photoURL
      this.photoDialogVisible = true
    },

    handleImgUrl (url, index) {
      return url.split(',')[index] ? url.split(',')[index] : ''
    },
  
    timeDesc (t) {
      return t ? dayjs(t).format('YYYY-MM-DD') : '-'
    },
  }
}
</script>

<style lang="scss">
.simple-detail-form-risk-assessment-third-dialog {
  .el-dialog {
    min-width: 1000px;
    .real-time-risk-assessment-third-body {
      li {
        min-height: 45px;
      }
      @for $i from 1 through 8 {
        .li-height-#{$i} {
          min-height: 45px * $i;
        }
      }
      .li-height-5 {
        .li-item-content {
          text-indent: 2em;
        }
      }
      border: 1px solid #e4f1fd;
      ul {
        list-style: none;
        margin: 0 !important;
        padding: 0 !important;
        > :last-child {
          border-bottom: 0 !important;
        }
        .li-item-title {
          padding: 10px 20px;
          font-size: 16px;
          font-weight: 800;
          box-sizing: border-box;
        }
        li {
          width: 100%;
          display: flex;
          border-bottom: 1px solid #e4f1fd;
          .li-item-first {
            border-right: 1px solid #e4f1fd;
            > div {
              height: 100%;
              display: flex;
              align-items: center;
            }
          }
          .li-item-first-double {
            border-right: 1px solid #e4f1fd;
            > div {
              width: 50%;
              height: 100%;
              display: flex;
              align-items: center;
            }
          }

          > div {
            width: 50%;
            height: auto;
            display: flex;
            align-items: center;
            .li-item-name {
              width: 30%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .li-item-content {
              align-items: center;
              justify-content: center;
              display: flex;
              width: 70%;
              flex-wrap: wrap;
              > span {
                margin-right: 5px;
                color: #37a9fa;
              }
            }
          }
          .li-item-name {
            width: 15%;
            text-align: center;
            height: auto;
            background-color: rgba(249, 253, 255, 1);
            box-sizing: border-box;
            border-right: 1px solid #e4f1fd;
            padding: 5px 10px;
            justify-content: center;
          }
          .li-item-content {
            width: 85%;
            box-sizing: border-box;
            align-items: center;
            justify-content: center;
            display: flex;
            padding: 5px 10px;
            .table-item-img {
              width: 50%;
              height: 100%;
              margin: 10px;
              &:hover {
                cursor: pointer;
              }
            }
            img {
              width: 45%;
              height: 100%;
              &:hover {
                cursor: pointer;
              }
            }
          }
          .li-item-table {
            width: calc(100% - 40px);
            margin: 0 20px 20px;
            .table {
              border-left-width: 1px;
            }
            .el-table td,
            .el-table th {
              padding: 5px 0;
            }
            .el-table__header-wrapper {
              thead tr th {
                background-color: rgba(249, 253, 255, 1);
              }
            }
          }
        }
      }
    }
  }
}
</style>
