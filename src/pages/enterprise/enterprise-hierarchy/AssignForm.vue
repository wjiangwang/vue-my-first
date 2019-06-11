<template>
  <el-dialog :visible.sync="visible"
    :title="`分配${assignableName}`"
    width="800px"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="handleDialogOpen"
    @closed="handleDialogClosed">
    <el-button type="primary" @click="handleRisks" v-if="assignableType === 'risk'" class="screening-risk-button">
      {{screening === 1 ? '闲置风险点' : '可分配风险点'}}
    </el-button>
    <el-transfer v-model="assignedItems"
      :data="assignableItems"
      :props="transferProps"
      :filterable="true"
      :titles="[`可分配的${assignableName}`, `已选择的${assignableName}`]"
      :button-texts="['移除至', '分配至']"
      :filter-method="filterAssignableItems"
      class="assign-form-transfer"
      v-if="showTransfer">
    </el-transfer>

    <div class="form-buttons" slot="footer">
      <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HierarchyAssignForm',

  props: {
    assignableType: {
      type: String,
      required: true,
      validator: function (value) {
        return ['employee', 'risk', 'jobChild'].indexOf(value) !== -1
      }
    },

    jobId: {
      type: Number,
      required: true
    },

    childHierarchy: Number
  },

  data() {
    return {
      visible: false,
      showTransfer: false,
      loading: false,
      submitting: false,
      assignableItems: [],
      assignedItems: [],
      screening: 1
    }
  },

  computed: {
    ...mapState('hierarchyJob', { jobs: 'items' }),

    assignableName() {
      switch (this.assignableType) {
      case 'employee':
        return '员工'
      case 'risk':
        const job = this.jobs.find(job => job.id === this.jobId)
        return job && job.structureType === 2 ? '实时作业' : '风险点'
      case 'jobChild':
        switch (this.childHierarchy) {
        case 1:
          return '岗位'
        case 2:
          return '班组'
        case 3:
          return '部门'
        }
      }
    },

    transferProps() {
      switch (this.assignableType) {
      case 'employee':
        return { key: 'id', label: 'nickname' }
      case 'risk':
        return { key: 'id', label: 'name' }
      case 'jobChild':
        return { key: 'id', label: 'name' }
      }
    }
  },

  methods: {
    ...mapActions('hierarchyJobEmployee', ['loadAssignableEmployees', 'assignEmployees']),
    ...mapActions('hierarchyJobRisk', ['loadAssignableRisks', 'assignRisks']),
    ...mapActions('hierarchyJobChild', ['loadAssignableChildren', 'assignChildren']),

    show() {
      this.visible = true
      this.showTransfer = true
      this.loading = true
    },

    async handleRisks () {
      this.assignableItems = []
      this.assignedItems = []
      if (this.screening === 1) {
        this.screening = 2
      } else {
        this.screening = 1
      }
      this.assignableItems = await this.loadAssignableRisks({ jobId: this.jobId, screening: this.screening })
    },

    async handleDialogOpen() {
      switch (this.assignableType) {
      case 'employee':
        this.assignableItems = await this.loadAssignableEmployees({ jobId: this.jobId })
        break
      case 'risk':
        this.assignableItems = await this.loadAssignableRisks({ jobId: this.jobId, screening: this.screening })
        break
      case 'jobChild':
        this.assignableItems = await this.loadAssignableChildren({
          jobId: this.jobId,
          hierarchy: this.childHierarchy
        })
        break
      }

      this.loading = false
    },

    filterAssignableItems(query, item) {
      return item[this.transferProps.label].indexOf(query) !== -1
    },

    async submit() {
      if (this.assignedItems.length === 0) return

      this.submitting = true

      let submitMethod
      switch (this.assignableType) {
      case 'employee':
        submitMethod = 'assignEmployees'
        break
      case 'risk':
        submitMethod = 'assignRisks'
        break
      case 'jobChild':
        submitMethod = 'assignChildren'
        break
      }

      await this[submitMethod]({ jobId: this.jobId, ids: this.assignedItems })
      this.submitting = false
      this.visible = false
    },

    handleDialogClosed() {
      this.showTransfer = false
      this.assignedItems = []
      this.screening = 1
    }
  }
}
</script>

<style lang="scss" scoped>
  .screening-risk-button {
    width: 100px;
    padding: 8px 0;
    position: absolute;
    top: 34%;
    left: calc(50% - 50px);
    z-index: 2;
  }
  .assign-form-transfer /deep/ .el-transfer-panel {
    width: 310px;

    .el-transfer-panel__body {
      height: 340px;

      .el-transfer-panel__list.is-filterable {
        height: 288px;
      }

      .el-transfer-panel__item {
        height: auto;
        margin: 10px 0;

        .el-checkbox__input {
          top: 3px;
        }

        .el-checkbox__label {
          white-space: normal;
          line-height: normal;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
</style>

