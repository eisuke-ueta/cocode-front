<template lang="pug">
el-container
  el-header(class="header")
    el-row(type="flex" justify="center")
      el-col
        el-menu(mode="horizontal" @select="handleSelect")
          el-menu-item(class="header-title" index="/") CoCode
          el-menu-item(class="header-button float-right")
            el-button(size="small" @click="handleSave") 下書き保存
            el-button(type="primary" size="small" @click="handleSubmit") 投稿
  el-main
    el-row(class="draft-container" type="flex" justify="center")
      el-col(:xs="24")
        el-form(class="note-form-container" ref="note" :model="form" name="note")
          el-row(class="mb2" type="flex")
            el-col
              el-input(v-model="form.title" placeholder="タイトル")
          el-row(class="mb2" type="flex")
            el-col(class="flex")
              el-input(class="mr2" size="small" v-model="form.tags" placeholder="タグをカンマ区切りで最大5つまで入力（例：Python,Docker）")
              el-upload(
                class="image-uploader mr2"
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :show-file-list="false"
                action="#"
                accept="image/jpeg,image/png,image/gif")
                el-button(class="action-button" size="small" icon="el-icon-picture")
              //- div
              //-   el-button(class="action-button mr2" size="small" icon="el-icon-question")
              //- div
              //-   el-button(class="action-button mr2" size="small" icon="el-icon-warning")
              el-tag(type="info") {{ getStatus() }}
          el-form-item(class="description-container" prop="description" class="description")
            el-row(type="flex" :gutter="10")
              el-col(:span="12")
                el-input(type="textarea" v-model="form.description" @keydown.tab.native.prevent="handleKeydownTab" resize="none" placeholder="ノートをMarkdown記法で書いて投稿sしましょう。")
              el-col(:span="12")
                div(class="markdown-body md-preview")
                  div(v-html="compileMarkdown")
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import sanitizer from 'markdown-it-sanitizer'
import emoji from 'markdown-it-emoji'
import katex from '@iktakahiro/markdown-it-katex'

const NOTE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
}

export default {
  components: {},
  props: {
    note: { type: Object, default: () => {} }
  },
  data() {
    const markdownIt = MarkdownIt({
      highlight: function(code, lang) {
        return hljs.highlightAuto(code, [lang]).value
      },
      html: true,
      linkify: true,
      breaks: true,
      typographer: true
    })
      .use(katex, { throwOnError: false, errorColor: ' #cc0000' })
      .use(emoji)
      .use(sanitizer)

    return {
      markdownIt: markdownIt,
      form: {
        id: this.note ? this.note.id : '',
        userId: this.note ? this.note.user.id : '',
        title: this.note ? this.note.title : '',
        tags: this.note ? this.note.tags.map(tag => tag.name).join(',') : '',
        description: this.note ? this.note.description : '',
        status: this.note ? this.note.status : NOTE_STATUS.DRAFT
      }
    }
  },
  computed: {
    compileMarkdown() {
      return this.markdownIt.render(this.form.description)
    },
    ...mapState('auth', {
      currentUser: state => state.currentUser
    })
  },
  methods: {
    getStatus() {
      return this.form.status === NOTE_STATUS.DRAFT ? '未投稿' : '投稿済'
    },
    handleKeydownTab(event) {
      event.preventDefault()
      const start = event.target.selectionStart
      const end = event.target.selectionEnd
      const value = event.target.value
      event.target.value =
        value.substring(0, start) + '    ' + value.substring(end)
      event.target.selectionStart = start + 4
      event.target.selectionEnd = start + 4
    },
    beforeUpload(file) {
      const isAcceptedFormat =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isAcceptedFormat) {
        this.$message.error('JPG/PNG/GIFをご利用ください。')
      }
      if (!isLt2M) {
        this.$message.error('サイズは2MB以下にしてください。')
      }
      return isAcceptedFormat && isLt2M
    },
    async handleUploadSuccess(res, file) {
      const response = await this.uploadFile({ file: file.raw })
      if (response.status === 200) {
        const storedFile = response.data.file
        const fileText = '![' + storedFile.name + '](' + storedFile.path + ')'
        this.form.description = this.form.description + '\n' + fileText
      } else {
        this.$message('画像を保存できませんでした。')
      }
    },
    validate() {
      if (!this.form.title || !this.form.description) {
        this.$message.error('タイトルと内容を入力してください。')
      }
      if (this.getTags().length > 5) {
        this.$message.error('タグはカンマ区切りで最大5つまで入力できます。')
      }
    },
    async handleSave() {
      this.validate()

      this.form.userId = this.currentUser.id
      this.form.tags = this.getTags()
      this.form.status = NOTE_STATUS.DRAFT

      const response = this.isNewNote()
        ? await this.createNote({ form: this.form })
        : await this.updateNote({ form: this.form })
      if (response.status === 200) {
        this.$router.push(`/notes/${response.data.note.id}`)
      } else {
        this.$message.error('ノートを保存できませんでした。')
      }
    },
    getTags() {
      return this.form.tags
        .split(',')
        .filter(tag => tag)
        .map(tag => tag.trim())
    },
    isNewNote() {
      return !this.note
    },
    async handleSubmit() {
      this.validate()

      this.form.userId = this.currentUser.id
      this.form.tags = this.getTags()
      this.form.status = NOTE_STATUS.PUBLISHED

      const response = this.isNewNote()
        ? await this.createNote({ form: this.form })
        : await this.updateNote({ form: this.form })
      if (response.status === 200) {
        this.$router.push(`/notes/${response.data.note.id}`)
      } else {
        this.$message('投稿できませんでした。')
      }
    },
    handleSelect(key, keyPath) {
      if (key !== '/') return
      this.$router.push(key)
    },
    ...mapActions('note', ['createNote', 'updateNote']),
    ...mapActions('file', ['uploadFile'])
  }
}
</script>

<style>
.el-container {
  height: 100vh;
}
.el-header {
  padding: 0;
  width: 100%;
}
.el-main {
  padding: 0.5rem;
}
.header-title {
  font-size: 1.2rem;
  color: #303133 !important;
}
.header-title.is-active {
  border-bottom: none !important;
}
.draft-container {
  height: 100%;
}
.note-form-container {
  height: 100%;
}
.description-container {
  height: calc(100% - 72px - 1rem);
}
.description-container .el-form-item__content {
  height: 100%;
}
.description-container .el-form-item__content .el-row {
  height: 100%;
}
.description-container .el-form-item__content .el-row .el-textarea {
  height: 100%;
}
.description-container
  .el-form-item__content
  .el-row
  .el-textarea
  .el-textarea__inner {
  height: 100%;
}
.el-form {
  height: 100%;
}
.el-form-item {
  margin-bottom: 0.5rem !important;
}
.md-preview {
  overflow: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  height: 100%;
  padding: 5px 15px;
}
.image-uploader {
  display: inline-block;
}
.action-button i {
  font-size: 1rem;
}
.action-button {
  padding: 7px 12px;
}
</style>
