<template>
  <div class="page">
    <breadcrumb :items="breadcrumbItems"></breadcrumb>

    <div class="page-main">
      <page-card v-loading="loading">
        <el-form class="edit-training-form"
          :model="formData"
          :rules="formRules"
          ref="form"
          label-width="100px"
          label-suffix=":"
          style="width: 600px">
          <resource-input label="标签"
            name="label"
            resource-name="label"
            :value="formData.label"
            @input="formData.label = $event">
          </resource-input>

          <string-input label="问题"
            name="question"
            :value="formData.question"
            @input="formData.question = $event">
          </string-input>

          <string-input v-for="(option, index) in ['A', 'B', 'C', 'D']"
            :key="index"
            :label="`选项${option}`"
            :name="`option${option}`"
            :value="formData[`option${option}`]"
            @input="formData[`option${option}`] = $event">
          </string-input>

          <select-input label="答案"
            name="answer"
            :value="formData.title"
            :collection="answerCollection"
            @input="formData.answer = $event">
          </select-input>

          <string-input  label="标题"
            name="title"
            :value="formData.title"
            @input="formData.title = $event">
          </string-input >

          <el-form-item label="学习内容"
            prop="details"
            class="content-editor-container">
            <quill-editor v-model="formData.details"
              ref="contentEditor"
              :options="editorOption"
              class="content-editor">
            </quill-editor>
          </el-form-item>
        </el-form>

        <template slot="footer">
          <div class="form-buttons">
            <el-button type="primary" @click.stop.prevent="submitForm">保存</el-button>
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

  import each from 'lodash/each'
  import cloneDeep from 'lodash/cloneDeep'
  import { mapActions } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import PageCard from '@/components/PageCard'

  const formData = {
    question: null,
    optionA: null,
    optionB: null,
    optionC: null,
    optionD: null,
    answer: null,
    label: null,
    title: null,
    details: null,
    introduction : null
  }

  const formRules = {
    label: { required: true, message: '请填写标签', trigger: 'blur' },
    question: { required: true, message: '请填写问题', trigger: 'blur' },
    optionA: { required: true, message: '请填写选项A', trigger: 'blur' },
    optionB: { required: true, message: '请填写选项B', trigger: 'blur' },
    optionC: { required: true, message: '请填写选项C', trigger: 'blur' },
    optionD: { required: true, message: '请填写选项D', trigger: 'blur' },
    answer: { required: true, message: '请选择答案', trigger: 'blur' },
    title: { required: true, message: '请输入标题', trigger: 'blur' },
    details: { required: true, message: '请输入学习内容', trigger: 'blur' }
  }

  export default {
    name: 'EditTraining',

    components: {
      Breadcrumb,
      PageCard,
      quillEditor
    },

    data() {
      return {
        loading: false,
        formData: cloneDeep(formData),
        formRules,
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
        }
      }
    },

    computed: {
      breadcrumbItems() {
        return [
          { name: '教育培训', route: { name: 'safety-training-database', query: { reset: false } } },
          { name: this.$route.params.id ? '编辑问题' : '新增问题' }
        ]
      },

      myEditor() {
        return this.$refs.contentEditor.quill
      },

      answerCollection() {
        return ['A', 'B', 'C', 'D'].map(item => ({
          label: `选项${item}`,
          value: item.toLowerCase()
        }))
      }
    },

    methods: {
      ...mapActions('training', ['create', 'load', 'update']),

    async submitForm() {
        this.formData.introduction = this.myEditor.getText().slice(0,100)
        try {
          const valid = await this.$refs.form.validate()
          if (valid && !this.loading) {
            this.loading = true

            const data = Object.assign({}, this.formData)

            each(['A', 'B', 'C', 'D'], item => {
              data[item.toLowerCase()] = data[`option${item}`]
              delete data[`option${item}`]
            })

            if (this.$route.params.id) {
              await this.update({ id: this.$route.params.id, formData: data })
            } else {
              await this.create(data)
            }

            this.loading = false
            this.$router.go(-1)
          }
        } catch (error) {}
      }
    },

    async created() {
      this.formData = {
        question: null,
        optionA: null,
        optionB: null,
        optionC: null,
        optionD: null,
        answer: null,
        label: null,
        title: null,
        details: null,
        introduction: null
      }
      if (!this.$route.params.id) return

      this.loading = true
      const result = await this.load(this.$route.params.id)

      for (const key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
          if (key.startsWith('option')) {
            this.formData[key] = result[key.replace('option', '').toLowerCase()]
          } else {
            this.formData[key] = result[key]
          }
        }
      }

      this.loading = false
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
