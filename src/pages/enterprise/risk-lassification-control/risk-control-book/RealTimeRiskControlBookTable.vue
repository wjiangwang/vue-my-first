<template>
  <div class="real-time-risk-control-book-table" v-loading="list.loading">
    <div class="left">
      <el-form :inline="true" :model="searchForm" label-suffix=":" size="small">
        <date-range-input label name="dateRange" @input="dateRange = $event"></date-range-input>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="scroll-warp">
      <scroll-view style="height:100%; width:100%;">
        <ul class="book-table" v-if="list.params.threeId===69088">
          <li
            class="table-item"
            v-for="(item,index) in list.items"
            :key="index"
            :style="'background-color:'+item.color"
            @click="controlDetail.show(item.riskStandingId, item.threeId)"
          >
            <div class="table-item-img">
              <img
                :src="item.url ? handelUrl(item.url) : 'http://iph.href.lu/320x180?text=%E5%81%87%E8%A3%85%E4%B8%80%E5%BC%A0%E8%AF%81%E4%B9%A6'"
                @click.stop="item.url ?preview(item.url):''"
              >
            </div>
            <div
              class="table-item-content table-item-msg-nuControl"
              :class="`risk-level${item.riskLevel}-color`"
              v-if="item.level === 0 && item.status === 5"
            >
              <div>责任岗位：</div>
              <div style="text-align: center;">{{item.inspectionName}}</div>
              <div>逾期时间：{{timeDesc(item.beyondDate)}}</div>
            </div>
            <div
              class="table-item-content table-item-msg"
              :class="`risk-level${item.riskLevel}-color`"
              v-if="item.level && item.status === 5"
            >
              <div>管控人：{{item.inspectionName}}</div>
              <div>{{reviewLayer(item.level)}}：{{item.reviewName}}</div>
              <div>管控时间：{{timeDesc(item.controlsTime)}}</div>
              <div>逾期时间：{{timeDesc(item.beyondDate)}}</div>
            </div>
            <div
              class="table-item-content table-item-msg"
              :class="`risk-level${item.riskLevel}-color`"
              v-if="item.status === 3"
            >
              <div>证书名称：{{item.inspectionName}}</div>
              <div>发证时间：{{item.reviewName}}</div>
              <div>到期时间：{{timeDesc(item.controlsTime)}}</div>
              <div>复核时间：{{item.controlLevel === '岗位' ? timeDesc(item.controlsTime) : timeDesc(item.reviewTime)}}</div>
            </div>
            <!-- <div
              class="table-item-status"
              :class="`contorl-status${item.status}`"
            >{{statusDesc(item.level, item.status)}}</div>-->
          </li>
        </ul>

        <!-- TODO:不同Type -->

        <ul class="book-table" v-else>
          <li
            class="table-item-work"
            v-for="(item,index) in mockData"
            :key="index"
            :style="'background-color:'+item.color"
          >
            <!-- ---------------------------------------- -->
            <el-collapse class="real-time-collapse">
              <el-collapse-item>
                <template slot="title">
                  <div class="real-time-table-item">
                    <div class="table-item-img">
                      <div class="work-level">
                        <div>作业等级：一级动火</div>
                      </div>
                      <!-- <img
                :src="item.url ? handelUrl(item.url) : 'static/images/yuqitupian.png'"
                @click.stop="item.url ?preview(item.url):''"
                      >-->
                    </div>
                    <div
                      class="table-item-content table-item-msg"
                      :class="`risk-level${item.riskLevel}-color`"
                    >
                      <div>作业时间：{{timeDesc(item.time)}}</div>
                      <div>作业地点：{{item.content}}</div>
                      <div>发起作业人员：{{item.people}}</div>
                    </div>
                    <div
                      class="table-item-status"
                      :class="`contorl-status${item.status}`"
                    >{{statusDesc(item.level, item.status)}}</div>
                  </div>
                </template>
                <div class="real-time-third-table">
                  <data-table
                    :columns="tableColumns"
                    :data="realTimeThirdTableData"
                    :showBottomBar="false"
                    :border="false"
                    :stripe="true"
                    :height="'100%'"
                  >
                    <div slot="actions" slot-scope="{ row }" class="table-actions">
                      <el-button type="text" size="medium">详情</el-button>
                    </div>
                  </data-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </li>
          <!-- TODO:不同Type -->
        </ul>
      </scroll-view>
    </div>
    <div class="bottom-bar">
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        @size-change="handlePageSizeChange($event)"
        @current-change="handlePageChange($event)"
        @prev-click="handlePageChange($event)"
        @next-click="handlePageChange($event)"
      ></el-pagination>
    </div>
    <el-dialog
      :visible.sync="photoDialogVisible"
      :append-to-body="true"
      custom-class="photo-preview-dialog"
    >
      <img width="100%" :src="photoURL">
    </el-dialog>
    <risk-danger-control-detail ref="controlDetail"></risk-danger-control-detail>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import DataTable from '@/components/DataTable'
