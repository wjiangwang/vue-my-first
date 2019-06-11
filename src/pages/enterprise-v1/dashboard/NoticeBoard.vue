<template>
  <div class="dashboard-carousel-item-content notice-board">
    <div class="content">
      <div class="enterprise-name">{{notice.enterpriseName}}</div>

      <p>
        {{notice.remarkOne}}
      </p>

      <p>
        {{notice.remarkTwo}}
        <a href="javascript:;" class="edit-button" @click="showNoticeForm" v-if="notice.id">
          <img src="@/assets/icons/edit-outline.png">
        </a>
      </p>

      <div class="inscribe">
        <p>主要负责人：{{notice.enterprinc}}</p>
        <p>{{notice.lastDay | strftime('YYYY年MM月DD日') }}</p>
      </div>
    </div>

    <notice-form ref="noticeForm" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoticeForm from './NoticeForm'

export default {
  name: 'NoticeBoard',

  components: {
    NoticeForm
  },

  computed: {
    ...mapState('dashboardNotice', ['notice'])
  },

  methods: {
    showNoticeForm() {
      this.$refs.noticeForm.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-board {
  .content {
    margin: 12px 0 0;
    padding-top: 30px;
    font-size: 14px;

    .enterprise-name {
      font-weight: 600;
      color: #4c4c4c;
      line-height: 20px;
    }

    p {
      color: #333;
      line-height: 26px;
      text-indent: 2em;
      margin: 11px 0;
    }

    .edit-button {
      position: relative;

      img {
        width: 20px;
        height: 20px;
        position: absolute;
        top: -3px;
      }
    }

    .inscribe {
      text-align: right;
      text-indent: 0;
      margin-top: 20px;

      p {
        line-height: 17px;
        &:first-child {
          margin-bottom: 11px;
        }
      }
    }
  }
}

.screen-drop {
  &.dark-mode .notice-board {
    .enterprise-name, p {
      color: #eee;
    }
  }

  .notice-board {
    .content {
      border-top: 1px solid #F4593C;
      font-size: 2.25em;

      .edit-button {
        display: none;
      }

      .enterprise-name {
        line-height: 1.39;
      }

      p {
        line-height: 1.39;
      }

      .inscribe {
        margin-top: 30px;
      }
    }
  }
}
</style>
