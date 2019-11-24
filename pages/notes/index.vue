<template lang="pug">
el-row(class="mt3 mb3" type="flex" justify="center")
  el-col(:xs="24" :sm="18")
    el-row(class="mb3")
      el-col(class="mb3")
        h3 ノート一覧
      el-col(class="mb3")
        NoteTable(:notes="notes")
      el-col(class="text-center")
        el-pagination(
          layout="prev, pager, next" 
          :total="noteCount" 
          @current-change="handleCurrentChange"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick")
</template>

<script>
import { mapActions, mapState } from 'vuex'
import NoteTable from '@/components/notes/NoteTable'

const LIMIT = 20
const STATUS_ALL = 'all'

export default {
  middleware: 'authenticated',
  components: {
    NoteTable
  },
  head() {
    return {
      title: 'ノート管理'
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('auth', {
      currentUser: state => state.currentUser
    }),
    ...mapState('note', {
      notes: state => state.notes,
      noteCount: state => state.count
    })
  },
  async asyncData({ store }) {
    const currentUser = store.state.auth.currentUser
    await store.dispatch('note/getNotes', {
      offset: 0,
      limit: LIMIT,
      status: STATUS_ALL,
      userId: currentUser.id
    })
    await store.dispatch('note/getNoteCount', {
      status: STATUS_ALL,
      userId: currentUser.id
    })
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.handleGetNotes(currentPage)
    },
    handlePrevClick(currentPage) {
      this.handleGetNotes(currentPage)
    },
    handleNextClick(currentPage) {
      this.handleGetNotes(currentPage)
    },
    async handleGetNotes(currentPage) {
      await this.getNotes({
        offset: LIMIT * (currentPage - 1),
        limit: LIMIT,
        status: STATUS_ALL,
        userId: this.currentUser.id
      })
    },
    ...mapActions('note', ['getNotes'])
  }
}
</script>

<style scoped></style>
