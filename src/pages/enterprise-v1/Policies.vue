<template>
  <div class="page">
    <breadcrumb :items="[{ name: '消息' }]"></breadcrumb>

    <div class="page-main">
      <page-card v-loading="list.loading">
        <div class="policy-list">
          <div :class="['policy', { readed: policy.status === 1 }]"
            v-for="policy in list.items"
            :key="policy.id">
            <router-link class="title"
              :to="{ name: 'policy', params: { id: policy.id } }">
              <i class="el-icon-caret-right icon"></i>
              {{policy.title}}
            </router-link>
            <div class="date">{{policy.createDate | strftime}}</div>
          </div>
        </div>

        <div class="policy-list-footer" slot="footer">
          <el-pagination
            background
            layout="prev, pager, next, sizes, total"
            :pager-count="7"
            :total="list.total"
            :page-size="list.pageSize"
            :current-page="list.currentPage"
            @size-change="handlePageSizeChange"
            @current-change="loadListData({ page: $event })"
            @prev-click="loadListData({ page: $event })"
            @next-click="loadListData({ page: $event })">
          </el-pagination>
        </div>
      </page-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'Policies',

  components: {
    Breadcrumb,
    PageCard
  },

  computed: {
    ...mapState('policy', ['list'])
  },

  methods: {
    ...mapMutations('policy', ['setListPageSize']),
    ...mapActions('policy', ['loadListData']),

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    }
  },

  created() {
    this.loadListData({ reset: true })
  }
}
</script>

<style lang="scss" scoped>
.policy-list {
  .policy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 20px;
    margin-bottom: 10px;

    &.readed .title {
      color: #999;
    }

    .title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #4c4c4c;
      font-weight: 600;
      text-decoration: none;
      &:hover {
        color: #37A9FA;
      }

      .icon {
        margin-right: 4px;
      }
    }

    .date {
      font-size: 14px;
      color: #999;
      width: 100px;
      margin-right: 10px;
    }
  }
}

.policy-list-footer {
  padding: 5px 15px 6px 15px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;
}
</style>

