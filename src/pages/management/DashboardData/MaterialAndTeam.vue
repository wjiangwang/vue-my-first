<template>
  <div @click.stop="$event.stopPropagation()">
    <el-dialog
      class="material-and-team"
      :visible.sync="visible"
      :title="title"
      width="600px"
      @close="handleClose"
      :modal="true"
    >
      <data-table
        v-loading="list.loading"
        :columns="tableColumns"
        :data="list.items"
        :showBottomBar="false"
        :height="400"
        :border="false"
        class="material-and-team-table"
      >
        <!-- <div slot="actions" slot-scope="{ row }" class="table-actions">
          <el-button
            type="text"
            size="medium"
            @click="detailRescueResource.show({ id: row.id, readonly: true })"
          >详情</el-button>
        </div>-->
      </data-table>
    </el-dialog>

    <!-- <rescue-resource-form :readonly="true" ref="detailRescueResource"></rescue-resource-form> -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import DataTable from '@/components/DataTable'
// import RescueResourceForm from '@/pages/enterprise/contingency-resource-management/RescueResourceForm.vue'




export default {
  name: 'DashboardEnterprises',

  components: {
    DataTable,
    // RescueResourceForm
  },

  data () {
    return {
      visible: false,
      type: null,
      title: '',
      list: {
        loading: false,
        items: []
      }
    }
  },

  computed: {
    detailRescueResource () {
      return this.$refs.detailRescueResource
    },
    tableColumns () {
      switch (this.type) {
        case 'equipment':
          return [
            { title: '名称', name: 'equipmentName' },
            { title: '类型', name: 'equipmentType' },
            { title: '数量', name: 'number' },
            { title: '电话', name: 'phone' },
            // { title: '操作', name: '__slot:actions' }
          ]
          break
        case 'rescueTeam':
          return [
            { title: '名称', name: 'rescueTeamName' },
            { title: '等级', name: 'qualificationLevel' },
            { title: '类型', name: 'rescueTeamType' },
            { title: '值班电话', name: 'onDutyPhone' },
            // { title: '操作', name: '__slot:actions' }
          ]
          break
      }
    }
  },

  methods: {

    show (info) {
      if (info.length < 1) return
      this.visible = true
      this.title = info[0].equipmentType ? '救援物资信息' : '救援队伍信息'
      this.type = info[0].equipmentType ? 'equipment' : 'rescueTeam'
      this.list.items = info
    },



    handleEnterpriseClick (enterpriseId) {
      this.$router.push({
        name: 'emap-risk-planar-graph',
        params: { enterpriseId }
      })
    },

    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>



.material-and-team-table {
  margin: -20px -15px;
  /deep/ .toolbar {
    display: none;
  }

  .link-name {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
