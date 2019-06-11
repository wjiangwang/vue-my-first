<template>
  <div class="check-control-book-table" v-loading="list.loading">
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
      <scroll-view style="height:100%;width:100%;">
        <ul class="book-table">
          <!-- TODO: 点击详情 -->
          <li
            class="table-item"
            v-for="(item,index) in list.items"
            :key="index"
            @click="simpleDetailForm.show(item.bookId)"
          >
            <div
              class="table-item-img"
              @click.stop="preview(item)"
              :style="'background: url('+ handelUrl(item) +')  no-repeat center/cover;'"
            ></div>
            <div class="table-item-content table-item-msg">
              <div>排查人：{{item.inspectionName||'-'}}</div>
              <div>确认人：{{item.reviewName||'-'}}</div>
              <div>排查时间：{{timeDesc(item.controlsTime||'')}}</div>
              <div>确认时间：{{timeDesc(item.reviewTime||'')}}</div>
            </div>
            <div class="code">{{item.hiddenParameterCode||'-'}}</div>
            <div
              class="table-item-status"
              :class="'table-item-hidden-level-'+item.stateHiddenTrouble"
            >{{item.stateHiddenTrouble}}</div>
            <div
              class="table-item-status"
              :class="'table-item-status-'+handleColor(item.flow)"
            >{{item.flow}}</div>
          </li>
        </ul>
      </scroll-view>
    </div>
    <div class="bottom-bar">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        @size-change="handlePageSizeChange($event)"
        @current-change="handlePageChange($event)"
        @prev-click="handlePageChange($event)"
        @next-click="handlePageChange($event)"
      ></el-pagination>
    </div>
    <!-- <hidden-danger-control-detail ref="controlDetail"></hidden-danger-control-detail>
    <hidden-danger-control-detail2 ref="controlDetail2"></hidden-danger-control-detail2>-->
    <el-dialog
      :visible.sync="photoDialogVisible"
      :append-to-body="true"
      custom-class="photo-preview-dialog"
    >
      <img width="100%" :src="photoURL">
    </el-dialog>
    <simple-detail-form ref="simpleDetailForm" :title="'详情表单'"></simple-detail-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Loading } from 'element-ui'
import ScrollView from '@/components/ScrollView'
import SimpleDetailForm from './SimpleDetailForm'


import dayjs from 'dayjs'



export default {
  name: 'CheckControlBookTable',

  components: {
    ScrollView,
    SimpleDetailForm
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
      photoDialogVisible: false,
      photoURL: '',
      dateRange: [],
      searchForm: {
        status: ''
      },
      options: [
        {
          label: '无隐患',
          value: 1
        },
        {
          label: '一般隐患',
          value: 2
        },
        {
          label: '重大隐患',
          value: 3
        }
      ]
    }
  },

  computed: {
    ...mapState('hiddenCheckControlBook', ['list']),

    controlDetail () {
      return this.$refs.controlDetail
    },
    controlDetail2 () {
      return this.$refs.controlDetail2
    },
    simpleDetailForm () {
      return this.$refs.simpleDetailForm
    },

  },

  methods: {
    ...mapMutations('hiddenCheckControlBook', ['setListParams', 'setListPageSize', 'setListData']),
    ...mapActions('hiddenCheckControlBook', [
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
        status: this.searchForm.status,
        startAt, endAt
      })
    },
    handleColor (status) {
      switch (true) {
        case status.indexOf("完成") !== -1:
          return 1
          break
        case status.indexOf("整改") !== -1:
          return 2
          break
        case status.indexOf("逾期") !== -1:
          return 3
          break
        case status.indexOf("驳回") !== -1:
          return 4
          break;
        default:
          return 1
          break
      }
    },

    handelUrl (item) {
      return item.hiddenFlowUrl ? item.hiddenFlowUrl.split(',')[0] : (item.reviewUrl ? item.reviewUrl.split(',')[0] : (item.controlsUrl ? item.controlsUrl.split(',')[0] : 'static/images/no-picture.png'))
    },

    preview (photoURL) {
      console.log(photoURL)
      this.photoURL = this.handelUrl(photoURL)
      // if (this.photoURL === 'static/images/no-picture.png') return false
      this.photoDialogVisible = true
    },


    timeDesc (t) {
      return t ? dayjs(t).format('YYYY-MM-DD') : '-'
    },

    showDetail () {

    }

  },

  created () {
    this.setListPageSize(10)
    this.setListParams({ hiddenTypes: '' })
  }
}
</script>

<style lang="scss" scoped>
.check-control-book-table {
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
    border-right: 0;

    border-radius: 4px;
  }
  .book-table {
    margin: 20px 20px 50px 20px;
    .table-item {
      padding-right: 10px;
      width: 100%;
      height: 100px;
      border: 1px solid #d7e3eb;
      border-radius: 5px;
      margin: 10px 0;
      display: flex;
      align-items: center;

      position: relative;
      .code {
        position: absolute;
        font-size: 12px;
        color: #666;
        top: 5px;
        right: 5px;
      }
      &:hover {
        cursor: pointer;
      }
      .table-item-img {
        margin: 5px 10px 5px 10px;
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
        width: 50%;
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        /*color: white;*/
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
      .table-item-status {
        width: 15%;
        height: 100%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      /*.contorl-status3 {
          background-color: #67C23A;
        }

        .contorl-status5 {
          background-color: #fa5878;
        }*/

      .table-item-hidden-level-无隐患 {
        color: #cccccc;
      }
      .table-item-hidden-level-一般隐患 {
        color: #f4d341;
      }
      .table-item-hidden-level-重大隐患 {
        color: #f7454a;
      }

      .table-item-status-1 {
                width: 20%;
        color: #30c9c8;
      }
      .table-item-status-2 {
                width: 20%;
        color: #f49e41;
      }
      .table-item-status-3 {
                width: 20%;
        color: #f7454a;
      }
      .table-item-status-4 {
                width: 20%;
        color: #37a9fa;
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
