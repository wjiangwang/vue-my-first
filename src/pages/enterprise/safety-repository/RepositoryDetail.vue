<template>
  <div class="page">
    <div class="page-main">
      <breadcrumb :items="[{ name: '安全知识库', route: {path: $resolveRoutePath('safety-repository/repository')} }, { name: '详情' }]"></breadcrumb>

      <page-card :scrollable="false" v-loading="loading">
        <div v-html="securityRepositoryInfo.details" class="repository-detail-html">
        </div>
      </page-card>
    </div>
  </div>
</template>
<style type="text/css" scoped>
  .repository-detail-html {
    width: 90%;
    padding: 20px;
    margin: auto;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
</style>
<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import DataTable from '@/components/DataTable'
  import PageCard from '@/components/PageCard'

  const tableColumns = [
    { title: '标题', name: 'title' },
    { title: '发布时间', name: 'releaseDate', type: 'date', width: "180"},
    { title: '操作', name: '__slot:actions', width: "180"}
  ]

  export default {
    name: 'managerTraining',

    components: {
      DataTable,
      PageCard,
      Breadcrumb
    },

    data() {
      return {
        loading: false,
        securityRepositoryInfo: {
          details: ''
        }
      }
    },

    methods: {
      ...mapActions('securityRepository', ['load'])
    },

    async created() {
      this.loading = true
      this.securityRepositoryInfo = await this.load(this.$route.params.id)
      this.loading = false
    }
  }
</script>
