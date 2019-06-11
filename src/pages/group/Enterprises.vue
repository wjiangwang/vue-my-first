<template>
  <div class="page">
    <breadcrumb :items="[{ name: '一企一档' }]"></breadcrumb>

    <scroll-view class="page-main"
      v-loading="list.loading">
      <div class="header">
        <div class="left">
          <el-form :inline="true" :model="searchForm" label-suffix=":">
            <resource-input label="企业类型"
              name="enterpriseGrade"
              resource-name="enterpriseType"
              :value="searchForm.enterpriseGrade"
              @input="searchForm.enterpriseGrade = $event">
            </resource-input>
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
        <div class="right">
        </div>
      </div>

      <div class="list">
        <div @click="handleToEnterprise(enterprise.id)"
          v-for="enterprise in list.items"
          :key="enterprise.id"
          tag="div">
          <el-card class="enterprise-card" shadow="hover">
            <div class="name">
              {{enterprise.enterpriseName}}
              <el-tag class="status-tag" type="success" size="medium">有效</el-tag>
            </div>

            <ul class="detail">
              <li>法人：{{enterprise.corpdeleg}}</li>
              <li>法人电话：{{enterprise.corpdelegMpho}}</li>
              <li>位置：{{enterprise.address}}</li>
            </ul>
          </el-card>
        </div>
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
import { Loading } from 'element-ui'
import ScrollView from '@/components/ScrollView'
import Breadcrumb from '@/components/Breadcrumb'
import { MessageBox } from 'element-ui'

export default {
  name: 'Enterprises',

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
    ...mapActions('enterprise', ['loadListData', 'filterListData', 'delete', 'getEnterpriseToken']),

    search() {
      this.filterListData(this.searchForm)
    },

    async handleToEnterprise (uuid) {
      let result = await this.getEnterpriseToken(uuid)
      if (result && result.token) {
        // window.open('/enterprise#/?token=' + result.token + '&isRedirect=true' + '&nickname=' + result.user.nickname)
        window.open('http://staging.e.sccitysafety.com/#/?token=' + result.token + '&isRedirect=true' + '&nickname=' + result.user.nickname)
      }
      //  else {
      //   MessageBox.alert('没有关联该企业不能跳转')
      // }
    },

    handlePageSizeChange(pageSize) {
      this.setListPageSize(pageSize)
      this.loadListData()
    },

    handlePageChange(currentPage) {
      this.loadListData({ page: currentPage })
    },

    deleteEnterprise(id) {
      this.$confirm('确认删除该企业？', '确认删除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })

            await this.delete(id)
            loading.close()
            done()
          } else {
            done()
          }
        }
      })
    }
  },

  created() {
    const reset = this.$route.query.reset !== undefined ? this.$route.query.reset : true
    if (!reset) {
      this.searchForm.enterpriseGrade = this.list.filterParams.enterpriseGrade
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
    cursor: pointer;

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
        margin-right: 15px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
