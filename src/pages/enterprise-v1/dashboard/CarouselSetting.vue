<template>
  <el-dialog :visible.sync="visible"
    title="轮播设置"
    width="600px"
    :modal="true"
    @closed="handleDialogClosed"
    class="carousel-setting-dialog">
    <div v-loading="loading" :element-loading-text="loadingText">
      <div class="items-container">
        <draggable v-model="items"
          :options="{ group: 'item', handle: '.handle', draggable: '.item.draggable' }">
          <div :class="{ item: true, draggable: item.types !== 'NOTICE' }"
            v-for="item in items" :key="item.id">
            <el-checkbox :checked="item.isShow === 'Y'"
              :disabled="item.types === 'NOTICE'"
              @change="selectItem(item.id, $event)">
              <span class="name">{{item.name}}</span>
            </el-checkbox>

            <el-button type="text"
              class="delete-button"
              title="删除"
              v-if="item.isDefault === 'N'"
              @click="deleteItem(item.id)">
              <i class="el-icon-delete"></i>
            </el-button>

            <span class="handle">
              <img src="@/assets/icons/sort.png">
            </span>
          </div>
        </draggable>
      </div>

      <div class="new-item">
        <el-upload class="upload"
          :action="uploadURL"
          :data="{ filedir: 'attachment' }"
          accept="image/*"
          :multiple="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          ref="uploader">
          <el-button size="medium" icon="el-icon-plus">添加轮播图片</el-button>
        </el-upload>
      </div>
    </div>

    <div slot="footer" class="form-buttons">
      <el-button type="primary" @click="submit" :disabled="loading">保存</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { clone } from 'lodash'
import draggable from 'vuedraggable'
import isImage from 'is-image'
import { Loading } from 'element-ui'
import { mapState, mapMutations, mapActions } from 'vuex'
import { getUploadURL } from '@/modules/utils'
import { getSession } from '@/modules/authentication'

export default {
  name: 'CarouselSetting',

  components: {
    draggable
  },

  data() {
    return {
      visible: false,
      loading: false,
      loadingText: '',
      items: []
    }
  },

  computed: {
    ...mapState('dashboardCarousel', { carouselItems: 'items' }),

    uploadURL() {
      return getUploadURL()
    }
  },

  methods: {
    ...mapMutations('dashboardCarousel', ['updateItemSelected']),
    ...mapActions('dashboardCarousel', ['loadItems', 'create', 'update', 'delete']),

    async show() {
      this.visible = true
      this.loading = false
      this.syncItems()
    },

    selectItem(id, selected) {
      const item = this.items.find(item => item.id === id)
      item.isShow = selected ? 'Y' : 'N'
    },

    handleBeforeUpload(file) {
      if (!isImage(file.name)) {
        this.$alert('请上传图片类型的文件', '错误提示', { type: 'warning' })
        return false
      }

      this.loading = true
      this.loadingText = '正在上传图片...'
    },

    async handleUploadSuccess(response, file) {
      this.loading = false

      if (response.status === 0) {
        this.loading = true
        this.loadingText = '正在添加...'

        await this.create({ name: file.name, url: response.data, isDefault: 'N' })
        this.syncItems()
        this.loading = false
      }
    },

    deleteItem(id) {
      this.$confirm('确认删除该轮播图片？', '确认删除', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const loading = Loading.service({
              target: instance.$el.querySelector('.el-message-box')
            })

            await this.delete(id)
            this.syncItems()
            loading.close()
            done()
          } else {
            done()
          }
        }
      })
    },

    async submit() {
      const items = this.items.map((item, index) => {
        return {
          bannerId: item.id,
          isShow: item.isShow,
          sort: index + 1
        }
      })

      this.loading = true
      this.loadingText = ''
      const result = await this.update({ bannerList: items })

      this.loading = false
      if (result.status === 0) {
        this.visible = false
        location.reload(true)
      }
    },

    syncItems() {
      this.items = this.carouselItems.map(item => clone(item))
    },

    handleDialogClosed() {
      this.items = []
    }
  }
}
</script>

<style lang="scss">
.carousel-setting-dialog /deep/ .el-dialog__body {
  padding: 0;
}

.items-container {
  .item {
    display: flex;
    align-items: center;
    padding: 17px 20px;
    border-bottom: 1px solid #EFF0F0;

    &:hover .delete-button {
      display: inline-block;
    }

    &.draggable .handle {
      display: inline;
    }

    /deep/ .el-checkbox {
      flex: 1;
    }

    .delete-button {
      display: none;
      padding: 0;
      color: #f56c6c;
      margin-right: 20px;
      &:hover {
        color: #f78989;
      }
      &:active {
        color: #f56c6c;
      }

      i {
        font-size: 18px;
      }
    }

    .handle {
      cursor: pointer;
      display: none;

      img {
        width: 24px;
        height: auto;
      }
    }
  }
}

.new-item {
  margin: 16px 0 6px;
  text-align: center;

  /deep/ .el-upload-list {
    display: none;
  }
}
</style>

