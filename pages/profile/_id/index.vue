<template lang="pug">
div
  el-row(class="mt3 mb3" type="flex" justify="center")
    el-col(:xs="24" :sm="18" :md="12")
      UserCard(:user="user")
  el-row(type="flex" justify="center")
    el-col(:xs="24" :sm="18" :md="12")
      el-tabs(type="card")
        el-tab-pane(label="ホーム")
          el-row
            el-col(v-for="note in notes" :key="note.id" class="mb3")
              NoteCard(:note="note")
</template>

<script scoped>
import { mapActions, mapState } from 'vuex'
import UserCard from '@/components/users/UserCard'
import NoteCard from '@/components/notes/NoteCard'

export default {
  middleware: 'authenticated',
  components: {
    UserCard,
    NoteCard
  },
  head() {
    return {
      title: 'プロフィール'
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('user', {
      user: state => state.user
    }),
    ...mapState('note', {
      notes: state => state.notes
    })
  },
  async asyncData({ params, store }) {
    const response = await store.dispatch('user/getUserByAlias', {
      alias: params.id
    })
    const offset = 0
    const limit = 10
    await store.dispatch('note/getNotes', {
      offset: offset,
      limit: limit,
      userId: response.data.user.id
    })
    return {
      offset: offset,
      limit: limit
    }
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
          await this.addNotes({
            offset: this.notes.length,
            limit: this.limit,
            keyword: this.keyword
          })
        }, 200)
      }
    },
    ...mapActions('note', ['getNotes', 'addNotes'])
  }
}
</script>

<style scoped></style>
