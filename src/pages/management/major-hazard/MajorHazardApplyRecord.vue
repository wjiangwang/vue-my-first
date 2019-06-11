<template>
  <el-dialog :title="isRecord || isCancel ? '审核记录' : '申请记录'" :visible.sync="visible" @close="clear" class="major-hazard-apply-records-dialog">
    <data-table :columns="tableColumns" :show-bottom-bar="false" :height="400"
      :data="recordsList.items" v-loading="recordsList.loading">
      <template slot="declarationRecordType" slot-scope="{ row }">
        <span>
          <el-button type="text" v-if="isRecord || isCancel" @click="row.declarationRecordType === 2 ? majorHazardApproveCancel.show({cancelAfterVerificationId: row.cancelAfterVerificationId}) : majorHazardApproveDetail.show(row.majorHazardId)">
            {{applyStatusText(row.declarationRecordType)}}
          </el-button>
          <el-button type="text" @click="row.declarationRecordType === 2 ? majorHazardCancel.show({cancelAfterVerificationId: row.cancelAfterVerificationId}) : majorHazardDetail.show(row.majorHazardId)" v-else>
            {{applyStatusText(row.declarationRecordType)}}
          </el-button>
        </span>
      </template>

      <template slot="status" slot-scope="{ row }">
        <span :class="['status', `status-${row.status}` ]">
          {{statusText(row.status)}}
        </span>
      </template>
    </data-table>

    <!-- 危险源核销详情 -->
    <major-hazard-cancel ref="majorHazardCancel" :is-enterprise="true" :disabled="true" :append-to-body="true"></major-hazard-cancel>
    <!-- 危险源详情 -->
    <major-hazard-detail ref="majorHazardDetail" :is-enterprise="true" :append-to-body="true"></major-hazard-detail>

    <!-- 危险源核销审核详情 -->
    <major-hazard-cancel ref="majorHazardApproveCancel" :disabled="true" :append-to-body="true"></major-hazard-cancel>
    <!-- 危险源备案审核详情 -->
    <major-hazard-detail ref="majorHazardApproveDetail" :disabled="true" :append-to-body="true"></major-hazard-detail>
  </el-dialog>
</template>
<style lang="scss">
  .major-hazard-apply-records-dialog {
    .el-dialog {
      width: 1000px;
      .data-table {
        .table {
          border-left-width: 1px;
        }
      }
    }
  }
</style>
<script>
  import { mapActions, mapState } from 'vuex'
  import FormDialog from '@/components/FormDialog'
  import DataTable from '@/components/DataTable'
  import MajorHazardCancel from './MajorHazardCancel'
  import MajorHazardDetail from './MajorHazardDetail'

  const tableColumns = [
    { title: '申请时间', name: 'createDate', type: 'date' },
    { title: '申请人', name: 'declarationRecordName' },
    { title: '申请信息', name: '__slot:declarationRecordType' },
    { title: '状态', name: '__slot:status' },
    { title: '备注原因', name: 'memo' },
  ]

  export default {
    name: 'majorHazardApplyRecords',

    components: {
      FormDialog,
      DataTable,
      MajorHazardCancel,
      MajorHazardDetail
    },

    props: {
      isRecord: {
        type: Boolean,
        default: false
      },
      isCancel: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: false,
        majorHazardCode: null,
        tableColumns
      }
    },

    computed: {
      ...mapState('majorHazard', ['recordsList']),

      majorHazardCancel() {
        return this.$refs.majorHazardCancel
      },

      majorHazardDetail() {
        return this.$refs.majorHazardDetail
      },

      majorHazardApproveCancel() {
        return this.$refs.majorHazardApproveCancel
      },

      majorHazardApproveDetail() {
        return this.$refs.majorHazardApproveDetail
      }
    },

    methods: {
      ...mapActions('majorHazard', ['loadRecord']),

      async show(majorHazardCode, type = '') {
        this.visible = true
        await this.loadRecord({majorHazardCode: majorHazardCode, type: type})
      },

      handleInfo () {

      },

      applyStatusText(level) {
        switch (level) {
        case 1:
          return '申报信息'
        case 2:
          return '核销信息'
        }
      },

      statusText(status) {
        switch (status) {
        case 1:
          return '申报通过'
        case 2:
          return '申报驳回'
        case 3:
          return '核销申请中'
        case 4:
          return '已核销'
        case 5:
          return '核销驳回'
        default:
          return '申报中'
        }
      },

      clear () {
        this.visible = false
      }
    }
  }
</script>
