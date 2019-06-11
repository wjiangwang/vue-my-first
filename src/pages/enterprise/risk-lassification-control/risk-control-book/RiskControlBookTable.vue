<template>
  <div class="risk-control-book-table" v-loading="list.loading">
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
        <ul class="book-table">
          <!-- TODO: 点击详情 -->
          <li
            class="table-item"
            v-for="(item,index) in list.items"
            :key="index"
            :style="'background-color:'+item.color"
            @click="controlDetail.show(item.riskStandingId, item.threeId)"
          >
            <div
              class="table-item-img"
              @click.stop="item.url ?preview(item.url):''"
              :style="'background: url('+ handelUrl(item) +')  no-repeat center/cover ;'"
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
              <div>管控人：{{item.inspectionName}}</div>
              <div>复核人：{{item.reviewName}}</div>
              <div>管控时间：{{timeDesc(item.controlsTime)}}</div>
              <div>复核时间：{{item.controlLevel === '岗位' ? timeDesc(item.controlsTime) : timeDesc(item.reviewTime)}}</div>
            </div>
            <div
              class="table-item-status"
              :class="`contorl-status${item.status}`"
            >{{statusDesc(item.level, item.status)}}</div>
          </li>
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
import ScrollView from '@/components/ScrollView'
import RiskDangerControlDetail from './RiskDangerControlDetail'
import dayjs from 'dayjs'

export default {
  name: 'RiskControlBookTable',

  components: {
    ScrollView,
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
      photoURL: null,
      photoDialogVisible: false,
      options: [
        {
          label: '已完成',
          value: 1
        },
        {
          label: '管控逾期',
          value: 2
        },
        {
          label: '班组逾期',
          value: 3
        },
        {
          label: '部门逾期',
          value: 4
        },
        {
          label: '公司逾期',
          value: 5
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

    handelUrl (item) {
      return item.url ? item.url.split(',')[0] : 'static/images/yuqitupian.png'
    },

    preview (photoURL) {
      console.log(photoURL)
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
            return '管控逾期'
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

<style lang="scss" scoped>
.risk-control-book-table {
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
  }
  .bottom-bar {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