import ScrollView from '@/components/ScrollView'
import RiskDangerControlDetail from './RiskDangerControlDetail'
import dayjs from 'dayjs'

const tableColumns = [
  { title: '作业类型', name: 'type', width: '130px' },
  { title: '作业内容', name: 'content' },
  { title: '完成时间', name: 'time', width: '120px' },
  { title: '人员', name: 'people', },
  { title: '操作', name: '__slot:actions', width: '120px' }
]
export default {
  name: 'RiskControlBookTable',

  components: {
    ScrollView,
    DataTable,
    RiskDangerControlDetail
  },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },

    isRedirect: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      tableColumns,
      realTimeThirdTableData: [{
        time: '2019-04-02',
        people: '索怀财',
        content: '动火作业可能未按要求进行分级管理',
        type: '动火作业',

      }, {
        time: '2019-04-02',
        people: '李春霞',
        content: '五级风以上天气，动火作业可能未升级管理',
        type: '动火作业',
      }, {
        time: '2019-04-02',
        people: '张莉',
        content: '动火作业可能未有专人监火，或未采取有效安全防火措施',
        type: '动火作业',
      }, {
        time: '2019-04-02',
        people: '雷波',
        content: '动火作业可能不符合甲、乙类区域作业要求',
        type: '动火作业',
      }
      ],
      ///////
      mockData: [{
        time: '2019-04-02',
        people: '任建国',
        content: '甲醇厂区（检修作业、特殊作业）',
        type: '动火作业',

      }, {
        time: '2019-04-03',
        people: '任建国',
        content: '压缩区（压缩作业',
        type: '动火作业',
      }, {
        time: '2019-04-04',
        people: '任建国',
        content: '水处理区（水处理作业）',
        type: '动火作业',
      }, {
        time: '2019-04-05',
        people: '任建国',
        content: '化检验（化验）',
        type: '动火作业',
      }
      ],
      photoURL: null,
      photoDialogVisible: false,
      options: [
        {
          label: '已完成',
          value: 1
        },
        {
          label: '正在进行',
          value: 2
        }
      ],
      dateRange: [],
      searchForm: {
        keywords: null,
        status: ''
      },
    }
  },

  computed: {
    ...mapState('riskControlLedger', ['list']),

    controlDetail () {
      return this.$refs.controlDetail
    }


  },

  methods: {
    ...mapMutations('riskControlLedger', ['setListParams', 'setListPageSize', 'setListData']),
    ...mapActions('riskControlLedger', [
      'loadListData', 'filterListData']),

    handlePageSizeChange (pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    handlePageChange (v) {
      this.setListParams({ current: v })
      this.loadListData()
    },

    search () {
      let [startAt, endAt] = this.dateRange || []
      startAt = startAt ? dayjs(startAt).format('YYYY-MM-DD') : ''
      endAt = endAt ? dayjs(endAt).format('YYYY-MM-DD') : ''
      this.filterListData({
        keywords: this.searchForm.keywords,
        status: this.searchForm.status,
        startAt, endAt
      })
    },

    handelUrl (url) {
      return url.split(',')[0]
    },

    preview (photoURL) {
      this.photoURL = photoURL
      this.photoDialogVisible = true
    },

    timeDesc (t) {
      return t ? dayjs(t).format('YYYY-MM-DD') : '-'
    },

    statusDesc (level, status) {
      if (status === 5) {
        switch (level) {
          case 0:
            return '正在进行'
          case 1:
            return '一级逾期'
          case 2:
            return '二级逾期'
          case 3:
            return '三级逾期'
        }
      } else if (status === 3) {
        return '已完成'
      } else {
        return ''
      }
    },

    reviewLayer (level) {
      switch (level) {
        case 1:
          return '复核班组'
        case 2:
          return '复核部门'
        case 3:
          return '复核企业'
      }
    }
  },

  created () {
    this.setListData({
      total: 0,
      items: []
    })
  }
}
</script>

