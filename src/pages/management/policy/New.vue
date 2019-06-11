<template>
  <div class="page">
    <breadcrumb :items="breadcrumbItems"></breadcrumb>

    <div class="page-main">
      <page-card v-loading="loading">
        <el-form class="new-policy-form"
          :model="formData"
          :rules="formRules"
          label-width="80px"
          label-suffix=":"
          ref="form"
          size="small"
          style="width: 600px">
          <string-input label="标题"
            name="title"
            :value="formData.title"
            @input="formData.title = $event">
          </string-input>

          <string-input label="摘要"
            name="digest"
            :value="formData.digest"
            @input="formData.digest = $event">
          </string-input>

          <string-input label="分类"
            name="titleType"
            :value="formData.titleType"
            @input="formData.titleType = $event">
          </string-input>

          <el-form-item label="正文"
            prop="textBody"
            class="content-editor-container">
            <quill-editor v-model="formData.textBody"
              ref="contentEditor"
              :options="editorOption"
              class="content-editor">
            </quill-editor>
          </el-form-item>

          <district-input label="区域"
            name="riskDistrictId"
            :value="formData.riskDistrictId"
            :select-any="true"
            @input="formData.riskDistrictId = $event">
          </district-input>

          <attachment-input label="附件"
            name="accessory"
            :value="formData.accessory"
            @input="formData.accessory = $event">
          </attachment-input>
        </el-form>

        <template slot="footer">
          <div class="form-buttons">
            <el-button type="primary" @click="submitForm">
              {{$route.params.id ? '保存' : '确定发送'}}
            </el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </div>
        </template>
      </page-card>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

import cloneDeep from 'lodash/cloneDeep'
import { mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

const formData = {
  title: null,
  digest: null,
  titleType: null,
  textBody: null,
  riskDistrictId: null,
  accessory: null
}

const formRules = {
  title: { required: true, message: '请填写标题', trigger: 'blur' },
  digest: { required: true, message: '请填写摘要', trigger: 'blur' },
  titleType: { required: true, message: '请填写分类', trigger: 'blur' },
  textBody: { required: true, message: '请填写正文', trigger: 'change' },
  riskDistrictId: { required: true, message: '请选择区域', trigger: 'change' },
  accessory: { required: true, message: '请上传附件', trigger: 'change' }
}

export default {
  name: 'NewPolicy',

  components: {
    Breadcrumb,
    PageCard,
    quillEditor
  },

  data() {
    return {
      loading: false,

      editorOption: {
        placeholder: '',
        bounds: '.content-editor-container',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            ['link']
          ]
        }
      },

      formData: cloneDeep(formData),
      formRules
    }
  },

  computed: {
    breadcrumbItems() {
      return [
        { name: '政策下放', route: { name: 'policy', query: { reset: false } } },
        { name: this.$route.params.id ? '编辑消息' : '发信息' }
      ]
    }
  },

  methods: {
    ...mapActions('policy', ['create', 'load', 'update']),

    async submitForm() {
      try {
        const valid = await this.$refs.form.validate()
        if (valid) {
          this.loading = true

          if (this.$route.params.id) {
            const result = await this.update({ id: this.$route.params.id, formData: this.formData })
            this.loading = false

            if (result && result.status === 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$router.go(-1)
            }
          } else {
            await this.create(this.formData)
            this.loading = false
            this.$router.go(-1)
          }
        }
      } catch (error) {}
    }
  },

  async created() {
    if (this.$route.params.id) {
      this.loading = true
      this.formData = await this.load(this.$route.params.id)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content-editor {
  width: 800px;
  /deep/ {
    .ql-container {
      height: 180px;
    }

    .ql-snow .ql-picker {
      line-height: 1;
    }
  }
}
</style>
