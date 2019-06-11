<template>
  <div class="page">
    <breadcrumb :items="[{ name: '企业端用户管理' }]"></breadcrumb>

    <scroll-view class="page-main"
      v-loading="list.loading">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" label-suffix=":">
          <district-input label="行政区划"
            name="areaPath"
            :select-any="true"
            value-prop="path"
            :value="searchForm.areaPath"
            @input="searchForm.areaPath = $event">
          </district-input>
          <string-input label="企业名称"
            placeholder="请输入关键字"
            name="keywords"
            :value="searchForm.keywords"
            @input="searchForm.keywords = $event">
          </string-input>

          <el-form-item>
            <el-button type="primary"
              icon="el-icon-search"
              size="medium"
              @click="search">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="list">
        <el-card class="enterprise-card"
          v-for="enterprise in list.items"
          :key="enterprise.id">
          <div class="name">
            {{enterprise.enterpriseName}}
            <el-tag class="status-tag" type="success" size="medium">有效</el-tag>
          </div>

          <ul class="detail">
            <li>法人：{{enterprise.corpdeleg}}</li>
            <li>法人电话：{{enterprise.corpdelegMpho}}</li>
            <li>位置：{{enterprise.address}}</li>
          </ul>

          <div class="actions">
            <router-link :to="{ name: 'enterprise-users', params: { id: enterprise.id }, query: { name: enterprise.enterpriseName } }">
              <img src="@/assets/icons/user-setting.png">
            </router-link>
          </div>
        </el-card>
      </div>
    </scroll-view>

    <div class="page-footer is-pagination">
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :total="list.total"
        :page-size="list.pageSize"
        :current-page="list.currentPage"
        @size-change="handlePageSizeChange"
        @prev-click="handlePageChange"
        @next-click="handlePageChange"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ScrollView from '@/components/ScrollView'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'EnterpriseUserIndex',

  components: {
    ScrollView,
    Breadcrumb
  },

  data() {
    return {
      searchForm: {
        areaPath: null,
        keywords: null
      }
    }
  },

  computed: {
    ...mapState('enterprise', ['list'])
  },

  methods: {
    ...mapMutations('enterprise', ['setListParams', 'setListPageSize']),
    ...mapActions('enterprise', ['loadListData', 'filterListData']),

    search() {
      this.filterListData(this.searchForm)
    },

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    handlePageChange(currentPage) {
      this.loadListData({ page: currentPage })
    }
  },

  created() {
    const reset = this.$route.query.reset !== undefined ? this.$route.query.reset : true
    if (!reset) {
      this.searchForm.areaPath = this.list.filterParams.areaPath
      this.searchForm.keywords = this.list.filterParams.keywords
    }
    this.loadListData({ reset })
  }
}
</script>

<style lang="scss" scoped>
.list {
  .enterprise-card {
    margin-bottom: 10px;
    position: relative;

    .name {
      font-size: 16px;
      line-height: 21px;
      color: #333;
      font-weight: 500;

      .status-tag {
        margin-left: 8px;
      }
    }

    .detail {
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;

      li {
        margin-right: 28px;
        color: #666;
      }
    }

    .actions {
      position: absolute;
      right: 30px;
      top: 50%;
      margin-top: -20px;
      
      a {
        display: inline-block;
        width: 40px;
        height: 40px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
