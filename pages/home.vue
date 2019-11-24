<template lang="pug">
div
  el-row(class="mt4 mb4" type="flex" justify="center")
    el-col(:xs="24" :sm="18" :md="12" :lg="10")
      el-input(placeholder="キーワードを入力" v-model="keyword" @keyup.enter.native="handleSearch" @keypress.native="setKeywordReady")
        i(slot="prefix" class="el-input__icon el-icon-search")
  el-row(type="flex" justify="center")
    el-col(:xs="24" :sm="18" :md="12" :lg="10")
      NoteCard(:note="note" v-for="note in notes" :key="note.id" class="mb3")
</template>

<script scoped>
import { mapActions, mapState } from 'vuex'
import NoteCard from '@/components/notes/NoteCard'

const LIMIT = 10

export default {
  middleware: 'authenticated',
  components: {
    NoteCard
  },
  head() {
    return {
      title: 'ホーム'
    }
  },
  data() {
    return {
      keyword: '',
      isKeywordReady: false
    }
  },
  computed: {
    ...mapState('note', {
      notes: state => state.notes
    })
  },
  async asyncData({ store }) {
    await store.dispatch('note/getNotes', { offset: 0, limit: LIMIT })
  },
  created() {
    this.scroll()
  },
  methods: {
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight
        if (!bottomOfWindow || this.notes.length >= 100) return

        setTimeout(async () => {
          await this.handleAddNotes()
        }, 200)
      }
    },
    setKeywordReady() {
      this.isKeywordReady = true
    },
    async handleSearch() {
      if (!this.isKeywordReady) return

      await this.getNotes({
        offset: 0,
        limit: LIMIT,
        keyword: this.keyword
      })
    },
    async handleAddNotes() {
      await this.addNotes({
        offset: this.notes.length,
        limit: LIMIT,
        keyword: this.keyword
      })
    },
    ...mapActions('note', ['getNotes', 'addNotes'])
  }
}
</script>

<style scoped></style>
