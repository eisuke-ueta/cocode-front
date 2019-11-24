<template lang="pug">
div(v-if="form")
  el-row(class="mb3")
    el-button(class="float-right" type="primary" size="small" @click="handlePublish('note')") 投稿設定
    el-button(class="float-right mr2" size="small" @click="handleSave('note')") 下書き保存
  el-form(ref="note" :model="form" :rules="rules" name="note")
    //- el-form-item(class="thumbnail-form-item" prop="thumbnail")
    //-   el-upload(
    //-     class="thumbnail-uploader"
    //-     :before-upload="beforeThumbnailUpload"
    //-     :on-success="handleThumbnailSuccess"
    //-     :show-file-list="false"
    //-     action="#"
    //-     accept="image/jpeg,image/png")
    //-     img(v-if="form.thumbnail" :src="form.thumbnail" class="thumbnail" fits="cover")
    //-     i(v-if="!form.thumbnail" class="el-icon-picture thumbnail-uploader-icon")
    //- el-form-item(class="flex" prop="code")
    //-   el-upload(
    //-     :before-upload="beforeCodeUpload"
    //-     :on-success="handleCodeSuccess"
    //-     :limit="1"
    //-     action="#"
    //-     accept="application/zip")
    //-     el-button ZIPアップロード
    el-form-item(prop="title")
      el-input(v-model="form.title" placeholder="タイトル")
    //- el-form-item(prop="tags")
    //-   el-input(v-model="form.tags" placeholder="タグをカンマ区切りで最大5つまで入力（例：Python,Docker）")
    el-form-item(prop="description" class="description")
      el-tabs(type="border-card")
        el-tab-pane(label="編集")
          el-input(type="textarea" v-model="form.description" :rows="25" placeholder="ノートをMarkdown記法で書いて投稿しましょう。")
        el-tab-pane(class="md-preview" label="プレビュー" class="markdown-body")
          div(v-html="compileMarkdown")

  //- Dialog
  el-dialog(title="投稿設定" :visible.sync="dialogFormVisible")
    el-form(ref="sale" :model="form" :rules="rules" name="sale" label-width="80px")
      el-form-item(prop="saleType" label="販売設定")
        el-radio(size="small" v-model="form.saleType" label="free" border) 無料
        el-radio(size="small" v-model="form.saleType" label="payAsUse" border) 有料
      el-form-item(v-if="!isSaleFree" prop="salePrice" label="料金")
          el-input(size="small" v-model.number="form.salePrice" autocomplete="off")
            template(slot="append") 円
    span(slot="footer")
      el-button(size="small" @click="dialogFormVisible = false") キャンセル
      el-button(size="small" type="primary" @click="handleSubmit('sale')") 投稿
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

const SALE_STATUS = {
  FREE: 'free'
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

    const validateSalePrice = (rule, value, callback) => {
      if (value < 0 || value > 10000) {
        callback(new Error('料金は0円以上1万円以内にしてください'))
      } else {
        callback()
      }
    }
    return {
      markdownIt: markdownIt,
      form: {
        id: this.note ? this.note.id : '',
        userId: this.note ? this.note.user.id : '',
        title: this.note ? this.note.title : '',
        thumbnail: this.note ? this.note.thumbnail : '',
        code: this.note ? this.note.code : '',
        description: this.note ? this.note.description : '',
        status: NOTE_STATUS.DRAFT,
        saleType: this.note ? this.note.saleType : SALE_STATUS.FREE,
        salePrice: this.note ? this.note.salePrice : 0
      },
      rules: {
        title: [
          {
            required: true,
            message: 'タイトルを入力してください',
            trigger: 'change'
          },
          {
            max: 40,
            message: 'タイトルは40文字以下にしてください',
            trigger: 'change'
          }
        ],
        description: [
          {
            required: true,
            message: '本文を入力してください',
            trigger: 'change'
          }
        ],
        salePrice: [
          {
            required: true,
            message: '料金を入力してください',
            trigger: 'change'
          },
          {
            type: 'number',
            message: '数字を入力してください',
            trigger: 'change'
          },
          {
            validator: validateSalePrice,
            trigger: 'change'
          }
        ]
      },
      dialogFormVisible: false
    }
  },
  computed: {
    compileMarkdown() {
      return this.markdownIt.render(this.form.description)
    },
    isSaleFree() {
      return this.form.saleType === SALE_STATUS.FREE
    },
    ...mapState('auth', {
      currentUser: state => state.currentUser
    })
  },
  methods: {
    async handlePublish(formName) {
      const isValid = await this.$refs[formName].validate()
      if (!isValid) return
      this.dialogFormVisible = true
    },
    async handleSave(formName) {
      const isValid = await this.$refs[formName].validate()
      if (!isValid) return

      this.form.userId = this.currentUser.id
      this.form.status = NOTE_STATUS.DRAFT

      const response = this.isNewNote()
        ? await this.createNote({ form: this.form })
        : await this.updateNote({ form: this.form })
      if (response.status === 200) {
        this.$message('ノートを保存しました。')
      } else {
        this.$message('ノートを保存できませんでした。')
      }
    },
    isEmpty(object) {
      return Object.keys(object).length === 0
    },
    isNewNote() {
      return !this.note
    },
    async handleSubmit(formName) {
      const isValid = await this.$refs[formName].validate()
      if (!isValid) return

      this.form.userId = this.currentUser.id
      this.form.status = NOTE_STATUS.PUBLISHED

      const response = this.isNewNote()
        ? await this.createNote({ form: this.form })
        : await this.updateNote({ form: this.form })
      if (response.status === 200) {
        const note = response.data.note
        this.$router.push(`/notes/${note.id}`)
      } else {
        this.$message('投稿できませんでした。')
      }
    },
    handleThumbnailSuccess(response, file) {
      this.form.thumbnailUrl = URL.createObjectURL(file.raw)
    },
    handleCodeSuccess(response, file) {
      this.form.thumbnailUrl = URL.createObjectURL(file.raw)
    },
    beforeThumbnailUpload(file) {
      const isAcceptedFormat =
        file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isAcceptedFormat) {
        this.$message.error('画像はJPG/PNGをご利用ください。')
      }
      if (!isLt2M) {
        this.$message.error('画像は2MB以下にしてください。')
      }
      return isAcceptedFormat && isLt2M
    },
    beforeCodeUpload(file) {
      const isAcceptedFormat = file.type === 'application/zip'
      const isLt100M = file.size / 1024 / 1024 < 50

      if (!isAcceptedFormat) {
        this.$message.error('ZIP形式をご利用ください。')
      }
      if (!isLt100M) {
        this.$message.error('ソースコードは50MB以下にしてください。')
      }
      return isAcceptedFormat && isLt100M
    },
    ...mapActions('note', ['createNote', 'updateNote'])
  }
}
</script>

<style>
.thumbnail-form-item .el-form-item__content {
  line-height: 0;
}
.thumbnail-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
}
.thumbnail-uploader .el-upload:hover {
  border-color: #409eff;
}
.thumbnail-uploader-icon {
  font-size: 3rem;
  color: #8c939d;
  width: 100%;
  max-height: 320px;
  line-height: 250px;
  text-align: center;
}
.thumbnail {
  width: 100%;
  max-height: 320px;
  display: block;
}
.el-radio {
  margin-right: 0 !important;
}
.flex {
  display: flex;
}
.description .el-tabs {
  box-shadow: none;
}
.md-preview {
  margin: 0 15px;
}
</style>
