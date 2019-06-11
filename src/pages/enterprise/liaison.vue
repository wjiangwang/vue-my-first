<template>
  <div class="page">
    <div class="page-main liaison-container">
      <page-card :scrollable="false" v-loading="loading" class="liaison-body">
        <div id="liaisonRecords" class="liaison-records">
          <div :class="item.eNickname ? 'liaison-records-r' : 'liaison-records-l'" v-for="item in items" v-if="items && items.length">
            <div class="liaison-time" v-if="item.createDate">
              {{strftime(item.createDate)}}
            </div>
            <div class="liaison-records-item" v-if="item.eNickname">
              <div class="liaison-records-item-content">
                <div class="liaison-name">
                  {{item.eNickname}}
                </div>
                <div style="clear: both;"></div>
                <div class="liaison-content">
                  {{item.information}}
                </div>
              </div>
              <img src="static/images/liaison-2.png" class="head-img">
            </div>
            <div class="liaison-records-item" v-else>
              <img src="static/images/liaison-1.png" class="head-img">
              <div class="liaison-records-item-content">
                <div class="liaison-name" v-if="item.gNickname">
                  {{item.gNickname}}
                </div>
                <div class="liaison-content">
                  {{item.information}}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="liaison-form-container">
          <img src="static/images/upload_file.png">
          <el-input :rows="6" type="textarea" v-model="information"></el-input>
          <el-button type="primary" size="small" @click.stop="submit">发送</el-button>
        </div>
      </page-card>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { Loading, MessageBox } from 'element-ui'
  import PageCard from '@/components/PageCard'
  import dayjs from 'dayjs'

  export default {
    name: 'liaison',

    components: {
      PageCard
    },

    data() {
      return {
        liaisons: [],
        loading: false,
        information: ''
      }
    },

    watch: {
      items() {
        setTimeout(() => {
          document.getElementById('liaisonRecords').scrollTop = document.getElementById('liaisonRecords').scrollHeight
        }, 10)
      }
    },

    computed: {
     ...mapState('liaison', ['items'])
    },

    methods: {
      ...mapActions('liaison', ['loadListData', 'create']),

      async submit() {
        if (this.loading) return
        if (!this.information) {
          return this.error('请输入内容')
        }
        this.loading = true
        await this.create({ information: this.information })
        this.information = ''
        this.loading = false
      },

      error (m) {
        this.loading = false
        MessageBox.alert(m)
      },

      strftime (t) {
        return t ? dayjs(t).format('YYYY-MM-DD HH:mm') : ''
      },
    },

    async created() {
      this.loading = true
      await this.loadListData()
      this.loading = false
    }
  }
</script>
<style lang="scss">
  .liaison-container {
    display: flex;
    justify-content: center;
    .liaison-body {
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      width: 50%;
      min-width: 800px;
      .liaison-records {
        padding: 20px;
        box-sizing: border-box;
        border-bottom: 2px solid #D4D4D4;
        min-height: 300px;
        height: 65%;
        overflow: hidden;
        overflow-y: auto;
        .liaison-time {
          color: #CCC;
          text-align: center;
          margin: 20px 0;
          font-size: 12px;
        }
        .liaison-records-item {
          display: flex;
          .head-img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin: 0 20px;
          }
          .liaison-records-item-content {
            width: calc(80% - 80px);
            .liaison-name {
              color: #999;
              font-size: 12px;
              margin-bottom: 5px;
              width: fit-content;
              width: -webkit-fit-content;
              width: -moz-fit-content;
              max-width: 100%;
            }
            .liaison-content {
              color: #333;
              border-radius: 0 6px 6px 6px;
              padding: 5px 10px;
              width: fit-content;
              width: -webkit-fit-content;
              width: -moz-fit-content;
              max-width: 100%;
              font-size: 14px;
            }
          }
        }
        .liaison-records-l {
          .liaison-content {
            border: 1px solid #EDEDED;
          }
        }
        .liaison-records-r {
          .liaison-records-item {
            justify-content: flex-end;
            .liaison-name {
              float: right;
            }
            .liaison-content {
              float: right;
              color: white !important;
              background-color: #37A9FA;
              border-radius: 6px 0 6px 6px !important;
            }
          }
        }
      }
      .liaison-form-container {
        padding: 10px 20px;
        .el-textarea {
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .el-button {
          float: right;
          width: 90px;
          font-size: 14px;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
