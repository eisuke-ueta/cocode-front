<template lang="pug">
div
  el-row(class="mb4")
    h1 {{ note.title }}
    div
      el-tag(v-for="tag in note.tags" :key="tag.id" class="mr1" size="small" effect="plain" type="info") {{ tag.name }}

  el-row(class="mb4" type="flex" align="middle")
    el-col(:span="12")
      el-row(type="flex" align="middle")
        div(class="mr2 pt2")
          el-avatar(size="small" class="avatar" :src="note.user.avatar")
        div
          div
            span {{ note.user.name }}
          div
            small {{ $moment(note.updatedAt).tz("Asia/Tokyo").format('YYYY年MM月DD日 HH時mm分') }}
    el-col(:span="12")
      el-row(type="flex" justify="end" align="middle")
        el-button(v-if="isMyNote" size="small" @click="handleEdit") 編集

  el-row(class="markdown-body")
    div(v-html="compileMarkdown")
</template>

<script>
import { mapState } from 'vuex'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import sanitizer from 'markdown-it-sanitizer'
import emoji from 'markdown-it-emoji'
import katex from '@iktakahiro/markdown-it-katex'

export default {
  components: {},
  props: {
    note: { type: Object, default: () => {}, required: true }
  },
  head() {
    return {
      title: 'ノート'
    }
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
      markdownIt: markdownIt
    }
  },
  computed: {
    compileMarkdown: function() {
      return this.markdownIt.render(this.note.description)
    },
    isMyNote() {
      return this.note.user.id === this.currentUser.id
    },
    ...mapState('auth', {
      currentUser: state => state.currentUser
    })
  },
  methods: {
    handleEdit() {
      this.$router.push(`/draft/${this.note.id}/edit`)
    }
  }
}
</script>

<style>
.avater:hover {
  cursor: pointer;
}
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
.title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
