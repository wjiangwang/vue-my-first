<template>
  <div class="page">
    <breadcrumb :items="breadcrumbItems"></breadcrumb>

    <div class="page-main">
      <page-card v-loading="loading">
        <div class="title">{{policy.title}}</div>

        <div class="info" v-if="isAdmin">
          <span>分类：{{policy.titleType}}</span>
          <span>区域：{{policy.districtName}}</span>
          <span>发送时间：{{policy.createDate | strftime}}</span>
          <span class="summary">摘要：{{policy.digest}}</span>
        </div>
        <div class="info centered" v-else>
          <span>时间：{{policy.createDate | strftime}}</span>
        </div>

        <div class="content">
          <span v-html="policy.textBody"></span>
        </div>

        <div class="footer" slot="footer" v-if="policy.accessory">
          <img src="@/assets/icons/attachment.png">
          <span class="filename">{{attachmentName}}</span>
          <a :href="policy.accessory" target="_blank"
            class="el-button el-button--text el-button--medium">
            <span>点击下载</span>
          </a>
        </div>
      </page-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

export default {
  name: 'PolicyDetail',

  components: {
    Breadcrumb,
    PageCard
  },

  props: {
    isEnterprise: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,

      policy: {}
    }
  },

  computed: {
    isAdmin() {
      return window.__APP_EDITION__ === 'MANAGEMENT'
    },

    breadcrumbItems() {
      if (this.isAdmin) {
        return [
          { name: '政策下放', route: { name: 'policy', query: { reset: false } } },
          { name: '政策详情' }
        ]
      } else {
        return [
          this.isEnterprise ? { name: '消息', route: { name: 'policies', query: { reset: false } } } : { name: '消息', route: { name: 'policy', query: { reset: false } } },
          { name: '消息详情' }
        ]
      }
    },

    attachmentName() {
      const filename = decodeURIComponent(this.policy.accessory)
      return filename.substring(filename.lastIndexOf('/') + 1)
    }
  },

  methods: {
    ...mapActions('policy', ['load'])
  },

  async created() {
    this.loading = true
    this.policy = await this.load(this.$route.params.id)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #333;
  line-height: 22px;
  text-align: center;
  margin-bottom: 16px;
}

.info {
  color: #999;
  font-size: 13px;
  line-height: 17px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  &.centered {
    justify-content: center;
  }

  span {
    margin-right: 40px;
    &:last-child {
      margin-right: 0;
    }
    &.summary {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.content {
  font-size: 13px;
}

.footer {
  padding: 10px 20px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  img {
    width: 14px;
    height: 16px;
    margin-right: 8px;
  }

  .filename {
    font-size: 13px;
    color: #666;
    margin-right: 8px;
  }

  a.el-button {
    font-size: 13px;
    text-decoration: none;
    padding: 0;
  }
}
</style>

