<template>
  <el-dialog
    :title="repository.id ? '编辑知识' : '新增知识'"
    :visible.sync="visible"
    @close="clear"
    class="repository-form-dialog"
  >
    <el-form
      v-loading="loading"
      :model="repository"
      label-width="100px"
      ref="repository"
      :rules="rules"
      label-suffix="："
      :disabled="disabled"
    >
      <el-form-item label="类型名称" prop="typeName">
        <el-input v-model="repository.typeName" placeholder></el-input>
      </el-form-item>
      <el-form-item label="父级类型" prop="parentId">
        <el-cascader
          clearable
          :change-on-select="true"
          :props="parentSelectsProps"
          :options="parentSelects"
          v-model="parentIds"
          @change="handleParentChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="知识详情" prop="details" class="content-editor-container">
        <quill-editor
          v-model="repository.details"
          ref="contentEditor"
          :options="editorOption"
          :class="[{ 'isReadonly': disabled }, 'content-editor']"
          :disabled="disabled"
        ></quill-editor>
      </el-form-item>
      <el-form-item v-if="!disabled">
        <el-button type="primary" @click="submit()" :disabled="loading">确定</el-button>
        <el-button @click="clear" :disabled="loading">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'


export default {
  name: 'RepositoryForm',

  components: {
    quillEditor
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      visible: false,
      loading: false,
      id: null,
      parentSelects: [],
      parentIds: [],
      parentSelectsProps: {
        label: 'typeName',
        value: 'id'
      },
      repository: {
        id: '',
        parentId: '',
        typeName: '',
        details: ''
      },
      rules: {
        typeName: { required: true, message: '请输入类型名称', trigger: 'blur' },
        parentId: { required: true, message: '请输入父级类型', trigger: 'blur' },
        details: { required: true, message: '请输入知识详情', trigger: 'blur' }
      },
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
  },

  methods: {
    ...mapActions('repository', ['create', 'load', 'update', 'parentAll']),

    async show (row) {
      if (row) this.id = row.id
      this.visible = true
      this.loading = true
      if (this.id) this.repository = row
      this.parentSelects = await this.parentAll()
      this.loading = false

    },

    async  submit () {
      if (this.loading) return
      this.loading = true
      if (this.id) {
        await this.update({ id: this.id, formData: this.repository })
      } else {
        await this.create(this.repository)
      }
      this.visible = false
      this.loading = false
      this.clear()
    },

    clear () {
      this.visible = false
      this.parentIds = []
      this.repository = {
        id: '',
        parentId: '',
        typeName: '',
        details: ''
      }
    },

    handleParentChange () {
      this.repository.parentId = this.parentIds[this.parentIds.length - 1]
    },
  }
}
</script>

<style lang="scss" scoped>
.repository-form-dialog {
  .isReadonly {
    border-top: 1px solid #ccc;
    /deep/ .ql-toolbar {
      display: none;
    }
  }
  /deep/ .el-dialog {
    width: 1000px;
  }
  .content-editor {
    width: 100%;
    /deep/ {
      .ql-container {
        height: 180px;
      }

      .ql-snow .ql-picker {
        line-height: 1;
      }
    }
  }
}
</style>