<style lang="scss">
.real-time-risk-control-book-table {
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  position: relative;
  .left {
    margin-left: 20px;
  }
  .scroll-warp {
    height: calc(100% - 100px);
    width: 100%;
    border: 1px solid #ebeef5;
    border-left: none;
    border-right: none;
    border-radius: 4px;
  }
  .book-table {
    margin: 20px 20px 50px 20px;
    .table-item {
      width: 100%;
      height: 100px;
      // border: 1px solid #d7e3eb;
      border-radius: 10px;
      background-color: #dcd9d4;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);

      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover {
        cursor: pointer;

        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.19),
          0 6px 10px rgba(0, 0, 0, 0.23);
      }

      .table-item-img {
        .work-level {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          background-color: #fb728e;
          border-radius: 10px;
          padding: 0 2px;

          div:nth-child(1) {
            color: white;
          }
        }
        margin: 5px 10px;
        height: 90px;
        width: 160px;
        display: flex;
        justify-content: center;
        img {
          height: 100%;
          width: auto;
          max-width: 160px;
        }
      }
      .table-item-content {
        width: calc(86% - 170px);
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        color: white;
        border-radius: 15px;
      }
      .table-item-msg-nuControl {
        position: relative;
        > :first-child {
          margin: 5px 0 0 0;
        }
        > :last-child {
          position: absolute;
          bottom: 5px;
        }
      }
      .table-item-msg {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        div {
          width: 50%;
        }
      }
      .risk-level1-color {
        background-color: #fb728e;
      }
      .risk-level2-color {
        background-color: #fea340;
      }
      .risk-level3-color {
        background-color: #fbc02d;
      }
      .risk-level4-color {
        background-color: #00bcd4;
      }

      .table-item-status {
        height: 100%;
        width: 80px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5px 10px;
        box-sizing: border-box;
        border-radius: 10px;
      }
      .contorl-status3 {
        background-color: #4caf50;
      }

      .contorl-status5 {
        background-color: #fb728e;
      }
    }
    .table-item-work {
      @extend .table-item;
      .real-time-third-table {
        /deep/ .toolbar {
          display: none;
        }
        width: 100%;
      }
      height: auto;
      flex-direction: column;
      background: none;
      border-radius: 10px;
      .real-time-collapse {
        width: 100%;
        border: none;
        background: none;
        .el-collapse-item__arrow {
          display: none;
        }
        .el-collapse-item__header {
          height: auto;
          background: none;
          line-height: inherit;
          cursor: pointer;
          font-size: inherit;
          border-bottom: none;
          font-weight: inherit;
          transition: border-bottom-color 0.3s;
          outline: 0;
        }
      }

      .real-time-table-item {
        margin: 0px 0px;
        border-radius: 10px;
        background-color: #dcd9d4;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100px;
        .table-item-status {
          margin: 0 10px;
        }
      }
    }
  }
  .bottom-bar {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
